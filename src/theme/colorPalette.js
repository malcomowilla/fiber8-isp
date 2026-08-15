
export const NEW_COLORS = [
  { id: 'amberOrange',     label: 'Amber Orange',      hex: '#FC7D14', hsl: '27 97% 53%' },
  { id: 'paleYellow',      label: 'Pale Yellow',       hex: '#FAF2A0', hsl: '55 90% 80%' },
  { id: 'deepForestTeal',  label: 'Deep Forest Teal',  hex: '#012F25', hsl: '167 96% 9%' },
  { id: 'brightCyan',      label: 'Bright Cyan',       hex: '#50E8F4', hsl: '184 88% 64%' },
  { id: 'paleCyan',        label: 'Pale Cyan',         hex: '#C7F8FE', hsl: '187 96% 89%' },
  { id: 'deepTeal',        label: 'Deep Teal',         hex: '#001619', hsl: '187 100% 5%' },
  { id: 'navyBlue',        label: 'Navy Blue',         hex: '#002B4C', hsl: '206 100% 15%' },
  { id: 'paleBlue',        label: 'Pale Blue',         hex: '#C0EBFF', hsl: '199 100% 88%' },
  { id: 'lightOrange',     label: 'Light Orange',      hex: '#F59E71', hsl: '20 87% 70%' },
  { id: 'orange',          label: 'Orange',            hex: '#EE8C2B', hsl: '30 85% 55%' },
  { id: 'offWhite',        label: 'Off White',         hex: '#FEFBF3', hsl: '44 85% 97%' },
  { id: 'darkRed',         label: 'Dark Red',          hex: '#4E0401', hsl: '2 97% 15%' },
];

// Optional: plain CSS custom properties, if you'd rather set these
// directly on :root instead of going through applyTheme()/COLOR_PRESETS.
export function applyNewColorVars(root = document.documentElement) {
  NEW_COLORS.forEach((c) => {
    root.style.setProperty(`--color-${c.id}`, c.hsl);       // e.g. --color-amberOrange: 27 97% 53%
    root.style.setProperty(`--color-${c.id}-hex`, c.hex);   // e.g. --color-amberOrange-hex: #FC7D14
  });
}