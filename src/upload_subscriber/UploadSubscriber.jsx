

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createConsumer } from '@rails/actioncable';
import {
  Upload, X, CheckCircle, AlertCircle, FileText,
  Loader2, ChevronDown, ChevronUp, Download, Users,
  AlertTriangle, Info, SkipForward,
} from 'lucide-react';

const SUBDOMAIN = window.location.hostname.split('.')[0];
const H = { 'X-Subdomain': SUBDOMAIN };

// ── helpers ───────────────────────────────────────────────────────────────────
const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content || '';

// ─── Main export ──────────────────────────────────────────────────────────────
export function SubscriberImportButton({ onImportComplete }) {
  const [open,        setOpen]        = useState(false);
  const [file,        setFile]        = useState(null);
  const [dragOver,    setDragOver]    = useState(false);
  const [importing,   setImporting]   = useState(false);
  const [jobId,       setJobId]       = useState(null);
  const [progress,    setProgress]    = useState(null); // { pct, done, total, current_row, phase }
  const [errors,      setErrors]      = useState([]);   // [{ row, message }]
  const [warnings,    setWarnings]    = useState([]);
  const [done,        setDone]        = useState(false);
  const [showErrors,  setShowErrors]  = useState(true);
  const [subscription,setSubscription]= useState(null);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  // ── auto-scroll log ──────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [progress, errors]);

  // ── ActionCable subscription ─────────────────────────────────────────────
  const subscribeToJob = useCallback((id) => {
    const cable = createConsumer('/cable');
    const sub = cable.subscriptions.create(
      { channel: 'ImportProgressChannel', job_id: id, subdomain: SUBDOMAIN },
      {
        received(data) {
          if (data.type === 'progress') {
            setProgress({
              pct:         data.pct,
              done:        data.done,
              total:       data.total,
              current_row: data.current_row,
              phase:       data.phase,      // 'parsing' | 'creating' | 'done'
              message:     data.message,
            });
            if (data.errors?.length)   setErrors(prev => [...prev, ...data.errors]);
            if (data.warnings?.length) setWarnings(prev => [...prev, ...data.warnings]);
          }
          if (data.type === 'complete') {
            setProgress(p => ({ ...p, pct: 100, phase: 'done', message: data.message }));
            setDone(true);
            setImporting(false);
            if (data.errors?.length)   setErrors(prev => [...prev, ...data.errors]);
            if (data.warnings?.length) setWarnings(prev => [...prev, ...data.warnings]);
            sub.unsubscribe();
            onImportComplete?.();
          }
          if (data.type === 'error') {
            setErrors(prev => [...prev, { row: null, message: data.message }]);
            setImporting(false);
            setDone(true);
            sub.unsubscribe();
          }
        },
      }
    );
    setSubscription(sub);
    return sub;
  }, [onImportComplete]);

  // cleanup on unmount
  useEffect(() => () => subscription?.unsubscribe(), [subscription]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = () => {
    setFile(null);
    setImporting(false);
    setJobId(null);
    setProgress(null);
    setErrors([]);
    setWarnings([]);
    setDone(false);
    subscription?.unsubscribe();
    setSubscription(null);
  };

  const handleClose = () => { if (!importing) { reset(); setOpen(false); } };

  // ── File pick ────────────────────────────────────────────────────────────
  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setErrors([{ row: null, message: 'Only CSV or Excel files are accepted.' }]);
      return;
    }
    setErrors([]);
    setFile(f);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!file) return;
    setImporting(true);
    setDone(false);
    setErrors([]);
    setWarnings([]);
    setProgress({ pct: 0, done: 0, total: 0, phase: 'uploading', message: 'Uploading file…' });

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/import_subscribers', {
        method: 'POST',
        headers: { 'X-Subdomain': SUBDOMAIN, 'X-CSRF-Token': csrf() },
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors([{ row: null, message: data.error || 'Upload failed.' }]);
        setImporting(false);
        setProgress(null);
        return;
      }

      // server returns { job_id: "xxx" } and enqueues ImportSubscribersJob
      const id = data.job_id;
      setJobId(id);
      setProgress({ pct: 1, done: 0, total: data.total || 0, phase: 'parsing', message: 'File received — starting import…' });
      subscribeToJob(id);
    } catch (e) {
      setErrors([{ row: null, message: e.message }]);
      setImporting(false);
      setProgress(null);
    }
  };

  // ── Phase labels ─────────────────────────────────────────────────────────
  const phaseLabel = {
    uploading: 'Uploading…',
    parsing:   'Parsing file…',
    creating:  'Creating subscribers…',
    done:      'Import complete',
  };

  const phaseColor = {
    uploading: 'bg-sky-500',
    parsing:   'bg-violet-500',
    creating:  'bg-emerald-500',
    done:      'bg-emerald-500',
  };

  const successCount = progress?.done   || 0;
  const errCount     = errors.filter(e => e.row).length;
  const warnCount    = warnings.length;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200
          text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
        <Upload size={15} className="text-slate-500" />
        Import Subscribers
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleClose}>
            <motion.div
              initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Users size={15} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Import Subscribers</p>
                    <p className="text-xs text-slate-400">CSV or Excel · max 5 000 rows</p>
                  </div>
                </div>
                <button onClick={handleClose} disabled={importing}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                    hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40">
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

                {/* ── File drop zone — only before import starts ── */}
                {!importing && !done && (
                  <>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        dragOver ? 'border-violet-400 bg-violet-50' : file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}>
                      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                        onChange={e => handleFile(e.target.files[0])} />
                      {file ? (
                        <>
                          <FileText size={28} className="text-emerald-500 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                          <p className="text-xs text-emerald-500 mt-1">{(file.size / 1024).toFixed(1)} KB · ready to import</p>
                          <button onClick={e => { e.stopPropagation(); setFile(null); }}
                            className="mt-3 text-xs text-slate-400 hover:text-red-500 underline">
                            Remove file
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-600">Drop your file here</p>
                          <p className="text-xs text-slate-400 mt-1">or click to browse · CSV, XLSX, XLS</p>
                        </>
                      )}
                    </div>

                    {/* Template download hint */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-100">
                      <Info size={13} className="text-sky-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-sky-700 leading-relaxed">
                        File must have columns: <span className="font-semibold">name, phone, package, address, id_number</span> (and optionally <span className="font-semibold">expiration_date</span>).
                        <a href="/api/import_template.csv" download className="ml-1.5 underline font-semibold inline-flex items-center gap-1">
                          <Download size={11} /> Download template
                        </a>
                      </p>
                    </div>
                  </>
                )}

                {/* ── Progress panel ── */}
                {(importing || done) && progress && (
                  <div className="space-y-4">
                    {/* Phase badge + summary counts */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${phaseColor[progress.phase] || 'bg-slate-500'}`}>
                        {progress.phase === 'done'
                          ? <CheckCircle size={11} />
                          : <Loader2 size={11} className="animate-spin" />
                        }
                        {phaseLabel[progress.phase] || progress.phase}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        {successCount > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle size={11} /> {successCount} imported
                          </span>
                        )}
                        {warnCount > 0 && (
                          <span className="flex items-center gap-1 text-amber-500 font-semibold">
                            <SkipForward size={11} /> {warnCount} skipped
                          </span>
                        )}
                        {errCount > 0 && (
                          <span className="flex items-center gap-1 text-red-500 font-semibold">
                            <AlertCircle size={11} /> {errCount} errors
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Big progress bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-slate-500 font-medium">
                          {progress.total > 0
                            ? `${progress.done} / ${progress.total} rows`
                            : 'Processing…'}
                        </p>
                        <p className="text-xs font-bold text-slate-700">{Math.round(progress.pct)}%</p>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full transition-all ${phaseColor[progress.phase] || 'bg-slate-400'}`}
                          animate={{ width: `${progress.pct}%` }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      </div>
                      {progress.current_row && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{progress.current_row}</p>
                      )}
                    </div>

                    {/* Live log */}
                    <div ref={scrollRef}
                      className="h-36 overflow-y-auto rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1 text-xs font-mono">
                      {progress.message && (
                        <p className="text-slate-500">› {progress.message}</p>
                      )}
                      {warnings.map((w, i) => (
                        <p key={`w${i}`} className="text-amber-600">
                          ⚠ {w.row ? `Row ${w.row}: ` : ''}{w.message}
                        </p>
                      ))}
                      {errors.filter(e => e.row).map((e, i) => (
                        <p key={`e${i}`} className="text-red-500">
                          ✕ Row {e.row}: {e.message}
                        </p>
                      ))}
                      {done && (
                        <p className="text-emerald-600 font-bold">✓ Import finished.</p>
                      )}
                    </div>

                    {/* Done summary card */}
                    {done && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${
                          errCount > 0
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-emerald-50 border-emerald-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {errCount > 0
                            ? <AlertTriangle size={15} className="text-amber-500" />
                            : <CheckCircle size={15} className="text-emerald-600" />
                          }
                          <p className="text-sm font-bold text-slate-800">
                            {errCount > 0 ? 'Import completed with issues' : 'Import successful!'}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            { label: 'Imported',  value: successCount, color: 'text-emerald-700' },
                            { label: 'Skipped',   value: warnCount,    color: 'text-amber-600'  },
                            { label: 'Errors',    value: errCount,     color: 'text-red-500'    },
                          ].map(s => (
                            <div key={s.label} className="bg-white rounded-lg p-2 shadow-sm">
                              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                              <p className="text-[10px] text-slate-400">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Errors list — expandable */}
                    {errors.filter(e => e.row).length > 0 && (
                      <div className="rounded-xl border border-red-100 overflow-hidden">
                        <button onClick={() => setShowErrors(v => !v)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors">
                          <span className="flex items-center gap-2">
                            <AlertCircle size={14} /> {errCount} row error{errCount !== 1 ? 's' : ''}
                          </span>
                          {showErrors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <AnimatePresence>
                          {showErrors && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                              className="overflow-hidden">
                              <div className="max-h-48 overflow-y-auto divide-y divide-red-50">
                                {errors.filter(e => e.row).map((e, i) => (
                                  <div key={i} className="flex gap-3 px-4 py-2.5 hover:bg-red-50">
                                    <span className="text-xs font-bold text-red-400 shrink-0 w-14">Row {e.row}</span>
                                    <p className="text-xs text-red-700">{e.message}</p>
                                  </div>
                                ))}
                              </div>
                              {/* Download errors CSV */}
                              <div className="px-4 py-2.5 bg-red-50 border-t border-red-100">
                                <button onClick={() => downloadErrorsCsv(errors)}
                                  className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline">
                                  <Download size={11} /> Download errors as CSV
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Warnings list */}
                    {warnings.length > 0 && (
                      <div className="rounded-xl border border-amber-100 overflow-hidden">
                        <div className="px-4 py-3 bg-amber-50 flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          <p className="text-sm font-semibold text-amber-700">{warnCount} skipped row{warnCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="max-h-36 overflow-y-auto divide-y divide-amber-50">
                          {warnings.map((w, i) => (
                            <div key={i} className="flex gap-3 px-4 py-2.5">
                              <span className="text-xs font-bold text-amber-400 shrink-0 w-14">
                                {w.row ? `Row ${w.row}` : 'Skip'}
                              </span>
                              <p className="text-xs text-amber-700">{w.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Fatal upload error (before job starts) */}
                {!importing && !done && errors.length > 0 && errors[0].row === null && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-700 font-medium">{errors[0].message}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
                {done ? (
                  <>
                    <button onClick={reset}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                      Import another file
                    </button>
                    <button onClick={handleClose}
                      className="px-5 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
                      Done
                    </button>
                  </>
                ) : importing ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={14} className="animate-spin text-violet-500" />
                    Import running — do not close this window
                  </div>
                ) : (
                  <>
                    <button onClick={handleClose}
                      className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={!file}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold
                        hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      <Upload size={14} /> Start Import
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Download errors helper ────────────────────────────────────────────────────
function downloadErrorsCsv(errors) {
  const rows = [['Row', 'Error'], ...errors.filter(e => e.row).map(e => [e.row, e.message])];
  const csv  = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a    = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'import_errors.csv';
  a.click();
}

export default SubscriberImportButton;
