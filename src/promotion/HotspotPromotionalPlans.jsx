import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Tag, Calendar, Percent, DollarSign, Layers, Eye, Trash2, Pencil,
  Plus, X, Clock, TrendingDown, Sparkles, Users, ArrowUpRight,
  Timer, PackageCheck, ChevronDown, Loader2,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────── */
/* Small building blocks                                                   */
/* ────────────────────────────────────────────────────────────────────── */

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden font-sans">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-700 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-teal-700 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-rose-500 dark:text-rose-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 dark:text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-sm text-slate-800 dark:text-white ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500';

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div
        className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${
          checked ? 'bg-teal-600' : 'bg-slate-200 dark:bg-gray-600'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          animate={{ left: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </div>
    </button>
  );
}

const emptyForm = {
  hotspot_package_id: '',
  name: '',
  badge_text: '',
  description: '',
  start_date: '',
  end_date: '',
  recurrence_type: 'one_time',
  daily_start_time: '',
  daily_end_time: '',
  discount_type: 'percentage',
  discount_value: '',
  max_redemptions: '',
  display_priority: 10,
  show_countdown_timer: true,
  show_stock_indicator: true,
};

/* ────────────────────────────────────────────────────────────────────── */
/* Main component                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const HotspotPromotionalPlans = () => {
  const subdomain = window.location.hostname.split('.')[0];

  const [packages, setPackages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (key) => (e) => {
    const value = e?.target
      ? e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
      : e;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchPackages = useCallback(async () => {
    try {
      setLoadingPackages(true);
      const res = await fetch('/api/allow_get_hotspot_packages', {
        headers: { 'X-Subdomain': subdomain },
      });
      if (res.ok) setPackages(await res.json());
    } catch (_) {
      toast.error('Could not load hotspot plans');
    } finally {
      setLoadingPackages(false);
    }
  }, [subdomain]);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoadingPromotions(true);
      const res = await fetch('/api/promotional_plans', {
        headers: { 'X-Subdomain': subdomain },
      });
      if (res.ok) setPromotions(await res.json());
    } catch (_) {
      toast.error('Could not load promotional plans');
    } finally {
      setLoadingPromotions(false);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchPackages();
    fetchPromotions();
  }, [fetchPackages, fetchPromotions]);

  const selectedPackage = useMemo(
    () => packages.find((p) => String(p.id) === String(form.hotspot_package_id)),
    [packages, form.hotspot_package_id]
  );

  const priceMath = useMemo(() => {
    const original = Number(selectedPackage?.price || 0);
    const value = Number(form.discount_value || 0);
    if (!selectedPackage || !value) return { original, promo: original, savings: 0, percent: 0 };

    const savings =
      form.discount_type === 'percentage'
        ? original * (value / 100)
        : Math.min(value, original);
    const promo = Math.max(original - savings, 0);
    const percent = original ? Math.round((savings / original) * 100) : 0;
    return { original, promo, savings, percent };
  }, [selectedPackage, form.discount_type, form.discount_value]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      hotspot_package_id: promo.hotspot_package_id,
      name: promo.name || '',
      badge_text: promo.badge_text || '',
      description: promo.description || '',
      start_date: promo.start_date?.slice(0, 16) || '',
      end_date: promo.end_date?.slice(0, 16) || '',
      recurrence_type: promo.recurrence_type || 'one_time',
      daily_start_time: promo.daily_start_time || '',
      daily_end_time: promo.daily_end_time || '',
      discount_type: promo.discount_type || 'percentage',
      discount_value: promo.discount_value || '',
      max_redemptions: promo.max_redemptions || '',
      display_priority: promo.display_priority ?? 10,
      show_countdown_timer: promo.show_countdown_timer ?? true,
      show_stock_indicator: promo.show_stock_indicator ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional plan? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/promotional_plans/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain },
      });
      if (res.ok) {
        toast.success('Promotional plan deleted');
        setPromotions((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error('Failed to delete promotional plan');
      }
    } catch (_) {
      toast.error('Network error. Please try again.');
    }
  };

  const validate = () => {
    if (!form.hotspot_package_id) return 'Select a hotspot plan to promote';
    if (!form.name.trim()) return 'Promotion name is required';
    if (!form.start_date || !form.end_date) return 'Start and end dates are required';
    if (new Date(form.end_date) <= new Date(form.start_date)) return 'End date must be after the start date';
    if (form.recurrence_type === 'daily_window' && (!form.daily_start_time || !form.daily_end_time)) {
      return 'Daily window promotions need a start and end time';
    }
    if (!form.discount_value || Number(form.discount_value) <= 0) return 'Enter a discount value greater than 0';
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 100) {
      return 'Percentage discount cannot exceed 100%';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/promotional_plans/${editingId}` : '/api/promotional_plans';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? 'Promotional plan updated' : 'Promotional plan created');
        resetForm();
        fetchPromotions();
      } else {
        const msg = typeof data === 'object' ? Object.values(data).flat().join(', ') : 'Could not save promotion';
        toast.error(msg || 'Could not save promotion');
      }
    } catch (_) {
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans py-8 px-4 sm:px-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {editingId ? 'Edit Promotional Plan' : 'Create Promotional Plan'}
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-gray-400 ml-[52px]">
          Create a time-limited promotional offer with countdown timer
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form column ─────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Base plan */}
          <SectionCard icon={Layers} title="Base Plan" subtitle="Select the hotspot plan to create a promotion for">
            <Field label="Hotspot Plan" required>
              {loadingPackages ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-gray-500 py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading plans…
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={form.hotspot_package_id}
                    onChange={set('hotspot_package_id')}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="">Select a hotspot plan</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Ksh {Number(p.price || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" />
                </div>
              )}

              {selectedPackage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 grid grid-cols-3 gap-2"
                >
                  {[
                    ['Price', `Ksh ${Number(selectedPackage.price || 0).toLocaleString()}`],
                    ['Speed', `${selectedPackage.upload_limit || '—'}/${selectedPackage.download_limit || '—'}`],
                    ['Validity', selectedPackage.valid || selectedPackage.validity || '—'],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-slate-50 dark:bg-gray-700 border border-slate-100 dark:border-gray-600 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-gray-500 mb-0.5">{l}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-gray-200">{v}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </Field>
          </SectionCard>

          {/* Promotion details */}
          <SectionCard icon={Tag} title="Promotion Details" subtitle="Configure the promotional plan name and description">
            <Field label="Promotion Name" required>
              <input
                type="text" value={form.name} onChange={set('name')}
                placeholder="e.g. Weekend Flash Sale"
                className={inputClass}
              />
            </Field>
            <Field label="Badge Text" hint="Displayed as a badge on the promotional plan card">
              <input
                type="text" value={form.badge_text} onChange={set('badge_text')}
                placeholder="e.g. 20% OFF"
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => e.target.value.length <= 500 && set('description')(e)}
                rows={3}
                placeholder="Tell customers why this deal is worth grabbing…"
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-1 text-right">{form.description.length}/500 characters</p>
            </Field>
          </SectionCard>

          {/* Schedule */}
          <SectionCard icon={Calendar} title="Schedule" subtitle="Set the start and end dates for the promotion">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Start Date" required>
                <input type="datetime-local" value={form.start_date} onChange={set('start_date')} className={`${inputClass} dark:[color-scheme:dark]`} />
              </Field>
              <Field label="End Date" required>
                <input type="datetime-local" value={form.end_date} onChange={set('end_date')} className={`${inputClass} dark:[color-scheme:dark]`} />
              </Field>
            </div>

            <Field label="Recurrence">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'one_time', label: 'One-time campaign', hint: 'Always active within dates' },
                  { id: 'daily_window', label: 'Daily window', hint: 'Only active during set hours each day' },
                ].map((opt) => (
                  <button
                    type="button" key={opt.id}
                    onClick={() => set('recurrence_type')(opt.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      form.recurrence_type === opt.id
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-900/30 dark:border-teal-500 ring-1 ring-teal-200 dark:ring-teal-700'
                        : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">{opt.label}</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{opt.hint}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-start gap-1.5">
                <Clock size={12} className="shrink-0 mt-0.5" />
                Use "Daily window" to run the same promo at the same hours every day (e.g. nightly 18:00–23:00).
              </p>
            </Field>

            <AnimatePresence>
              {form.recurrence_type === 'daily_window' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                >
                  <Field label="Daily Start Time" required>
                    <input type="time" value={form.daily_start_time} onChange={set('daily_start_time')} className={`${inputClass} dark:[color-scheme:dark]`} />
                  </Field>
                  <Field label="Daily End Time" required>
                    <input type="time" value={form.daily_end_time} onChange={set('daily_end_time')} className={`${inputClass} dark:[color-scheme:dark]`} />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* Discount configuration */}
          <SectionCard icon={Percent} title="Discount Configuration" subtitle="Set the discount type and value for the promotion">
            <Field label="Discount Type">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button" onClick={() => set('discount_type')('percentage')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    form.discount_type === 'percentage'
                      ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-900/30 dark:border-teal-500 text-teal-700 dark:text-teal-400'
                      : 'border-slate-200 dark:border-gray-600 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Percent size={14} /> Percentage
                </button>
                <button
                  type="button" onClick={() => set('discount_type')('fixed_amount')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    form.discount_type === 'fixed_amount'
                      ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-900/30 dark:border-teal-500 text-teal-700 dark:text-teal-400'
                      : 'border-slate-200 dark:border-gray-600 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-500'
                  }`}
                >
                  <DollarSign size={14} /> Fixed Amount
                </button>
              </div>
            </Field>

            <Field
              label={form.discount_type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
              required
              hint={form.discount_type === 'percentage' ? 'Enter a value between 0 and 100' : 'Enter the flat amount to subtract from the price'}
            >
              <div className="relative">
                <input
                  type="number" min="0" max={form.discount_type === 'percentage' ? 100 : undefined}
                  value={form.discount_value} onChange={set('discount_value')}
                  placeholder="0"
                  className={`${inputClass} pr-10`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500 font-semibold">
                  {form.discount_type === 'percentage' ? '%' : 'Ksh'}
                </span>
              </div>
            </Field>
          </SectionCard>

          {/* Stock & priority */}
          <SectionCard icon={Users} title="Stock & Priority" subtitle="Configure stock limits and display priority">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Maximum Redemptions" hint="Leave empty for unlimited redemptions">
                <input
                  type="number" min="0" value={form.max_redemptions} onChange={set('max_redemptions')}
                  placeholder="Unlimited"
                  className={inputClass}
                />
              </Field>
              <Field label="Display Priority" hint="Higher priority (1-100) plans appear first in the carousel">
                <input
                  type="number" min="1" max="100" value={form.display_priority} onChange={set('display_priority')}
                  className={inputClass}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Display options */}
          <SectionCard icon={Eye} title="Display Options" subtitle="Configure how the promotion appears on the captive portal">
            <Toggle
              checked={form.show_countdown_timer}
              onChange={set('show_countdown_timer')}
              label="Show Countdown Timer"
              description="Display a countdown timer showing time remaining"
            />
            <Toggle
              checked={form.show_stock_indicator}
              onChange={set('show_stock_indicator')}
              label="Show Stock Indicator"
              description="Display remaining stock when limited redemptions are set"
            />
          </SectionCard>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit" disabled={saving}
              className="flex-1 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {editingId ? 'Save Changes' : 'Create Promotional Plan'}
            </button>
            {editingId && (
              <button
                type="button" onClick={resetForm}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-gray-600 text-slate-500 dark:text-gray-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ── Preview + list column ───────────────────────────────── */}
        <div className="space-y-6">
          {/* Price preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-6 sticky top-8 font-sans">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} className="text-teal-700 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Price Preview</h3>
            </div>

            {selectedPackage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-gray-400">Original Price</span>
                  <span className="text-sm font-semibold text-slate-400 dark:text-gray-500 line-through">
                    Ksh {priceMath.original.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-gray-400">Promotional Price</span>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                    Ksh {priceMath.promo.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-gray-400">Customer Saves</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Ksh {priceMath.savings.toFixed(2)} ({priceMath.percent}%)
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-gray-500">Select a plan and discount to preview pricing.</p>
            )}
          </div>

          {/* Existing promotions */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3 px-1">Active & Scheduled Promotions</h3>
            {loadingPromotions ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-gray-500 py-4 px-1">
                <Loader2 size={14} className="animate-spin" /> Loading…
              </div>
            ) : promotions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-dashed border-slate-200 dark:border-gray-600 rounded-2xl p-6 text-center">
                <PackageCheck size={22} className="mx-auto text-slate-300 dark:text-gray-600 mb-2" />
                <p className="text-xs text-slate-400 dark:text-gray-500">No promotional plans yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <div key={promo.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{promo.name}</p>
                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                          {promo.hotspot_package?.name || 'Unknown plan'}
                        </p>
                      </div>
                      {promo.badge_text && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                          {promo.badge_text}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <ArrowUpRight size={11} className="text-emerald-500 dark:text-emerald-400" />
                        Ksh {Number(promo.promotional_price || 0).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer size={11} />
                        {promo.recurrence_type === 'daily_window' ? 'Daily window' : 'One-time'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => startEdit(promo)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 text-xs font-semibold text-slate-600 dark:text-gray-200 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotPromotionalPlans;