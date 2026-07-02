export const Colors = {
  light: {
    primary: '#0B3B24',       // Ekteki Derin Asil Zümrüt Yeşili
    primaryLight: 'rgba(11, 59, 36, 0.1)',
    accent: '#D4AF37',        // Mat Altın Vurgu rengi
    accentLight: 'rgba(212, 175, 55, 0.15)',
    background: '#FFFDF0',    // Ekteki yumuşak sıcak krem arka plan (Warm Cream / Ivory)
    surface: '#FFFFFF',       // Beyaz kart yüzeyi (katman efekti için)
    surfaceSecondary: '#F3F0E6',
    textPrimary: '#1A2E22',   // Koyu Zümrüt Siyahı
    textSecondary: '#5A6E62', // Muted Yeşil-Gri
    border: '#E2DDCF',        // İnce krem/altın borders
    warning: '#D97706',
    warningBackground: '#FFFBEB',
    cardBackground: '#FFFFFF',
  },
  dark: {
    primary: '#0B3B24',
    primaryLight: 'rgba(11, 59, 36, 0.1)',
    accent: '#D4AF37',
    accentLight: 'rgba(212, 175, 55, 0.15)',
    background: '#FFFDF0',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F0E6',
    textPrimary: '#1A2E22',
    textSecondary: '#5A6E62',
    border: '#E2DDCF',
    warning: '#D97706',
    warningBackground: '#FFFBEB',
    cardBackground: '#FFFFFF',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};
