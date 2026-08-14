import { useState, useRef, useCallback } from 'react'

/* ─── Gauge (matches ISPPortal's SpeedGauge) ─── */
function Gauge({ label, value, max, unit, color }) {
  const pct = Math.min(value / max, 1)
  const r = 52, cx = 60, cy = 60
  const circ = Math.PI * r
  const dash = pct * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="72" viewBox="0 0 120 80">
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray .3s ease" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">
          {value.toFixed(1)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#6b7280">{unit}</text>
      </svg>
      <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{label}</span>
    </div>
  )
}

/* ─── Tiny sparkline for test history ─── */
function HistorySparkline({ history, planSpeed }) {
  if (!history.length) return null
  const w = 280, h = 48, pad = 4
  const max = Math.max(planSpeed || 0, ...history.map(h => h.download_mbps)) * 1.15 || 1
  const pts = history.map((h, i) => {
    const x = pad + (i / Math.max(history.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - (h.download_mbps / max) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')

  const planY = h - pad - ((planSpeed || 0) / max) * (h - pad * 2)

  return (
    <svg width={w} height={h} className="overflow-visible">
      <line x1={pad} x2={w - pad} y1={planY} y2={planY}
        stroke="#d1d5db" strokeDasharray="3 3" strokeWidth="1" />
      <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {history.map((h, i) => {
        const x = pad + (i / Math.max(history.length - 1, 1)) * (w - pad * 2)
        const y = h - pad - (h.download_mbps / max) * (h - pad * 2)
        const color = h.status === 'critical' ? '#ef4444' : h.status === 'warning' ? '#f59e0b' : '#10b981'
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />
      })}
    </svg>
  )
}

const STATUS_COPY = {
  healthy:  { label: 'Performing as expected', color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  warning:  { label: 'Below your plan speed',  color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700' },
  critical: { label: 'Significantly degraded', color: '#ef4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700' },
}

export default function SpeedTestCard({ planSpeed = "50 Mbps" }) {
  const [phase, setPhase] = useState('idle') // idle | ping | download | upload | done | error
  const [live, setLive] = useState({ download: 0, upload: 0, ping: 0, jitter: 0 })
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [reportState, setReportState] = useState('idle') // idle | sending | sent
    const [errorMsg, setErrorMsg] = useState(null)



  const abortRef = useRef(null)

  const subdomain = window.location.hostname.split('.')[0]
  const planMax = parseFloat(planSpeed) || 50

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/speed_test/history?limit=10', { headers: { 'X-Subdomain': subdomain } })
      if (res.ok) setHistory(await res.json())
    } catch {}
  }, [subdomain])

  const measurePing = async () => {
    const samples = []
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now()
      await fetch('/api/speed_test/ping', { headers: { 'X-Subdomain': subdomain }, cache: 'no-store' })
      samples.push(performance.now() - t0)
      setLive(v => ({ ...v, ping: samples[samples.length - 1] }))
      await new Promise(r => setTimeout(r, 120))
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length
    const jitter = Math.max(...samples) - Math.min(...samples)
    return { ping: Math.round(avg), jitter: Math.round(jitter) }
  }

  const measureDownload = async () => {
    const res = await fetch(`/api/speed_test/download?size_mb=15`, {
      headers: { 'X-Subdomain': subdomain }, cache: 'no-store',
    })
    const reader = res.body.getReader()
    let received = 0
    const start = performance.now()
    let lastTick = start

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.length
      const now = performance.now()
      if (now - lastTick > 150) {
        const elapsedSec = (now - start) / 1000
        const mbps = (received * 8) / 1e6 / elapsedSec
        setLive(v => ({ ...v, download: mbps }))
        lastTick = now
      }
    }
    const totalSec = (performance.now() - start) / 1000
    return (received * 8) / 1e6 / totalSec
  }

  const measureUpload = () => new Promise((resolve, reject) => {
    const size = 6 * 1024 * 1024 // 6MB
    const buf = new Uint8Array(size)
    for (let i = 0; i < size; i += 65536) {
      crypto.getRandomValues(buf.subarray(i, Math.min(i + 65536, size)))
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/speed_test/upload')
    xhr.setRequestHeader('X-Subdomain', subdomain)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')

    const start = performance.now()
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return
      const elapsedSec = (performance.now() - start) / 1000
      const mbps = (e.loaded * 8) / 1e6 / elapsedSec
      setLive(v => ({ ...v, upload: mbps }))
    }
    xhr.onload = () => {
      const totalSec = (performance.now() - start) / 1000
      resolve((size * 8) / 1e6 / totalSec)
    }
    xhr.onerror = reject
    xhr.send(buf)
  })

  const submitResult = async ({ download, upload, ping, jitter }) => {
    const res = await fetch('/api/speed_test/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({
        download_mbps: download, upload_mbps: upload, ping_ms: ping, jitter_ms: jitter,
      }),
    })
    if (!res.ok) throw new Error('Failed to save result')
    return res.json()
  }


  

const runTest = async () => {
  setResult(null)
  setReportState('idle')
  setErrorMsg(null)
  setLive({ download: 0, upload: 0, ping: 0, jitter: 0 })

  try {
    setPhase('ping')
    const { ping, jitter } = await measurePing()

    setPhase('download')
    const download = await measureDownload()

    setPhase('upload')
    const upload = await measureUpload()

    setPhase('done')
    const saved = await submitResult({ download, upload, ping, jitter })
    setResult(saved)
    fetchHistory()
  } catch (e) {
    console.error('Speed test failed:', e)
    setErrorMsg(e.message || 'Something went wrong during the test.')
    setPhase('error')
  }
}



  const reportIssue = async () => {
    if (!result) return
    setReportState('sending')
    try {
      const res = await fetch(`/api/speed_test/results/${result.id}/report`, {
        method: 'POST', headers: { 'X-Subdomain': subdomain },
      })
      setReportState(res.ok ? 'sent' : 'idle')
    } catch { setReportState('idle') }
  }

  const badge = result ? STATUS_COPY[result.status] || STATUS_COPY.healthy : null
  const isRunning = ['ping', 'download', 'upload'].includes(phase)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800 tracking-tight">Speed Test</span>
        {isRunning && (
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 capitalize">
            {phase}…
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 py-4 px-2">
        <Gauge label="Download" value={live.download} max={planMax} unit="Mbps" color="#10b981" />
        <Gauge label="Upload" value={live.upload} max={planMax * 0.4 || 20} unit="Mbps" color="#3b82f6" />
        <Gauge label="Ping" value={live.ping} max={150} unit="ms" color={live.ping > 60 ? '#ef4444' : '#f59e0b'} />
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={runTest}
          disabled={isRunning}
          className={`w-full py-3 rounded-xl font-bold text-sm transition
            ${isRunning
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-sm'}`}
        >
          {isRunning ? 'Testing…' : result ? 'Test Again' : 'Start Speed Test'}
        </button>

        {result && (
          <div className={`mt-4 rounded-xl border p-4 ${badge.bg} ${badge.border}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${badge.text}`}>{badge.label}</span>
              {result.percent_of_plan != null && (
                <span className={`text-xs font-semibold ${badge.text}`}>
                  {Math.round(result.percent_of_plan * 100)}% of plan
                </span>
              )}
            </div>
            {result.status !== 'healthy' && (
              <button
                onClick={reportIssue}
                disabled={reportState !== 'idle'}
                className="mt-3 w-full py-2 rounded-lg bg-white border border-gray-200 text-gray-700
                  font-semibold text-xs hover:bg-gray-50 transition disabled:opacity-60"
              >
                {reportState === 'sent' ? '✓ Ticket created — support notified'
                  : reportState === 'sending' ? 'Reporting…'
                  : 'Report this issue'}
              </button>
            )}
          </div>
        )}

{phase === 'error' && errorMsg && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Test failed</p>
            <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
          </div>
        )}

        {history.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recent Tests</p>
            <HistorySparkline history={history} planSpeed={planMax} />
          </div>
        )}


        {history.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recent Tests</p>
            <HistorySparkline history={history} planSpeed={planMax} />
          </div>
        )}
      </div>
    </div>
  )
}