/**
 * WARM_EARTHY preset - "dark soil" override.
 * The preset identity (sand / sage / terracotta, lifestyle) is kept; only the
 * base surfaces go dark and the water blue is added as the action accent.
 * The `name` field MUST stay exactly as in the preset file.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    bgDeep: '#140F08',
    bg: '#221B10',
    surface: '#2E2416',
    surfaceAlt: '#3A2E1C',

    border: 'rgba(240,237,233,0.10)',
    borderStrong: 'rgba(240,237,233,0.18)',
    glass: 'rgba(240,237,233,0.06)',

    primary: '#AB782A',
    primaryLight: '#D0A054',
    accent: '#2870E0',
    accentDark: '#1B55B8',
    accentSoft: '#9BC2FF',

    sage: '#7FA46B',
    terracotta: '#D97B4D',
    danger: '#C45A3B',
    olive: '#545926',

    text: '#F0EDE9',
    textSecondary: '#C9BFB0',
    textMuted: '#8C8070',
  },

  gradients: {
    loader: ['rgba(10,7,3,0.94)', 'rgba(34,27,16,0.90)', 'rgba(10,7,3,0.97)'] as const,
    menu: ['rgba(34,27,16,0.80)', 'rgba(26,20,12,0.88)', 'rgba(16,12,7,0.94)'] as const,
    game: ['rgba(24,19,11,0.86)', 'rgba(20,15,9,0.92)', 'rgba(14,10,6,0.96)'] as const,
    gameover: ['rgba(40,112,224,0.22)', 'rgba(26,20,12,0.92)', 'rgba(14,10,6,0.96)'] as const,
    plain: ['rgba(30,24,14,0.88)', 'rgba(22,17,10,0.93)', 'rgba(14,10,6,0.96)'] as const,
    water: ['#2870E0', '#1B55B8'] as const,
    ochre: ['#D0A054', '#8A5F20'] as const,
    rail: ['#AB782A', '#2870E0'] as const,
  },

  typography: {
    hero: { fontSize: 36, fontWeight: '900' as const, letterSpacing: 1, lineHeight: 42 },
    title: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 0.8 },
    section: { fontSize: 20, fontWeight: '800' as const, letterSpacing: 0.5 },
    body: { fontSize: 15, fontWeight: '600' as const, lineHeight: 21 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1.2, lineHeight: 24 },
  },

  radius: { sm: 8, tile: 12, md: 14, lg: 16, card: 18, panel: 24, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },

  shadows: {
    water: {
      shadowColor: '#2870E0',
      shadowOpacity: 0.42,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    ochre: {
      shadowColor: '#AB782A',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 9,
    },
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.3,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
  },
} as const;

export type Theme = typeof theme;
export default theme;
