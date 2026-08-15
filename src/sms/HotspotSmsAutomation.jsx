import { useState, useRef, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquareText,
  Sparkles,
  Info,
  X,
  Eye,
  Users,
  User,
  Plus,
  Clock,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  PartyPopper,
  ChevronRight,
} from 'lucide-react'

/**
 * Hotspot Notification Templates
 * --------------------------------
 * Lives under Communication > Automation.
 * Lets an ISP admin edit the SMS copy sent out automatically when a
 * hotspot voucher/plan is purchased (single device vs multiple devices),
 * or when a voucher expires, toggle each template on/off, and preview it
 * with sample data before it goes live.
 *
 * Backend contract (see accompanying Rails files):
 *   GET    /api/hotspot_sms_templates            -> { templates: [...] }
 *   PATCH  /api/hotspot_sms_templates/:id         -> { template: {...} }
 *   POST   /api/hotspot_sms_templates             -> { template: {...} }
 *
 * NOTE: templates returned by the API carry the real numeric primary key as
 * `id`, plus `group` ('single' | 'multi' | 'expiration') and `kind`
 * derived server-side from `category`. Save/patch calls use that same
 * `id` directly, so keep frontend and backend ids in lockstep.
 */

const SINGLE_USER_VARIABLES = [
  { token: 'customer_phone', label: 'Customer phone number' },
  { token: 'plan_name', label: 'Hotspot plan name' },
  { token: 'voucher_code', label: 'Voucher code' },
  { token: 'username', label: 'Login username' },
  { token: 'password', label: 'Login password' },
  { token: 'validity', label: 'Validity period' },
  { token: 'price', label: 'Plan price' },
  { token: 'company_name', label: 'Your company name' },
]

const MULTI_USER_VARIABLES = [
  { token: 'customer_phone', label: 'Customer phone number' },
  { token: 'plan_name', label: 'Hotspot plan name' },
  { token: 'voucher_count', label: 'Number of vouchers' },
  { token: 'voucher_list', label: 'Formatted list of all vouchers' },
  { token: 'validity', label: 'Validity period' },
  { token: 'price', label: 'Plan price' },
  { token: 'company_name', label: 'Your company name' },
]

// NEW — matches HotspotSmsTemplate::EXPIRATION_VARIABLES in the model
const EXPIRATION_VARIABLES = [
  { token: 'customer_phone', label: 'Customer phone number' },
  { token: 'voucher_code', label: 'Voucher code' },
  { token: 'plan_name', label: 'Hotspot plan name' },
  { token: 'company_name', label: 'Your company name' },
]

const VOUCHER_LIST_SAMPLE =
  '1. Code: ABC123 | User: user1 | Pass: pass1\n' +
  '2. Code: DEF456 | User: user2 | Pass: pass2\n' +
  '3. Code: GHI789 | User: user3 | Pass: pass3'

const SAMPLE_DATA = {
  customer_phone: '0712 345 678',
  plan_name: 'Daily Unlimited',
  voucher_code: 'WIFI-ABC123',
  username: 'WIFI-ABC123',
  password: 'WIFI-ABC123',
  validity: '24 hours',
  price: 'KES 50',
  company_name: 'Aitechs',
  voucher_count: '3',
  voucher_list: VOUCHER_LIST_SAMPLE,
}

const DEFAULT_TEMPLATES = [
  {
    id: 'single-compact',
    group: 'single',
    kind: 'compact',
    title: 'Compact',
    active: false,
    message: '{company_name} WiFi\nYour Voucher Code: {voucher_code}\nExpiry: {validity}',
  },
  {
    id: 'single-notification',
    group: 'single',
    kind: 'notification',
    title: 'Notification',
    active: true,
    message: 'Thank you for your purchase!\nPlan: {plan_name}\nVoucher Code: {voucher_code}\nValid for: {validity}',
  },
  {
    id: 'multi-compact',
    group: 'multi',
    kind: 'compact',
    title: 'Compact',
    active: false,
    message: '{company_name} WiFi - {plan_name} ({price})\n{voucher_count} vouchers: {voucher_list}\nValid: {validity}',
  },
  {
    id: 'multi-notification',
    group: 'multi',
    kind: 'notification',
    title: 'Notification',
    active: true,
    message: 'Thank you for your purchase!\nYour Voucher Codes:\n{voucher_list}\nValid for: {validity}',
  },
  {
    // NEW — local fallback so the section still renders (with a save
    // that will fail gracefully) before the first successful fetch.
    id: 'expiration',
    category: 'expiration',
    group: 'expiration',
    kind: null,
    title: 'Expiration Reminder',
    active: true,
    message: 'Hello, your voucher {voucher_code} has expired. Renew now to stay connected. (FROM: {company_name})',
  },
]

// 'Expiry Reminders' removed — it's now a real section below, not a placeholder.
const COMING_SOON = [
  { icon: RefreshCcw, label: 'Renewal Confirmations' },
  { icon: AlertCircle, label: 'Payment Shortfall' },
  { icon: CheckCircle2, label: 'Payment Received' },
  { icon: PartyPopper, label: 'Welcome Messages' },
]

function interpolate(message, data) {
  return message.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(data, key) ? data[key] : match
  )
}

// Backend always sends `group`/`kind` now, but this keeps the UI resilient
// if an older API response (or a manually-added row) is missing them —
// derives them from `category` instead of silently dropping the template.
function normalizeTemplate(t) {
  if (t.group) return t
  const [group, ...rest] = String(t.category || '').split('_')
  return { ...t, group, kind: rest.join('_') || t.kind }
}

function TemplateCard({ template, variables, onChange, onPreview }) {
  const textareaRef = useRef(null)

  const insertVariable = (token) => {
    const el = textareaRef.current
    const insertText = `{${token}}`
    if (!el) {
      onChange(template.id, { message: template.message + insertText })
      return
    }
    const start = el.selectionStart ?? template.message.length
    const end = el.selectionEnd ?? template.message.length
    const next = template.message.slice(0, start) + insertText + template.message.slice(end)
    onChange(template.id, { message: next })
    requestAnimationFrame(() => {
      el.focus()
      const cursor = start + insertText.length
      el.setSelectionRange(cursor, cursor)
    })
  }

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-300 ${
        template.active ? 'border-teal-200 shadow-sm' : 'border-gray-200 opacity-80'
      }`}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{template.title}</span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              template.active ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {template.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={template.active}
          onClick={() => onChange(template.id, { active: !template.active })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            template.active ? 'bg-teal-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              template.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="px-5 pt-3">
        <textarea
          ref={textareaRef}
          value={template.message}
          onChange={(e) => onChange(template.id, { message: e.target.value })}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50/60 p-3 text-[13px]
           leading-relaxed text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400"
          placeholder="SMS notification message..."
        />
      </div>

      <div className="px-5 pt-3 flex flex-wrap gap-1.5">
        {variables.map((v) => (
          <button
            key={v.token}
            type="button"
            onClick={() => insertVariable(v.token)}
            title={v.label}
            className="text-[11px] font-mono px-2 py-1 rounded-md bg-amber-50 text-amber-700
             border border-amber-100 hover:bg-amber-100 hover:border-amber-200 transition-colors"
          >
            {`{${v.token}}`}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-4 mt-1">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-teal-700 transition-colors"
        >
          <Eye size={14} />
          Preview
        </button>
        <span className="text-[11px] text-gray-400">{template.message.length} chars</span>
      </div>
    </div>
  )
}

function VariablesGuideModal({ onClose }) {
  const [tab, setTab] = useState('single')
  const variables =
    tab === 'single' ? SINGLE_USER_VARIABLES : tab === 'multi' ? MULTI_USER_VARIABLES : EXPIRATION_VARIABLES

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 font-sans overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-900">Hotspot Variables Guide</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          <button
            onClick={() => setTab('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              tab === 'single' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Single User Template
          </button>
          <button
            onClick={() => setTab('multi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              tab === 'multi' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Multi-User Template
          </button>
          <button
            onClick={() => setTab('expiration')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              tab === 'expiration' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expiration Template
          </button>
        </div>

        <p className="px-6 pt-3 text-xs text-gray-500">
          {tab === 'single' && 'Used when a customer purchases a plan with 1 user/device.'}
          {tab === 'multi' && 'Used when a customer purchases a plan with multiple users/devices.'}
          {tab === 'expiration' && 'Sent automatically when a hotspot voucher expires.'}
        </p>

        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          {variables.map((v) => (
            <div key={v.token} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <code className="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 shrink-0">
                {`{${v.token}}`}
              </code>
              <span className="text-xs text-gray-600">{v.label}</span>
            </div>
          ))}
        </div>

        {tab === 'multi' && (
          <div className="mx-6 mb-5 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
            <p className="text-[11px] font-medium text-gray-500 mb-1.5">
              About <code className="font-mono text-amber-700">{'{voucher_list}'}</code>
            </p>
            <p className="text-[11px] text-gray-500 mb-2">
              Automatically formats every voucher in a numbered list with its credentials:
            </p>
            <pre className="text-[11px] font-mono text-gray-600 whitespace-pre-wrap leading-relaxed">
              {VOUCHER_LIST_SAMPLE}
            </pre>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function PreviewModal({ template, onClose }) {
  if (!template) return null
  const rendered = interpolate(template.message, SAMPLE_DATA)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 font-sans overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Message Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <p className="px-6 pt-4 text-[11px] text-gray-400">How this SMS will appear with sample data</p>

        <div className="mx-6 my-4 rounded-2xl rounded-tl-sm bg-teal-600 text-white px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap shadow-sm">
          {rendered}
        </div>

        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HotspotSmsAutomation() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [previewing, setPreviewing] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [saving, setSaving] = useState(null)
  const subdomain = window.location.hostname.split('.')[0]

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/hotspot_sms_templates', {
        method: 'GET',
        credentials: 'include',
        headers: { 'X-Subdomain': subdomain },
      })
      if (!response.ok) return
      const data = await response.json()
      if (Array.isArray(data.templates) && data.templates.length) {
        setTemplates(data.templates.map(normalizeTemplate))
      }
    } catch {
      // Falls back to the local defaults above if the endpoint isn't reachable yet.
    }
  }, [subdomain])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const updateTemplate = (id, changes) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  const persistTemplate = async (id) => {
    const template = templates.find((t) => t.id === id)
    if (!template) return
    setSaving(id)
    try {
      const response = await fetch(`/api/hotspot_sms_templates/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          hotspot_sms_template: { message: template.message, active: template.active },
        }),
      })
      if (!response.ok) throw new Error('Save failed')
      toast.success('Template saved', { position: 'top-center', duration: 2500 })
    } catch {
      toast.error('Could not save template', { position: 'top-center', duration: 3000 })
    } finally {
      setSaving(null)
    }
  }

  const handleNewTemplate = () => {
    // Categories are currently a fixed set seeded server-side (see DEFAULTS
    // in the controller) — there's no create-arbitrary-template endpoint
    // yet, so this is a placeholder until that flow is built out.
    toast('Custom templates are coming soon — for now you can edit the existing ones.', {
      position: 'top-center',
      duration: 3000,
    })
  }

  const singleTemplates = templates.filter((t) => t.group === 'single')
  const multiTemplates = templates.filter((t) => t.group === 'multi')
  // NEW — the expiration template previously matched neither filter above
  // (group derived from 'expiration'.split('_') is just 'expiration'),
  // so it was fetched but never rendered anywhere.
  const expirationTemplate = templates.find((t) => t.category === 'expiration' || t.group === 'expiration')

  return (
    <div className="min-h-full bg-gray-50/60 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
              <MessageSquareText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Hotspot Notification Templates</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure SMS templates for hotspot purchase notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg
               border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Info size={14} />
              Variables Guide
            </button>
            <button
              onClick={handleNewTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg
               bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus size={14} />
              New Template
            </button>
          </div>
        </div>

        {/* Single user */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <User size={15} className="text-teal-600" />
            <h2 className="text-sm font-semibold text-gray-800">Single User Purchase</h2>
            <span className="text-[11px] text-gray-400">1 device</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {singleTemplates.map((template) => (
              <div key={template.id} className="space-y-2">
                <TemplateCard
                  template={template}
                  variables={SINGLE_USER_VARIABLES}
                  onChange={updateTemplate}
                  onPreview={setPreviewing}
                />
                <button
                  onClick={() => persistTemplate(template.id)}
                  disabled={saving === template.id}
                  className="w-full text-xs font-medium py-2 rounded-lg border border-teal-200 text-teal-700
                   hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  {saving === template.id ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Multi user */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Users size={15} className="text-teal-600" />
            <h2 className="text-sm font-semibold text-gray-800">Multi-User Purchase</h2>
            <span className="text-[11px] text-gray-400">2+ devices</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {multiTemplates.map((template) => (
              <div key={template.id} className="space-y-2">
                <TemplateCard
                  template={template}
                  variables={MULTI_USER_VARIABLES}
                  onChange={updateTemplate}
                  onPreview={setPreviewing}
                />
                <button
                  onClick={() => persistTemplate(template.id)}
                  disabled={saving === template.id}
                  className="w-full text-xs font-medium py-2 rounded-lg border border-teal-200 text-teal-700
                   hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  {saving === template.id ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* NEW — Voucher expiration */}
        {expirationTemplate && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-teal-600" />
              <h2 className="text-sm font-semibold text-gray-800">Voucher Expiration</h2>
              <span className="text-[11px] text-gray-400">sent when a voucher expires</span>
            </div>
            <div className="max-w-md space-y-2">
              <TemplateCard
                template={expirationTemplate}
                variables={EXPIRATION_VARIABLES}
                onChange={updateTemplate}
                onPreview={setPreviewing}
              />
              <button
                onClick={() => persistTemplate(expirationTemplate.id)}
                disabled={saving === expirationTemplate.id}
                className="w-full text-xs font-medium py-2 rounded-lg border border-teal-200 text-teal-700
                 hover:bg-teal-50 transition-colors disabled:opacity-50"
              >
                {saving === expirationTemplate.id ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </section>
        )}

        {/* Coming soon */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-800">More automations</h2>
            <span className="text-[11px] text-gray-400">coming soon</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COMING_SOON.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 bg-white/60 px-4 py-4"
              >
                <Icon size={16} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500">{label}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 mt-auto">
                  Coming soon <ChevronRight size={10} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showGuide && <VariablesGuideModal onClose={() => setShowGuide(false)} />}
        {previewing && <PreviewModal template={previewing} onClose={() => setPreviewing(null)} />}
      </AnimatePresence>
    </div>
  )
}