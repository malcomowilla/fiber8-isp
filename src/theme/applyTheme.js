import { NEW_COLORS } from './colorPalette';

export const FONT_LIBRARY = {
  inter:        { label: 'Inter',            google: 'Inter:wght@400;500;600;700;800',            stack: "'Inter', sans-serif",            vibe: 'Clean & neutral' },
  plusJakarta:  { label: 'Plus Jakarta Sans', google: 'Plus+Jakarta+Sans:wght@400;500;600;700;800', stack: "'Plus Jakarta Sans', sans-serif", vibe: 'Warm & modern' },
  manrope:      { label: 'Manrope',           google: 'Manrope:wght@400;500;600;700;800',           stack: "'Manrope', sans-serif",           vibe: 'Geometric & crisp' },
  outfit:       { label: 'Outfit',            google: 'Outfit:wght@400;500;600;700;800',            stack: "'Outfit', sans-serif",            vibe: 'Rounded & friendly' },
  sora:         { label: 'Sora',              google: 'Sora:wght@400;500;600;700;800',              stack: "'Sora', sans-serif",              vibe: 'Techy & confident' },
  spaceGrotesk: { label: 'Space Grotesk',     google: 'Space+Grotesk:wght@400;500;600;700',          stack: "'Space Grotesk', sans-serif",     vibe: 'Distinctive & sharp' },
  dmSans:       { label: 'DM Sans',           google: 'DM+Sans:wght@400;500;700;800',                stack: "'DM Sans', sans-serif",           vibe: 'Friendly & legible' },
  lexend:       { label: 'Lexend',            google: 'Lexend:wght@400;500;600;700;800',             stack: "'Lexend', sans-serif",             vibe: 'Highly readable' },
  urbanist:     { label: 'Urbanist',          google: 'Urbanist:wght@400;500;600;700;800',           stack: "'Urbanist', sans-serif",           vibe: 'Light & elegant' },
  fraunces:     { label: 'Fraunces',          google: 'Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700', stack: "'Fraunces', serif",       vibe: 'Editorial & premium' },
  // ── newly added ──────────────────────────────────────────────────────────
  poppins:      { label: 'Poppins',           google: 'Poppins:wght@400;500;600;700;800',            stack: "'Poppins', sans-serif",           vibe: 'Bold & geometric' },
  nunito:       { label: 'Nunito',            google: 'Nunito:wght@400;500;600;700;800',             stack: "'Nunito', sans-serif",             vibe: 'Soft & approachable' },
  workSans:     { label: 'Work Sans',         google: 'Work+Sans:wght@400;500;600;700;800',          stack: "'Work Sans', sans-serif",          vibe: 'Practical & tidy' },
  rubik:        { label: 'Rubik',             google: 'Rubik:wght@400;500;600;700;800',              stack: "'Rubik', sans-serif",              vibe: 'Playful & rounded' },
  playfair:     { label: 'Playfair Display',  google: 'Playfair+Display:wght@400;500;600;700;800',   stack: "'Playfair Display', serif",        vibe: 'High-contrast & elegant' },
  merriweather: { label: 'Merriweather',      google: 'Merriweather:wght@400;700;900',                stack: "'Merriweather', serif",            vibe: 'Classic & readable serif' },
  plexMono:     { label: 'IBM Plex Mono',     google: 'IBM+Plex+Mono:wght@400;500;600;700',           stack: "'IBM Plex Mono', monospace",       vibe: 'Technical & monospaced' },
};


export const COLOR_PRESETS = [
  { id: 'teal',    label: 'Teal (default)', hsl: '173 80% 24%' },
  { id: 'blue',    label: 'Ocean Blue',     hsl: '217 91% 40%' },
  { id: 'indigo',  label: 'Indigo',         hsl: '243 75% 47%' },
  { id: 'emerald', label: 'Emerald',        hsl: '152 76% 30%' },
  { id: 'violet',  label: 'Violet',         hsl: '262 72% 47%' },
  { id: 'rose',    label: 'Rose',           hsl: '347 77% 45%' },
  { id: 'amber',   label: 'Amber',          hsl: '38 92% 40%' },
  { id: 'slate',   label: 'Slate',          hsl: '215 25% 27%' },
  ...NEW_COLORS.map(({ id, label, hsl }) => ({ id, label, hsl })), // drop hex, keep shape consistent
];
export const RADIUS_PRESETS = { sharp: '4px', balanced: '10px', round: '18px' };
export const DENSITY_PRESETS = { compact: '0.92', comfortable: '1', spacious: '1.08' };

export const DEFAULT_THEME = {
  colorHsl: COLOR_PRESETS[0].hsl,
  colorPresetId: 'teal',
  fontKey: 'inter',
  displayFontKey: 'inter',
  fontItalic: false,        // NEW — body text italic
  displayFontItalic: false, // NEW — heading/display text italic
  radius: 'balanced',
  density: 'comfortable',
  mode: 'system', // light | dark | system
};

const ORG_CACHE_KEY = 'aitechs_appearance_org_cache';
const personalKey = (userId) => `aitechs_appearance_personal_${userId || 'guest'}`;

// ── Color helpers ────────────────────────────────────────────────────────────
export function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function hslToHex(hslStr) {
  const [h, s, l] = hslStr.replace(/%/g, '').split(' ').map(Number);
  const sN = s / 100, lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── Font loading ──────────────────────────────────────────────────────────────
let loadedFonts = new Set();
function ensureGoogleFont(fontKey) {
  const font = FONT_LIBRARY[fontKey];
  if (!font || loadedFonts.has(fontKey)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontKey);
}




function ensureDisplayFontClass() {
  if (document.getElementById('theme-utility-styles')) return;
  const style = document.createElement('style');
  style.id = 'theme-utility-styles';
  style.textContent = `
    .font-display {
      font-family: var(--font-display);
      font-style: var(--font-style-display);
    }
  `;
  document.head.appendChild(style);
}






// ── Apply to DOM ──────────────────────────────────────────────────────────────
export function applyTheme(theme) {
  const t = { ...DEFAULT_THEME, ...theme };
  const root = document.documentElement;

  ensureGoogleFont(t.fontKey);
  ensureGoogleFont(t.displayFontKey);
  ensureDisplayFontClass();



  root.style.setProperty('--primary', t.colorHsl);
  root.style.setProperty('--ring', t.colorHsl);
  root.style.setProperty('--primary-foreground', '0 0% 100%');
  root.style.setProperty('--primary-muted', t.colorHsl);
  root.style.setProperty('--font-sans', FONT_LIBRARY[t.fontKey]?.stack || FONT_LIBRARY.inter.stack);
  root.style.setProperty('--font-display', FONT_LIBRARY[t.displayFontKey]?.stack || FONT_LIBRARY.inter.stack);
  // NEW — italic is applied as a CSS style (synthetic slant), independent of which
  // font family is loaded. This works for every font, including ones that don't
  // ship true italic glyphs on Google Fonts.
  root.style.setProperty('--font-style-sans', t.fontItalic ? 'italic' : 'normal');
  root.style.setProperty('--font-style-display', t.displayFontItalic ? 'italic' : 'normal');
  root.style.setProperty('--radius', RADIUS_PRESETS[t.radius] || RADIUS_PRESETS.balanced);
  root.style.setProperty('--font-scale', DENSITY_PRESETS[t.density] || '1');

  document.body.style.fontFamily = 'var(--font-sans)';
  document.body.style.fontSize = `calc(1rem * var(--font-scale))`;
  document.body.style.fontStyle = 'var(--font-style-sans)';
  // Body italic cascades to any child that doesn't set its own font-style.
  // Headings that explicitly use `fontFamily: 'var(--font-display)'` inline
  // need `fontStyle: 'var(--font-style-display)'` added alongside it to pick
  // up the display-italic toggle — see note below.

  const wantsDark = t.mode === 'dark' ||
    (t.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', wantsDark);
}

// ── Local caches ──────────────────────────────────────────────────────────────
export function cacheOrgTheme(theme) {
  localStorage.setItem(ORG_CACHE_KEY, JSON.stringify(theme));
}
export function readOrgCache() {
  try {
    const raw = localStorage.getItem(ORG_CACHE_KEY);
    return raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : null;
  } catch { return null; }
}

export function readPersonalOverride(userId) {
  try {
    const raw = localStorage.getItem(personalKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.enabled ? parsed.theme : null;
  } catch { return null; }
}
export function readPersonalRecord(userId) {
  try {
    const raw = localStorage.getItem(personalKey(userId));
    return raw ? JSON.parse(raw) : { enabled: false, theme: DEFAULT_THEME };
  } catch { return { enabled: false, theme: DEFAULT_THEME }; }
}
export function savePersonalRecord(userId, record) {
  localStorage.setItem(personalKey(userId), JSON.stringify(record));
}
export function clearPersonalOverride(userId) {
  localStorage.removeItem(personalKey(userId));
}

// ── Resolve which theme wins: personal override > org default > hardcoded ────
export function resolveActiveTheme(userId) {
  const org = readOrgCache() || DEFAULT_THEME;
  const personal = readPersonalOverride(userId);
  return personal || org;
}

// ── Boot sequence: call this once, as early as possible (main.jsx) ───────────
export async function bootTheme(userId, subdomain) {
  // 1. Apply cached values instantly — avoids flash of unstyled/default theme
  applyTheme(resolveActiveTheme(userId));

  // 2. Fetch the real org default in the background, then re-resolve
  try {
    const res = await fetch('/api/appearance_settings', { headers: { 'X-Subdomain': subdomain } });
    if (res.ok) {
      const d = await res.json();
      if (d && d.color_hsl) {
        const orgTheme = {
          colorHsl: d.color_hsl, colorPresetId: d.color_preset_id || 'custom',
          fontKey: d.font_key || 'inter', displayFontKey: d.display_font_key || d.font_key || 'inter',
          fontItalic: !!d.font_italic, displayFontItalic: !!d.display_font_italic,
          radius: d.radius || 'balanced', density: d.density || 'comfortable', mode: d.mode || 'system',
        };
        cacheOrgTheme(orgTheme);
        const personal = readPersonalOverride(userId);
        if (!personal) applyTheme(orgTheme);
      }
    }
  } catch (_) {
    // offline / endpoint missing — cached/default theme already applied, no-op
  }
}