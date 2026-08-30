import { useState, useEffect, useCallback } from 'react'
import {
  Wifi, WifiOff, Plus, Settings, RefreshCw, MapPin,
  CheckCircle, XCircle, AlertTriangle, Clock, Cpu,
  Monitor, ChevronRight, X, Save, Eye, Info,
  Signal, Router, Activity, BarChart2, Zap
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// ─── Setup Steps ──────────────────────────────────────────────
const SETUP_STEPS = [
  { key: 'pending', label: 'Pending', color: 'gray' },
  { key: 'ip_assigned', label: 'IP Assigned', color: 'blue' },
  { key: 'binding_created', label: 'Binding Created', color: 'yellow' },
  { key: 'bypassed', label: 'Bypassed', color: 'orange' },
  { key: 'verified', label: 'Verified ✓', color: 'green' },
]

const BRANDS = ['Huawei', 'Tenda', 'TP-Link', 'D-Link', 'Mikrotik', 'Ubiquiti', 'ZTE', 'Other']

const DEFAULT_IPS = {
  Huawei: ['192.168.100.1', '192.168.1.1'],
  Tenda: ['192.168.0.1', '192.168.1.1'],
  'TP-Link': ['192.168.0.1', '192.168.1.1'],
  'D-Link': ['192.168.0.1', '192.168.1.1'],
  ZTE: ['192.168.1.1', '192.168.100.1'],
}

// ─── Setup Instructions Modal ─────────────────────────────────
const SetupInstructionsModal = ({ ap, onClose, onUpdateStatus }) => {
  const [currentStep, setCurrentStep] = useState(
    SETUP_STEPS.findIndex(s => s.key === ap.setup_status) || 0
  )

  const steps = [
    {
      title: "Assign Static IP from MikroTik",
      description: `Give this ${ap.brand || 'router'} a static IP from your MikroTik hotspot network (e.g. 10.5.50.x). ${ap.using_default_ip ? `⚠️ Current IP ${ap.ip} is a known default IP — please change it!` : ''}`,
      command: `/ip dhcp-server lease add \\\n  mac-address=${ap.mac_address || 'XX:XX:XX:XX:XX:XX'} \\\n  address=10.5.50.x \\\n  server=hotspot`,
      status_key: 'ip_assigned',
      warning: ap.using_default_ip ? `⚠️ ${ap.brand} routers use ${ap.ip} as default. Assign a custom IP from MikroTik network instead.` : null
    },
    {
      title: "Check IP Hotspot Hosts",
      description: "Verify the device appears in MikroTik Hotspot Hosts after connecting to the network.",
      command: `/ip hotspot host print\n# Look for IP: ${ap.ip}`,
      status_key: 'ip_assigned'
    },
    {
      title: "Create IP Binding",
      description: "In MikroTik: Go to IP → Hotspot → Hosts → Find your device → Double-click → Click 'Make Binding'",
      command: `/ip hotspot ip-binding add \\\n  address=${ap.ip} \\\n  mac-address=${ap.mac_address || 'XX:XX:XX:XX:XX:XX'} \\\n  type=bypassed`,
      status_key: 'binding_created'
    },
    {
      title: "Set Binding to Bypassed",
      description: "In IP → Hotspot → IP Bindings → Double-click your binding → Set Type to 'bypassed' → Apply → OK",
      command: `/ip hotspot ip-binding set [find address=${ap.ip}] type=bypassed`,
      status_key: 'bypassed'
    },
    {
      title: "Verify Connectivity",
      description: "Ping the access point from MikroTik terminal to confirm it's reachable through the WireGuard tunnel.",
      command: `/ping ${ap.ip} count=5`,
      status_key: 'verified'
    }
  ]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Setup Guide</h2>
            <p className="text-sm text-gray-500">{ap.name} — {ap.ip}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            {SETUP_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  ap.setup_status === step.key ? 'bg-blue-600 text-white' :
                  SETUP_STEPS.findIndex(s => s.key === ap.setup_status) > i ? 'bg-green-500 text-white' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {SETUP_STEPS.findIndex(s => s.key === ap.setup_status) > i ? '✓' : i + 1}
                </div>
                {i < SETUP_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 rounded ${
                    SETUP_STEPS.findIndex(s => s.key === ap.setup_status) > i ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">{ap.setup_progress}% complete</p>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, i) => (
            <div key={i} className={`border rounded-xl p-4 ${currentStep === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${currentStep === i ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                </div>
                <button onClick={() => setCurrentStep(currentStep === i ? -1 : i)} className="text-gray-400 hover:text-gray-600">
                  <ChevronRight size={16} className={`transition-transform ${currentStep === i ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {currentStep === i && (
                <div className="space-y-3 ml-10">
                  {step.warning && (
                    <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">{step.warning}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>

                  <div className="bg-gray-900 rounded-lg p-3 relative">
                    <pre className="text-green-400 text-xs overflow-x-auto">{step.command}</pre>
                    <button
                      onClick={() => copyToClipboard(step.command)}
                      className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded"
                    >
                      Copy
                    </button>
                  </div>

                  <button
                    onClick={() => { onUpdateStatus(ap.id, step.status_key); setCurrentStep(i + 1) }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Mark Step {i + 1} Complete →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Add/Edit AP Modal ────────────────────────────────────────
const ApModal = ({ ap, routers, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: ap?.name || '',
    ip: ap?.ip || '',
    brand: ap?.brand || '',
    model: ap?.model || '',
    location: ap?.location || '',
    mac_address: ap?.mac_address || '',
    nas_router_id: ap?.nas_router?.id || '',
    snmp_enabled: ap?.snmp_enabled || false,
    snmp_community: ap?.snmp_community || 'public',
    notes: ap?.notes || ''
  })
  const [saving, setSaving] = useState(false)
  const [ipWarning, setIpWarning] = useState(null)

  const checkIpWarning = (brand, ip) => {
    const defaults = DEFAULT_IPS[brand] || []
    if (defaults.includes(ip)) {
      setIpWarning(`⚠️ ${ip} is a known default IP for ${brand} routers. Use a custom IP from your MikroTik network (e.g. 10.5.50.x)`)
    } else {
      setIpWarning(null)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newForm = { ...form, [name]: type === 'checkbox' ? checked : value }
    setForm(newForm)
    if (name === 'brand' || name === 'ip') {
      checkIpWarning(name === 'brand' ? value : form.brand, name === 'ip' ? value : form.ip)
    }
  }

  const handleSave = async () => {
    if (!form.name || !form.ip) {
      toast.error('Name and IP are required')
      return
    }
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {ap ? 'Edit Access Point' : 'Add Access Point'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* IP Warning */}
          {ipWarning && (
            <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-xl">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{ipWarning}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. AP-Block-A" 
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IP Address *</label>
              <input name="ip" value={form.ip} onChange={handleChange}
                placeholder="10.5.50.x"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MAC Address</label>
              <input name="mac_address" value={form.mac_address} onChange={handleChange}
                placeholder="AA:BB:CC:DD:EE:FF"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
              <select name="brand" value={form.brand} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select brand</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
              <input name="model" value={form.model} onChange={handleChange}
                placeholder="e.g. HG8245H"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Block A, Floor 2"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MikroTik Router</label>
              <select name="nas_router_id" value={form.nas_router_id} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select router</option>
                {routers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.ip_address})</option>)}
              </select>
            </div>

            {/* SNMP */}
            <div className="col-span-2 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" name="snmp_enabled" checked={form.snmp_enabled} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="font-medium text-gray-900 dark:text-white text-sm">Enable SNMP Monitoring</span>
              </label>
              {form.snmp_enabled && (
                <input name="snmp_community" value={form.snmp_community} onChange={handleChange}
                  placeholder="SNMP Community (default: public)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                placeholder="Any notes about this access point..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AP Card ──────────────────────────────────────────────────
const ApCard = ({ ap, onEdit, onSetup, onDelete }) => {
  const isOnline = ap.reachable
  const setupDone = ap.setup_status === 'verified'

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 overflow-hidden shadow-sm transition-all hover:shadow-md ${
      !isOnline ? 'border-red-200 dark:border-red-800' :
      !setupDone ? 'border-amber-200 dark:border-amber-800' :
      'border-green-200 dark:border-green-800'
    }`}>
      {/* Status Bar */}
      <div className={`h-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {isOnline
                ? <Wifi size={18} className="text-green-600" />
                : <WifiOff size={18} className="text-red-600" />
              }
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{ap.name}</p>
              <p className="text-xs text-gray-500">{ap.brand} {ap.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {isOnline ? '● Online' : '● Offline'}
            </span>
          </div>
        </div>

        {/* IP Warning */}
        {ap.using_default_ip && (
          <div className="mb-3 flex gap-1.5 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
            <AlertTriangle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">Default IP detected — change recommended</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-0.5">IP Address</p>
            <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{ap.ip}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-0.5">Latency</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {ap.ping_latency_ms ? `${ap.ping_latency_ms}ms` : 'N/A'}
            </p>
          </div>
          {ap.location && (
            <div className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex items-center gap-2">
              <MapPin size={12} className="text-gray-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{ap.location}</p>
            </div>
          )}
        </div>

        {/* Setup Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Setup Progress</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{ap.setup_progress}%</p>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className={`h-1.5 rounded-full transition-all ${
                ap.setup_status === 'verified' ? 'bg-green-500' :
                ap.setup_status === 'bypassed' ? 'bg-orange-500' :
                ap.setup_status === 'binding_created' ? 'bg-yellow-500' :
                ap.setup_status === 'ip_assigned' ? 'bg-blue-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${ap.setup_progress}%` }}
            />
          </div>
          <p className={`text-xs mt-1 font-medium ${
            ap.setup_status === 'verified' ? 'text-green-600' :
            ap.setup_status === 'bypassed' ? 'text-orange-600' :
            'text-gray-500'
          }`}>
            {SETUP_STEPS.find(s => s.key === ap.setup_status)?.label || ap.setup_status}
          </p>
        </div>

        {/* Last seen */}
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <Clock size={11} />
          {ap.checked_at ? `Checked ${new Date(ap.checked_at).toLocaleTimeString()}` : 'Never checked'}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => onSetup(ap)}
            className="flex-1 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center justify-center gap-1">
            <Settings size={12} /> Setup Guide
          </button>
          <button onClick={() => onEdit(ap)}
            className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Edit
          </button>
          <button onClick={() => onDelete(ap)}
            className="py-1.5 px-3 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
const AccessPoint = () => {
  const [accessPoints, setAccessPoints] = useState([])
  const [summary, setSummary] = useState({})
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editAp, setEditAp] = useState(null)
  const [setupAp, setSetupAp] = useState(null)
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const subdomain = window.location.hostname.split('.')[0]

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true)
      const [apRes, routerRes] = await Promise.all([
        fetch('/api/access_points', { headers: { 'X-Subdomain': subdomain } }),
        fetch('/api/routers', { headers: { 'X-Subdomain': subdomain } })
      ])

      const apData = await apRes.json()
      const routerData = await routerRes.json()

      if (apRes.ok) {
        setAccessPoints(apData.access_points || [])
        setSummary(apData.summary || {})
      }
      if (routerRes.ok) setRouters(routerData || [])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [subdomain])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleSave = async (form, apId = null) => {
    try {
      const url = apId ? `/api/access_points/${apId}` : '/api/access_points'
      const method = apId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(apId ? 'Access point updated!' : 'Access point added!')
        setShowAddModal(false)
        setEditAp(null)
        fetchData()
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch (error) {
      toast.error('Error saving access point')
    }
  }

  const handleDelete = async (ap) => {
    if (!confirm(`Delete ${ap.name}?`)) return
    try {
      await fetch(`/api/access_points/${ap.id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain }
      })
      toast.success('Deleted!')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleUpdateSetupStatus = async (apId, status) => {
    try {
      await fetch(`/api/access_points/${apId}/update_setup_status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ setup_status: status })
      })
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filteredAPs = accessPoints.filter(ap => {
    if (filter === 'online') return ap.reachable
    if (filter === 'offline') return !ap.reachable
    if (filter === 'pending') return ap.setup_status !== 'verified'
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center py-12 font-sans">
      <RefreshCw size={24} className="animate-spin text-blue-500 mr-2" />
      <span className="text-gray-600 dark:text-gray-400">Loading access points...</span>
    </div>
  )

  return (
    <>
      <Toaster />

      {showAddModal && (
        <ApModal
          routers={routers}
          onClose={() => setShowAddModal(false)}
          onSave={(form) => handleSave(form)}
        />
      )}

      {editAp && (
        <ApModal
          ap={editAp}
          routers={routers}
          onClose={() => setEditAp(null)}
          onSave={(form) => handleSave(form, editAp.id)}
        />
      )}

      {setupAp && (
        <SetupInstructionsModal
          ap={setupAp}
          onClose={() => setSetupAp(null)}
          onUpdateStatus={handleUpdateSetupStatus}
        />
      )}

      <div className="p-6 font-sans space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Router size={24} className="text-blue-600" />
              Access Points
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Monitor and manage your network access points
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm font-medium">
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-sm font-medium shadow-sm">
              <Plus size={16} />
              Add Access Point
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: summary.total || 0, icon: Router, color: 'blue' },
            { label: 'Online', value: summary.online || 0, icon: Wifi, color: 'green' },
            { label: 'Offline', value: summary.offline || 0, icon: WifiOff, color: 'red' },
            { label: 'Pending Setup', value: summary.pending_setup || 0, icon: AlertTriangle, color: 'amber' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <stat.icon size={18} className={`text-${stat.color}-500`} />
              </div>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Offline Alert */}
        {summary.offline > 0 && (
          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">
                {summary.offline} Access Point{summary.offline > 1 ? 's' : ''} Offline!
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {accessPoints.filter(ap => !ap.reachable).map(ap => ap.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'online', label: '● Online' },
            { key: 'offline', label: '● Offline' },
            { key: 'pending', label: '⚙ Pending Setup' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* AP Grid */}
        {filteredAPs.length === 0 ? (
          <div className="text-center py-12">
            <Router size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No access points found</p>
            <button onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
              Add First Access Point
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAPs.map(ap => (
              <ApCard
                key={ap.id}
                ap={ap}
                onEdit={setEditAp}
                onSetup={setSetupAp}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AccessPoint