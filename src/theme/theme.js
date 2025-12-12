export const lightTheme = {
  colors: {
    white: '#ffffff',
    black: '#141414',
    gray: '#555',
    darkGray: '#1E2C30',
    accent: '#7A9CA5',
    borderLight: 'rgba(0, 0, 0, 0.15)',
    darkGreen: '#111E22',
    accentDark: '#5C8692',
    bannerBg: '#EBF3F5',
    bannerOverlay: 'rgba(0, 44, 54, 0.8)',
    footerText: '#fff',
    primary: '#5C8692',
    secondary: '#7A9CA5',
    danger: '#dc3545',
    success: '#28a745'
  },
  typography: {
    fontFamily: {
      playfair: 'Playfair, serif',
      manrope: 'Manrope, sans-serif'
    },
    fontSize: {
      xs: '1.2rem',
      sm: '1.4rem',
      base: '1.6rem',
      md: '1.8rem',
      lg: '2.2rem',
      xl: '2.4rem',
      xxl: '2.6rem',
      xxxl: '4.5rem',
      huge: '7rem'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.65,
      loose: 1.8
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  media: {
    mobile: '@media (max-width: 767px)',
    tablet: '@media (min-width: 768px) and (max-width: 1023px)',
    laptop: '@media (min-width: 1024px) and (max-width: 1199px)',
    desktop: '@media (min-width: 1200px) and (max-width: 1919px)',
    large: '@media (min-width: 1920px)'
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1920px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    round: '50%'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.12)',
    lg: '0 8px 16px rgba(0,0,0,0.15)',
    xl: '0 12px 24px rgba(0,0,0,0.18)'
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    white: '#1a1a1a',
    black: '#f0f0f0',
    gray: '#fff',
    darkGray: '#0d1618',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    bannerBg: '#2A3538'
  }
};

