import { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Palette, Type, Sparkles, Sun, Moon, Monitor, Building2, UserCog, Italic } from 'lucide-react';
import { ApplicationContext } from '../context/ApplicationContext';
import {
  FONT_LIBRARY, COLOR_PRESETS, RADIUS_PRESETS, DENSITY_PRESETS,
  DEFAULT_THEME, applyTheme, hexToHsl, hslToHex,
  readOrgCache, cacheOrgTheme, readPersonalRecord, savePersonalRecord,
  clearPersonalOverride,
} from '../theme/applyTheme';

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon size={16} className="text-slate-500 dark:text-slate-400" />
    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{children}</h3>
  </div>
);

const ItalicToggle = ({ active, onToggle, colorHsl }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
      ${active ? 'border-transparent text-white shadow' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
    style={active ? { background: `hsl(${colorHsl})` } : {}}
  >
    <Italic size={13} /> Italic
  </button>
);

const ThemeEditor = ({ theme, onChange }) => (
  <>
    {/* Mode */}
    <div>
      <SectionTitle icon={Monitor}>Mode</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'light', label: 'Light', icon: Sun },
          { id: 'dark', label: 'Dark', icon: Moon },
          { id: 'system', label: 'System', icon: Monitor },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange({ mode: id })}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all
              ${theme.mode === id ? 'border-transparent text-white shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'}`}
            style={theme.mode === id ? { background: `hsl(${theme.colorHsl})` } : {}}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* Color */}
    <div>
      <SectionTitle icon={Palette}>Theme color</SectionTitle>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-3">
        {COLOR_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => onChange({ colorHsl: preset.hsl, colorPresetId: preset.id })}
            title={preset.label}
            className="relative w-full aspect-square rounded-full flex items-center justify-center transition-all"
            style={{ background: `hsl(${preset.hsl})`, boxShadow: theme.colorPresetId === preset.id ? `0 0 0 2px hsl(${preset.hsl})` : 'none' }}
          >
            {theme.colorPresetId === preset.id && <Check size={14} className="text-white drop-shadow" />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <input
          type="color"
          value={hslToHex(theme.colorHsl)}
          onChange={e => onChange({ colorHsl: hexToHsl(e.target.value), colorPresetId: 'custom' })}
          className="w-9 h-9 rounded-lg cursor-pointer border-none bg-transparent"
        />
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Custom color</p>
          <p className="text-[11px] text-slate-400 font-mono">{hslToHex(theme.colorHsl)}</p>
        </div>
      </div>
    </div>

    {/* Fonts */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle icon={Type}>Body font</SectionTitle>
        <ItalicToggle
          active={theme.fontItalic}
          onToggle={() => onChange({ fontItalic: !theme.fontItalic })}
          colorHsl={theme.colorHsl}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {Object.entries(FONT_LIBRARY).map(([key, font]) => (
          <button
            key={key}
            onClick={() => onChange({ fontKey: key })}
            className={`text-left p-3.5 rounded-xl border transition-all
              ${theme.fontKey === key ? 'border-transparent shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            style={theme.fontKey === key ? { boxShadow: `0 0 0 2px hsl(${theme.colorHsl})` } : {}}
          >
            <p
              className="text-lg leading-tight text-slate-900 dark:text-white"
              style={{ fontFamily: font.stack, fontStyle: theme.fontItalic ? 'italic' : 'normal' }}
            >
              {font.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{font.vibe}</p>
          </button>
        ))}
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle icon={Sparkles}>Heading / display font</SectionTitle>
        <ItalicToggle
          active={theme.displayFontItalic}
          onToggle={() => onChange({ displayFontItalic: !theme.displayFontItalic })}
          colorHsl={theme.colorHsl}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {Object.entries(FONT_LIBRARY).map(([key, font]) => (
          <button
            key={key}
            onClick={() => onChange({ displayFontKey: key })}
            className={`text-left p-3.5 rounded-xl border transition-all
              ${theme.displayFontKey === key ? 'border-transparent shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            style={theme.displayFontKey === key ? { boxShadow: `0 0 0 2px hsl(${theme.colorHsl})` } : {}}
          >
            <p
              className="text-xl leading-tight font-semibold text-slate-900 dark:text-white"
              style={{ fontFamily: font.stack, fontStyle: theme.displayFontItalic ? 'italic' : 'normal' }}
            >
              {font.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{font.vibe}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Density + Radius */}
    <div className="grid sm:grid-cols-2 gap-8">
      <div>
        <SectionTitle icon={Sparkles}>Density</SectionTitle>
        <div className="flex gap-2">
          {Object.keys(DENSITY_PRESETS).map(id => (
            <button
              key={id}
              onClick={() => onChange({ density: id })}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium capitalize border transition-all
                ${theme.density === id ? 'text-white border-transparent shadow' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
              style={theme.density === id ? { background: `hsl(${theme.colorHsl})` } : {}}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle icon={Sparkles}>Corner style</SectionTitle>
        <div className="flex gap-2">
          {Object.keys(RADIUS_PRESETS).map(id => (
            <button
              key={id}
              onClick={() => onChange({ radius: id })}
              className={`flex-1 py-2.5 text-xs font-medium capitalize border transition-all
                ${theme.radius === id ? 'text-white border-transparent shadow' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
              style={{ borderRadius: RADIUS_PRESETS[id], background: theme.radius === id ? `hsl(${theme.colorHsl})` : 'transparent' }}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
);

const AppearanceSettings = () => {
  const subdomain = window.location.hostname.split('.')[0];
  const { currentUser } = useContext(ApplicationContext) || {};
  const userId = currentUser?.id;

  const [orgTheme, setOrgTheme] = useState(readOrgCache() || DEFAULT_THEME);
  const [personalRecord, setPersonalRecord] = useState(readPersonalRecord(userId));
  const [scope, setScope] = useState(personalRecord.enabled ? 'personal' : 'org'); // which editor is showing
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);

  const activeTheme = scope === 'personal' ? personalRecord.theme : orgTheme;

  // Live-apply whatever is currently being edited — straight from local state,
  // not from the cache (the cache is only written on save). This is what makes
  // the sidebar/header/rest of the app update the instant you touch a control.
  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  const fetchOrgTheme = useCallback(async () => {
    try {
      const res = await fetch('/api/appearance_settings', { headers: { 'X-Subdomain': subdomain } });
      if (res.ok) {
        const d = await res.json();
        if (d && d.color_hsl) {
          const t = {
            colorHsl: d.color_hsl, colorPresetId: d.color_preset_id || 'custom',
            fontKey: d.font_key || 'inter', displayFontKey: d.display_font_key || d.font_key || 'inter',
            fontItalic: !!d.font_italic, displayFontItalic: !!d.display_font_italic,
            radius: d.radius || 'balanced', density: d.density || 'comfortable', mode: d.mode || 'system',
          };
          setOrgTheme(t);
          cacheOrgTheme(t);
        }
      }
    } catch (_) { /* no backend yet — cached org theme still used */ }
  }, [subdomain]);

  useEffect(() => { fetchOrgTheme(); }, [fetchOrgTheme]);

  const updateOrg = (patch) => setOrgTheme(prev => ({ ...prev, ...patch }));
  const updatePersonal = (patch) =>
    setPersonalRecord(prev => ({ ...prev, theme: { ...prev.theme, ...patch } }));

  const saveOrgTheme = async () => {
    setSavingOrg(true);
    try {
      const res = await fetch('/api/appearance_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          appearance_setting: {
            color_hsl: orgTheme.colorHsl, color_preset_id: orgTheme.colorPresetId,
            font_key: orgTheme.fontKey, display_font_key: orgTheme.displayFontKey,
            font_italic: orgTheme.fontItalic, display_font_italic: orgTheme.displayFontItalic,
            radius: orgTheme.radius, density: orgTheme.density, mode: orgTheme.mode,
          },
        }),
      });
      cacheOrgTheme(orgTheme);
      if (res.ok) toast.success('Saved as the workspace default for all admins', { position: 'top-center', duration: 4000 });
      else toast.success('Cached locally — org-wide sync unavailable', { position: 'top-center', duration: 4000 });
    } catch (_) {
      cacheOrgTheme(orgTheme);
      toast.success('Cached locally on this device', { position: 'top-center', duration: 4000 });
    } finally { setSavingOrg(false); }
  };

  const togglePersonalOverride = (enabled) => {
    const next = { ...personalRecord, enabled };
    setPersonalRecord(next);
    savePersonalRecord(userId, next);
    setScope(enabled ? 'personal' : 'org');
    if (!enabled) {
      clearPersonalOverride(userId);
      toast('Now using the workspace default theme', { icon: '↩' });
    }
  };

  const savePersonalTheme = () => {
    setSavingPersonal(true);
    const next = { enabled: true, theme: personalRecord.theme };
    savePersonalRecord(userId, next);
    setPersonalRecord(next);
    setTimeout(() => {
      setSavingPersonal(false);
      toast.success('Saved — only visible to you, on this account', { position: 'top-center', duration: 4000 });
    }, 300);
  };

  return (
    <div className="p-5 sm:p-7 font-sans space-y-10">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Appearance
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Set the workspace look for everyone, or override it just for your own account. Changes apply live as you edit.
        </p>
      </div>

      {/* ── Scope switch ─────────────────────────────────────────────── */}
      <div className="inline-flex p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {[
          { id: 'org', label: 'Organization default', icon: Building2 },
          { id: 'personal', label: 'My personal theme', icon: UserCog },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setScope(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${scope === id ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl space-y-8">
        {scope === 'org' ? (
          <>
            <div className="flex items-start gap-2 p-3 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
              <Building2 size={14} className="mt-0.5 shrink-0" />
              This is the theme every admin sees by default — unless they've turned on their own personal override.
            </div>
            <ThemeEditor theme={orgTheme} onChange={updateOrg} />
            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={saveOrgTheme} disabled={savingOrg}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-md disabled:opacity-60"
                style={{ background: `hsl(${orgTheme.colorHsl})` }}
              >
                {savingOrg ? 'Saving…' : 'Save as workspace default'}
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <UserCog size={14} className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Override for just me</p>
                  <p className="text-xs text-slate-400 mt-0.5">Only affects your own login — the rest of the team keeps seeing the workspace default.</p>
                </div>
              </div>
              <button
                onClick={() => togglePersonalOverride(!personalRecord.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${personalRecord.enabled ? '' : 'bg-slate-300 dark:bg-slate-700'}`}
                style={personalRecord.enabled ? { background: `hsl(${personalRecord.theme.colorHsl})` } : {}}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${personalRecord.enabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {personalRecord.enabled && (
              <>
                <ThemeEditor theme={personalRecord.theme} onChange={updatePersonal} />
                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={savePersonalTheme} disabled={savingPersonal}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-md disabled:opacity-60"
                    style={{ background: `hsl(${personalRecord.theme.colorHsl})` }}
                  >
                    {savingPersonal ? 'Saving…' : 'Save my theme'}
                  </motion.button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppearanceSettings;







sx={{
                           '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}