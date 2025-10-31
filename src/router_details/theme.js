export const tokens = (mode) => ({
  grey: {
    100: mode === 'dark' ? '#e0e0e0' : '#1a1a1a',
    200: mode === 'dark' ? '#c2c2c2' : '#2a2a2a',
    300: mode === 'dark' ? '#a3a3a3' : '#3a3a3a',
    400: mode === 'dark' ? '#858585' : '#4a4a4a',
    500: mode === 'dark' ? '#666666' : '#5a5a5a',
    600: mode === 'dark' ? '#525252' : '#6a6a6a',
    700: mode === 'dark' ? '#3d3d3d' : '#7a7a7a',
    800: mode === 'dark' ? '#292929' : '#8a8a8a',
    900: mode === 'dark' ? '#141414' : '#9a9a9a'
  },
  primary: {
    100: mode === 'dark' ? '#d0d1d5' : '#0a0a0a',
    200: mode === 'dark' ? '#a1a4ab' : '#1a1a1a',
    300: mode === 'dark' ? '#727681' : '#2a2a2a',
    400: mode === 'dark' ? '#434957' : '#3a3a3a',
    500: mode === 'dark' ? '#141b2d' : '#4a4a4a',
    600: mode === 'dark' ? '#101624' : '#5a5a5a',
    700: mode === 'dark' ? '#0c101b' : '#6a6a6a',
    800: mode === 'dark' ? '#080b12' : '#7a7a7a',
    900: mode === 'dark' ? '#040509' : '#8a8a8a'
  },
  greenAccent: {
    100: mode === 'dark' ? '#dbf5ee' : '#0a2920',
    200: mode === 'dark' ? '#b7ebde' : '#145240',
    300: mode === 'dark' ? '#94e2cd' : '#1e7a60',
    400: mode === 'dark' ? '#70d8bd' : '#28a380',
    500: mode === 'dark' ? '#4cceac' : '#32cc9f',
    600: mode === 'dark' ? '#3da58a' : '#2ba389',
    700: mode === 'dark' ? '#2e7c67' : '#247a6a',
    800: mode === 'dark' ? '#1e5245' : '#1d524b',
    900: mode === 'dark' ? '#0f2922' : '#132a2c'
  },
  blueAccent: {
    100: mode === 'dark' ? '#e1e2fe' : '#0a0f29',
    200: mode === 'dark' ? '#c3c6fd' : '#141e52',
    300: mode === 'dark' ? '#a4a9fc' : '#1e2d7a',
    400: mode === 'dark' ? '#868dfb' : '#283ca2',
    500: mode === 'dark' ? '#6870fa' : '#324bc8',
    600: mode === 'dark' ? '#535ac8' : '#2b3fa3',
    700: mode === 'dark' ? '#3e4397' => '#24357e',
    800: mode === 'dark' ? '#2a2d80' => '#1d2b59',
    900: mode === 'dark' ? '#151632' => '#162134'
  }
});