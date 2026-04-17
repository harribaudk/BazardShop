import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    primary: { main: '#1d4ed8' },
    secondary: { main: '#0f172a' },
    background: { default: '#f8fafc' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
})
