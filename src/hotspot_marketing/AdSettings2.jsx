import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Save, Eye, MapPin, Timer, Layers, CheckCircle,
  Play, Pause, Smartphone, Monitor, RefreshCw, Link, Type,
  Trash2, Package, Wifi, Clock, DollarSign, AlertCircle,
  Maximize2, Minimize2, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const POSITIONS = [
  { id: 'top-banner',    label: 'Top Banner',    icon: '⬆', description: 'Full width at top of screen' },
  { id: 'bottom-banner', label: 'Bottom Banner', icon: '⬇', description: 'Full width at bottom' },
  { id: 'center-modal',  label: 'Center Modal',  icon: '⬛', description: 'Centered overlay popup' },
  { id: 'bottom-right',  label: 'Bottom Right',  icon: '↘', description: 'Floating card, bottom right' },
  { id: 'bottom-left',   label: 'Bottom Left',   icon: '↙', description: 'Floating card, bottom left' },
];
const DURATIONS = [5, 10, 15, 20, 30, 45, 60];
const FREE_DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB

const TABS = [
  { id: 'media',    label: 'Media',    icon: Upload },
  { id: 'position', label: 'Position', icon: MapPin },
  { id: 'timing',   label: 'Timing',   icon: Timer },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'preview',  label: 'Preview',  icon: Eye },
];

// ── Fullscreen / expanded modal ───────────────────────────────────────────────
function ExpandedModal({ src, mediaType, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = () => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
    setPlaying(!playing);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="relative w-full max-w-4xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* hint */}
        <p className="absolute -top-8 right-0 text-xs text-gray-500 flex items-center gap-1">
          <X size={11} /> Press ESC or click outside to close
        </p>

        <div className="relative rounded-2xl overflow-hidden bg-black border border-gray-700 shadow-2xl">
          {mediaType === 'image' ? (
            <img src={src} alt="Ad expanded" className="w-full max-h-[82vh] object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                src={src}
                autoPlay
                controls
                className="w-full max-h-[82vh] object-contain"
                onEnded={() => setPlaying(false)}
              />
              {/* custom play/pause overlay (only before first interact) */}
              <button
                onClick={toggle}
                className="absolute inset-0 flex items-center justify-center group bg-transparent pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                  {playing ? <Pause size={26} className="text-white" /> : <Play size={26} className="text-white ml-1" />}
                </div>
              </button>
            </>
          )}

          {/* bottom bar */}
          <div className="absolute bottom-0 inset-x-0 px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,.85), transparent)' }}>
            <span className="text-xs text-white/50">Expanded preview — this is how your ad appears to customers</span>
            <button onClick={onClose}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Minimize2 size={12} /> Collapse
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Small ad card used in position preview ────────────────────────────────────
function AdCard({ mediaType, mediaPreview, adTitle, adDuration, canSkip, skipAfter, compact }) {
  return (
    <div className={`bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden ${compact ? 'rounded-lg' : 'rounded-xl'}`}>
      {mediaType === 'image' && <img src={mediaPreview} alt="Ad" className={`w-full object-cover ${compact ? 'max-h-20' : 'max-h-40'}`} />}
      {mediaType === 'video' && <video src={mediaPreview} className={`w-full object-cover ${compact ? 'max-h-20' : 'max-h-40'}`} muted autoPlay loop />}
      <div className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} flex items-center justify-between gap-2`}>
        {adTitle && <p className="text-xs text-white font-medium truncate flex-1">{adTitle}</p>}
        <div className="flex items-center gap-1.5 shrink-0">
          {mediaType === 'video' ? (
            <>
              <div className="flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
                <Timer size={10} className="text-green-400" />
                <span className="text-xs text-green-400 font-bold font-mono">{adDuration}s</span>
              </div>
              {canSkip && <span className="text-xs text-gray-400 bg-gray-800 rounded px-1.5 py-0.5">Skip {skipAfter}s</span>}
            </>
          ) : (
            <span className="text-xs text-gray-400 bg-gray-800 rounded px-1.5 py-0.5">✕ Close</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chunked upload progress bar ───────────────────────────────────────────────
function UploadProgress({ progress, fileName, onCancel }) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <RefreshCw size={13} className="animate-spin text-green-400" />
          <span className="text-xs text-gray-300 truncate max-w-[220px]">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-400">{progress}%</span>
          <button onClick={onCancel} className="text-red-400 hover:text-red-300 transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-400 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5">
        {progress < 100 ? `Uploading… ${progress}% complete` : 'Processing on server…'}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AddSettings() {
  const [activeTab, setActiveTab]         = useState('media');
  const [adEnabled, setAdEnabled]         = useState(false);
  const [mediaType, setMediaType]         = useState(null);
  const [mediaPreview, setMediaPreview]   = useState(null);
  const [mediaFile, setMediaFile]         = useState(null);
  const [position, setPosition]           = useState('bottom-right');
  const [adDuration, setAdDuration]       = useState(15);
  const [skipAfter, setSkipAfter]         = useState(5);
  const [canSkip, setCanSkip]             = useState(true);
  const [adTitle, setAdTitle]             = useState('');
  const [adLink, setAdLink]               = useState('');
  const [saved, setSaved]                 = useState(false);
  const [videoPlaying, setVideoPlaying]   = useState(false);
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [isDragging, setIsDragging]       = useState(false);
  const [loading, setLoading]             = useState(false);
  const [expanded, setExpanded]           = useState(false);

  // chunked upload
  const [uploading, setUploading]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null);
  const uploadAbortRef = useRef(false);

  // packages
  const [rewardType, setRewardType]               = useState('specific');
  const [selectedPackage, setSelectedPackage]     = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [packagesLoading, setPackagesLoading]     = useState(false);
  const [freeMinutes, setFreeMinutes]             = useState(30);
  const [choicePackageIds, setChoicePackageIds]   = useState([]);

  const subdomain    = window.location.hostname.split('.')[0];
  const fileInputRef = useRef();
  const videoRef     = useRef();
  const [searchParams] = useSearchParams();

  // ── Load settings ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/get_ad_settings_by_id?id=${searchParams.get('id')}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        if (!res.ok) return;
        const d = await res.json();
        setAdTitle(d.ad_title || '');
        setAdLink(d.ad_link || '');
        setPosition(d.position || 'bottom-right');
        setAdDuration(d.ad_duration || 15);
        setSkipAfter(d.skip_after || 5);
        setCanSkip(d.can_skip ?? true);
        setAdEnabled(d.ad_enabled ?? false);
        setMediaType(d.media_type || null);
        if (d.media_url) { setMediaPreview(d.media_url); setUploadedMediaUrl(d.media_url); }
        setRewardType(d.reward_type || 'specific');
        setSelectedPackage(d.selected_package || null);
        setFreeMinutes(d.free_minutes || 30);
        setChoicePackageIds(d.choice_package_ids || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  // ── Fetch packages ─────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setPackagesLoading(true);
        const res = await fetch('/api/allow_get_hotspot_packages', { headers: { 'X-Subdomain': subdomain } });
        if (res.ok) setAvailablePackages(await res.json());
      } catch (e) { console.error(e); }
      finally { setPackagesLoading(false); }
    })();
  }, []);

  // ── Chunked upload ─────────────────────────────────────────────────────────
  const uploadInChunks = useCallback(async (file) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId    = `upload_${Date.now()}`;
    uploadAbortRef.current = false;
    setUploading(true);
    setUploadProgress(0);
    const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    try {
      for (let i = 0; i < totalChunks; i++) {
        if (uploadAbortRef.current) throw new Error('cancelled');
        const chunk = file.slice(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, file.size));
        const fd = new FormData();
        fd.append('chunk',        chunk);
        fd.append('chunk_index',  i);
        fd.append('total_chunks', totalChunks);
        fd.append('upload_id',    uploadId);
        fd.append('filename',     file.name);
        fd.append('file_type',    file.type);

        const res = await fetch('/api/upload_ad_media_chunk', {
          method: 'POST',
          headers: { 'X-Subdomain': subdomain, 'X-CSRF-Token': getCsrf() },
          body: fd,
        });
        if (!res.ok) throw new Error(`chunk ${i} failed`);
        const data = await res.json();
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
        if (data.media_url) setUploadedMediaUrl(data.media_url);
      }
      toast.success('Video uploaded successfully');
    } catch (e) {
      if (e.message !== 'cancelled') {
        toast.error('Upload failed. Please try again.');
        clearMedia();
      }
    } finally {
      setUploading(false);
    }
  }, [subdomain]);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) { toast.error('Please upload an image or video file'); return; }
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setUploadedMediaUrl(null);
    if (isVideo) uploadInChunks(file);   // all videos → chunked
  }, [uploadInChunks]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const clearMedia = () => {
    uploadAbortRef.current = true;
    setMediaPreview(null); setMediaFile(null); setMediaType(null);
    setVideoPlaying(false); setUploadedMediaUrl(null);
    setUploading(false); setUploadProgress(0);
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    videoPlaying ? videoRef.current.pause() : videoRef.current.play();
    setVideoPlaying(!videoPlaying);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!adTitle)    { toast.error('Please enter an ad title'); return; }
    if (uploading)   { toast.error('Please wait for the video upload to finish'); return; }
    if (rewardType === 'specific' && !selectedPackage) {
      toast.error('Please select a package'); setActiveTab('packages'); return;
    }
    if (rewardType === 'choice' && choicePackageIds.length === 0) {
      toast.error('Please select at least one package'); setActiveTab('packages'); return;
    }
    try {
      setLoading(true);
      const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const fd = new FormData();
      fd.append('ad_title',    adTitle);
      fd.append('ad_link',     adLink);
      fd.append('position',    position);
      fd.append('ad_duration', adDuration);
      fd.append('skip_after',  skipAfter);
      fd.append('can_skip',    canSkip);
      fd.append('ad_enabled',  adEnabled);
      fd.append('media_type',  mediaType || '');
      fd.append('reward_type', rewardType);
      fd.append('free_minutes', freeMinutes);
      fd.append('selected_package', selectedPackage || '');
      if (uploadedMediaUrl) fd.append('uploaded_media_url', uploadedMediaUrl);
      if (mediaFile && mediaType === 'image') fd.append('media_file', mediaFile);
      choicePackageIds.forEach(id => fd.append('choice_package_ids[]', id));

      const res = await fetch('/api/ad_settings', {
        method: 'POST',
        headers: { 'X-Subdomain': subdomain, 'X-CSRF-Token': getCsrf() },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true); setTimeout(() => setSaved(false), 3000);
        if (data.media_url) setMediaPreview(data.media_url);
        setMediaFile(null);
        toast.success('Ad settings saved successfully');
      } else {
        toast.error('Failed to save ad settings');
      }
    } catch { toast.error('Failed to save. Please try again.'); }
    finally { setLoading(false); }
  };

  const selectedPos = POSITIONS.find(p => p.id === position);
  const selectedPkg = availablePackages.find(p => p.id === selectedPackage);
  const inputCls    = "w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors";
  const labelCls    = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen text-white">
      <Toaster />

      {/* ── Expanded modal ── */}
      <AnimatePresence>
        {expanded && mediaPreview && (
          <ExpandedModal src={mediaPreview} mediaType={mediaType} onClose={() => setExpanded(false)} />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Layers size={16} className="text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-700 dark:text-gray-100">Ad Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Hotspot captive portal ads</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${adEnabled ? 'text-green-400' : 'text-gray-500'}`}>
              {adEnabled ? 'Ads On' : 'Ads Off'}
            </span>
            <button onClick={() => setAdEnabled(!adEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${adEnabled ? 'bg-green-400' : 'bg-gray-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${adEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <button onClick={handleSave} disabled={loading || uploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${saved ? 'bg-green-500 text-white' : 'bg-green-400 hover:bg-green-300 text-black disabled:opacity-50'}`}>
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Saving…</>
              : saved ? <><CheckCircle size={14} /> Saved!</>
              : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="w-48 shrink-0 border-r border-gray-800 p-4 min-h-[calc(100vh-65px)] flex flex-col gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all border
                  ${active ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border-transparent'}`}>
                <Icon size={15} />
                {tab.label}
                {tab.id === 'packages' && rewardType === 'specific' && !selectedPackage && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
          <div className="mt-auto p-3 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-600 font-mono uppercase tracking-wider mb-2">Status</p>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${adEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-400">{adEnabled ? 'Live' : 'Inactive'}</span>
            </div>
            {uploading && (
              <div className="flex items-center gap-1.5 mt-1">
                <RefreshCw size={10} className="animate-spin text-amber-400" />
                <span className="text-xs text-amber-400">Uploading {uploadProgress}%</span>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-0.5">{mediaPreview ? (mediaType === 'video' ? '📹 Video' : '🖼 Banner') : 'No media'}</p>
            <p className="text-xs text-gray-600 mt-0.5">{mediaType === 'video' ? `${adDuration}s · ${selectedPos?.label}` : `Banner · ${selectedPos?.label}`}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {rewardType === 'specific'    && selectedPkg   ? `📦 ${selectedPkg.name}` : ''}
              {rewardType === 'choice'                       ? `📦 ${choicePackageIds.length} choices` : ''}
              {rewardType === 'free_browse'                  ? `🌐 ${freeMinutes}min free` : ''}
            </p>
          </div>
        </aside>

        {/* ── Main panel ── */}
        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ════ MEDIA ════ */}
            {activeTab === 'media' && (
              <motion.div key="media"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }} className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 text-black dark:text-white">Upload Ad Media</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add a banner image or video — any length is supported via chunked upload</p>
                </div>

                <div>
                  <label className={labelCls}>Ad Title</label>
                  <div className="relative">
                    <Type size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={adTitle} onChange={e => setAdTitle(e.target.value)}
                      placeholder="e.g. Get 20% off at Mama's Kitchen today!" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Click-Through URL <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                  <div className="relative">
                    <Link size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={adLink} onChange={e => setAdLink(e.target.value)}
                      placeholder="https://yourbusiness.com" className={inputCls} />
                  </div>
                </div>

                {/* Drop zone */}
                {!mediaPreview && !uploading && (
                  <div>
                    <label className={labelCls}>Media File</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                        ${isDragging ? 'border-green-400 bg-green-400/5' : 'border-gray-700 hover:border-green-400/50 hover:bg-gray-900/50'}`}>
                      <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <Upload size={22} className="text-green-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400 mb-1">Drop your file here or click to browse</p>
                      <p className="text-xs text-gray-600">Images: JPG, PNG, GIF, WebP · Videos: MP4, WebM, MOV</p>
                      <p className="text-xs text-green-500 mt-2">✅ Long videos supported — uploaded in chunks automatically</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden"
                      onChange={e => handleFileUpload(e.target.files[0])} />
                  </div>
                )}

                {/* Progress bar while uploading */}
                {uploading && (
                  <UploadProgress progress={uploadProgress} fileName={mediaFile?.name || 'video'} onCancel={clearMedia} />
                )}

                {/* Media preview (shown after upload completes) */}
                {mediaPreview && !uploading && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {mediaType === 'video' ? '📹 Video Preview' : '🖼 Banner Preview'}
                      </label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpanded(true)}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1.5 rounded-lg bg-blue-400/10 hover:bg-blue-400/20">
                          <Maximize2 size={12} /> Expand view
                        </button>
                        <button onClick={clearMedia}
                          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 group">
                      {mediaType === 'image' && (
                        <img src={mediaPreview} alt="Ad preview" className="w-full max-h-72 object-contain" />
                      )}
                      {mediaType === 'video' && (
                        <div className="relative">
                          <video ref={videoRef} src={mediaPreview} className="w-full max-h-72 object-contain"
                            onEnded={() => setVideoPlaying(false)} />
                          <button onClick={toggleVideo}
                            className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {videoPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
                            </div>
                          </button>
                          {/* expand hint on hover */}
                          <button onClick={() => setExpanded(true)}
                            className="absolute top-2 right-2 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                            <Maximize2 size={11} /> Full view
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${mediaType === 'video' ? 'bg-blue-400/10 text-blue-400' : 'bg-green-400/10 text-green-400'}`}>
                        {mediaType === 'video' ? 'Video' : 'Image'}
                      </div>
                      <span className="text-xs text-gray-500 truncate">{mediaFile?.name}</span>
                      {uploadedMediaUrl && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle size={11} /> Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ════ POSITION ════ */}
            {activeTab === 'position' && (
              <motion.div key="position"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }} className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">Ad Position</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Choose where the ad appears on the hotspot login page</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {POSITIONS.map(pos => (
                    <button key={pos.id} onClick={() => setPosition(pos.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                        ${position === pos.id ? 'border-green-400 bg-green-400/5' : 'border-gray-700 hover:border-gray-600 bg-gray-900/40'}`}>
                      <span className="text-2xl w-10 text-center">{pos.icon}</span>
                      <div className="flex-1">
                        <p className={`text-lg font-bold ${position === pos.id ? 'text-green-400' : 'text-gray-200'}`}>{pos.label}</p>
                        <p className="text-sm text-gray-700 mt-0.5 dark:text-gray-400">{pos.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${position === pos.id ? 'border-green-400' : 'border-gray-600'}`}>
                        {position === pos.id && <div className="w-2 h-2 rounded-full bg-green-400" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">Layout Diagram</p>
                  <div className="relative w-48 h-28 bg-gray-800 rounded-lg mx-auto border border-gray-700 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-5 bg-gray-700 flex items-center justify-center">
                      <div className="w-8 h-1 bg-gray-600 rounded-full" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center mt-5">
                      <span className="text-xs text-gray-600">Login page</span>
                    </div>
                    {position === 'top-banner'    && <div className="absolute top-5 inset-x-0 h-6 bg-green-400/40 border border-green-400/60 flex items-center justify-center"><span className="text-xs font-bold text-green-400">AD</span></div>}
                    {position === 'bottom-banner' && <div className="absolute bottom-0 inset-x-0 h-6 bg-green-400/40 border border-green-400/60 flex items-center justify-center"><span className="text-xs font-bold text-green-400">AD</span></div>}
                    {position === 'center-modal'  && <div className="absolute inset-0 mt-5 flex items-center justify-center"><div className="w-24 h-12 bg-green-400/40 border border-green-400/60 rounded flex items-center justify-center"><span className="text-xs font-bold text-green-400">AD</span></div></div>}
                    {position === 'bottom-right'  && <div className="absolute bottom-2 right-2 w-16 h-10 bg-green-400/40 border border-green-400/60 rounded flex items-center justify-center"><span className="text-xs font-bold text-green-400">AD</span></div>}
                    {position === 'bottom-left'   && <div className="absolute bottom-2 left-2 w-16 h-10 bg-green-400/40 border border-green-400/60 rounded flex items-center justify-center"><span className="text-xs font-bold text-green-400">AD</span></div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ TIMING ════ */}
            {activeTab === 'timing' && (
              <motion.div key="timing"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }} className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-lg font-semibold mb-1 dark:text-white text-gray-900">Ad Timing</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Control how customers interact with the ad before accessing WiFi</p>
                </div>
                {mediaType === 'image' && (
                  <div className="p-5 bg-blue-400/5 border border-blue-400/20 rounded-2xl flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-blue-600 dark:text-blue-300 mb-1">Banner Image — no timer needed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Customers simply view it and tap <strong className="text-black dark:text-white">Close</strong> or click through.</p>
                    </div>
                  </div>
                )}
                {!mediaType && (
                  <div className="p-5 bg-gray-900 border border-gray-700 rounded-2xl flex gap-4 items-start">
                    <Timer size={18} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-base font-semibold text-white mb-1">No media uploaded yet</p>
                      <p className="text-sm text-gray-300">Upload a video in the Media tab to configure timing.</p>
                    </div>
                  </div>
                )}
                {mediaType === 'video' && (
                  <>
                    <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                      <label className="block text-base font-semibold text-white mb-1">Video Duration</label>
                      <p className="text-sm text-gray-300 mb-4">Customer must watch this long before WiFi unlocks</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {DURATIONS.map(d => (
                          <button key={d} onClick={() => setAdDuration(d)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                              ${adDuration === d ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{d}s</button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                        <span>Less friction</span>
                        <span className="text-green-400 font-bold text-base">{adDuration} seconds</span>
                        <span>More exposure</span>
                      </div>
                      <input type="range" min={5} max={60} step={5} value={adDuration}
                        onChange={e => setAdDuration(Number(e.target.value))} className="w-full accent-green-400" />
                    </div>
                    <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <label className="block text-base font-semibold text-white">Allow Skip</label>
                          <p className="text-sm text-gray-300 mt-0.5">Let users skip the video after a few seconds</p>
                        </div>
                        <button onClick={() => setCanSkip(!canSkip)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${canSkip ? 'bg-green-400' : 'bg-gray-700'}`}>
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${canSkip ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      {canSkip && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <label className="block text-xs text-gray-300 mb-3">
                            Skip button appears after <span className="text-green-400 font-bold">{skipAfter}s</span>
                          </label>
                          <input type="range" min={3} max={Math.min(adDuration - 1, 30)} step={1} value={skipAfter}
                            onChange={e => setSkipAfter(Number(e.target.value))} className="w-full accent-green-400" />
                          <div className="flex justify-between text-xs text-gray-300 mt-1">
                            <span>3s</span><span>{Math.min(adDuration - 1, 30)}s</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div className="p-5 bg-green-400/5 border border-green-400/20 rounded-2xl">
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Summary</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400 shrink-0" /><span className="text-gray-400">Video plays for <strong className="text-white">{adDuration} seconds</strong></span></li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400 shrink-0" /><span className="text-gray-400">{canSkip ? <>Skip after <strong className="text-white">{skipAfter}s</strong></> : <>Skip <strong className="text-white">disabled</strong></>}</span></li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400 shrink-0" /><span className="text-gray-400">WiFi unlocks after ad completes</span></li>
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ════ PACKAGES ════ */}
            {activeTab === 'packages' && (
              <motion.div key="packages"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }} className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">Internet Package Reward</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose what internet access the customer receives after completing the ad</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'specific',    icon: Package, label: 'Assign a specific package', desc: 'Customer automatically gets one fixed package after the ad ends' },
                    { id: 'free_browse', icon: Clock,   label: 'Grant free timed browsing',  desc: 'Give the customer a set number of free minutes — no package needed' },
                  ].map(opt => {
                    const Icon = opt.icon; const active = rewardType === opt.id;
                    return (
                      <button key={opt.id} onClick={() => setRewardType(opt.id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all
                          ${active ? 'border-green-400 bg-green-400/5' : 'border-gray-700 hover:border-gray-600 bg-gray-900/40'}`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${active ? 'bg-green-400/20' : 'bg-gray-800'}`}>
                          <Icon size={16} className={active ? 'text-green-400' : 'text-gray-500'} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-base font-semibold ${active ? 'text-green-400' : 'text-white'}`}>{opt.label}</p>
                          <p className="text-sm text-gray-700 mt-0.5 dark:text-gray-300">{opt.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${active ? 'border-green-400' : 'border-gray-600'}`}>
                          {active && <div className="w-2 h-2 rounded-full bg-green-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {rewardType === 'specific' && (
                  <motion.div key="specific" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Select Package</p>
                        <p className="text-xs text-gray-500 mt-0.5">Automatically activated once the ad finishes</p>
                      </div>
                      {packagesLoading && <RefreshCw size={14} className="animate-spin text-gray-500" />}
                    </div>
                    {availablePackages.length === 0 && !packagesLoading && (
                      <div className="flex items-center gap-2 p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                        <AlertCircle size={14} className="text-amber-400 shrink-0" />
                        <p className="text-xs text-amber-300">No packages found. Create packages in your hotspot settings first.</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                      {availablePackages.map(pkg => (
                        <button key={pkg.id} onClick={() => setSelectedPackage(pkg.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                            ${parseInt(selectedPackage) === pkg.id ? 'border-green-400 bg-green-400/5' : 'border-gray-700 hover:border-gray-600 bg-gray-800/40'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${parseInt(selectedPackage) === pkg.id ? 'bg-green-400/20' : 'bg-gray-700'}`}>
                            <Wifi size={14} className={parseInt(selectedPackage) === pkg.id ? 'text-green-400' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${parseInt(selectedPackage) === pkg.id ? 'text-green-400' : 'text-gray-200'}`}>{pkg.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {pkg.valid}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1"><DollarSign size={10} /> Ksh {pkg.price}</span>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${parseInt(selectedPackage) === pkg.id ? 'border-green-400' : 'border-gray-600'}`}>
                            {parseInt(selectedPackage) === pkg.id && <div className="w-2 h-2 rounded-full bg-green-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedPkg && (
                      <div className="flex items-center gap-2 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                        <CheckCircle size={14} className="text-green-400 shrink-0" />
                        <p className="text-xs text-green-300">After the ad, customers receive: <strong>{selectedPkg.name}</strong> ({selectedPkg.valid})</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {rewardType === 'free_browse' && (
                  <motion.div key="free" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Free Browsing Duration</p>
                      <p className="text-xs text-gray-500 mt-0.5">Minutes of free internet after the ad</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FREE_DURATION_OPTIONS.map(m => (
                        <button key={m} onClick={() => setFreeMinutes(m)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                            ${freeMinutes === m ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                          {m >= 60 ? `${m / 60}hr` : `${m}min`}
                        </button>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Duration</span>
                        <span className="text-green-400 font-bold">{freeMinutes >= 60 ? `${freeMinutes / 60} hour` : `${freeMinutes} minutes`}</span>
                      </div>
                      <input type="range" min={15} max={120} step={15} value={freeMinutes}
                        onChange={e => setFreeMinutes(Number(e.target.value))} className="w-full accent-green-400" />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                      <CheckCircle size={14} className="text-green-400 shrink-0" />
                      <p className="text-xs text-green-300">After the ad, customers get <strong>{freeMinutes >= 60 ? `${freeMinutes / 60} hour` : `${freeMinutes} minutes`}</strong> of free internet</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ════ PREVIEW ════ */}
            {activeTab === 'preview' && (
              <motion.div key="preview"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }} className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 dark:text-white text-gray-900">Ad Preview</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-400">See how your ad looks to customers on the login page</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[{ id: 'mobile', icon: Smartphone, label: 'Mobile' }, { id: 'desktop', icon: Monitor, label: 'Desktop' }].map(d => {
                    const Icon = d.icon;
                    return (
                      <button key={d.id} onClick={() => setPreviewDevice(d.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${previewDevice === d.id ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        <Icon size={14} />{d.label}
                      </button>
                    );
                  })}
                  {mediaPreview && (
                    <button onClick={() => setExpanded(true)}
                      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-all">
                      <Maximize2 size={14} /> Fullscreen preview
                    </button>
                  )}
                </div>

                <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-xs' : 'max-w-2xl'}`}>
                  <div className={`bg-gray-900 border-2 border-gray-700 overflow-hidden relative ${previewDevice === 'mobile' ? 'rounded-3xl' : 'rounded-xl'}`}>
                    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 min-h-64 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Wifi size={20} className="text-white/50" />
                      </div>
                      <p className="text-white/50 text-sm">Hotspot Login Page</p>
                      <div className="w-48 h-10 bg-white/10 rounded-lg" />
                      <div className="w-32 h-8 bg-blue-500/60 rounded-full" />
                    </div>
                    {mediaPreview ? (
                      <>
                        {position === 'top-banner'    && <div className="absolute top-0 inset-x-0"><AdCard mediaType={mediaType} mediaPreview={mediaPreview} adTitle={adTitle} adDuration={adDuration} canSkip={canSkip} skipAfter={skipAfter} compact /></div>}
                        {position === 'bottom-banner' && <div className="absolute bottom-0 inset-x-0"><AdCard mediaType={mediaType} mediaPreview={mediaPreview} adTitle={adTitle} adDuration={adDuration} canSkip={canSkip} skipAfter={skipAfter} compact /></div>}
                        {position === 'center-modal'  && <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4"><div className="w-full max-w-xs"><AdCard mediaType={mediaType} mediaPreview={mediaPreview} adTitle={adTitle} adDuration={adDuration} canSkip={canSkip} skipAfter={skipAfter} /></div></div>}
                        {position === 'bottom-right'  && <div className="absolute bottom-3 right-3 w-44"><AdCard mediaType={mediaType} mediaPreview={mediaPreview} adTitle={adTitle} adDuration={adDuration} canSkip={canSkip} skipAfter={skipAfter} compact /></div>}
                        {position === 'bottom-left'   && <div className="absolute bottom-3 left-3 w-44"><AdCard mediaType={mediaType} mediaPreview={mediaPreview} adTitle={adTitle} adDuration={adDuration} canSkip={canSkip} skipAfter={skipAfter} compact /></div>}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          <Upload size={28} className="text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">Upload media in the Media tab to see a preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Type',     value: mediaType === 'video' ? 'Video' : mediaType === 'image' ? 'Banner' : 'Not set' },
                    { label: 'Position', value: selectedPos?.label || '—' },
                    { label: mediaType === 'video' ? 'Duration' : 'Timing', value: mediaType === 'video' ? `${adDuration}s` : 'Instant dismiss' },
                    { label: 'Reward',   value: rewardType === 'specific' && selectedPkg ? selectedPkg.name : rewardType === 'free_browse' ? `${freeMinutes >= 60 ? freeMinutes / 60 + 'hr' : freeMinutes + 'min'} free` : 'Not set' },
                  ].map(item => (
                    <div key={item.label} className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-center">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}