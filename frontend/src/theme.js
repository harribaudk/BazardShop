import { createTheme } from '@mui/material/styles'
import { brand } from './theme/tokens'

export { brand } from './theme/tokens'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: brand.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: brand.secondarySoft,
      contrastText: '#ffffff',
    },
    success: { main: brand.success },
    error: { main: brand.error },
    warning: { main: brand.warning },
    background: {
      default: brand.surfaceWarm,
      paper: brand.surface,
    },
    text: {
      primary: brand.text,
      secondary: brand.textMuted,
    },
    divider: brand.borderLight,
  },
  shape: { borderRadius: brand.radius.md },
  typography: {
    fontFamily:
      '"Inter", "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: brand.gradients.page,
          backgroundAttachment: 'fixed',
        },
        '::selection': {
          background: 'rgba(13, 148, 136, 0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: brand.gradients.navbar,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.18)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${brand.borderLight}`,
          boxShadow: brand.shadows.sm,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${brand.borderLight}`,
          boxShadow: brand.shadows.sm,
          borderRadius: brand.radius.lg,
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          '&:hover': {
            boxShadow: brand.shadows.md,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: brand.radius.sm,
          paddingInline: 18,
          paddingBlock: 10,
          boxShadow: 'none',
        },
        contained: {
          background: brand.gradients.primary,
          boxShadow: brand.shadows.primary,
          '&:hover': {
            background: brand.gradients.primaryHover,
            boxShadow: brand.shadows.primaryHover,
          },
        },
        containedPrimary: {
          background: brand.gradients.primary,
          '&:hover': {
            background: brand.gradients.primaryHover,
          },
        },
        outlined: {
          borderColor: brand.border,
          '&:hover': {
            borderColor: brand.primary,
            background: brand.primaryMuted,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: brand.radius.sm,
            background: brand.surfaceMuted,
            transition: 'background 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              background: '#fff',
            },
            '&.Mui-focused': {
              background: '#fff',
              boxShadow: `0 0 0 3px rgba(13, 148, 136, 0.15)`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
        colorPrimary: {
          background: brand.primaryMuted,
          color: brand.primaryDark,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: brand.radius.sm },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: brand.radius.lg,
          boxShadow: brand.shadows.lg,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: `${brand.radius.lg}px 0 0 ${brand.radius.lg}px`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: brand.borderLight },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: brand.radius.pill,
          backgroundColor: 'rgba(148, 163, 184, 0.18)',
        },
        bar: {
          background: brand.gradients.primary,
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: { color: 'primary' },
    },
  },
})
