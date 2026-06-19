import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { brand } from '../theme/tokens'

export const AppFooter = () => (
  <Box
    component="footer"
    sx={{
      mt: { xs: 6, md: 8 },
      py: { xs: 3, md: 4 },
      px: { xs: 2, sm: 3 },
      borderTop: `1px solid ${brand.borderLight}`,
      background: 'rgba(255, 255, 255, 0.72)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <Box
      sx={{
        maxWidth: 1280,
        mx: 'auto',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            fontSize: 18,
            color: brand.text,
            letterSpacing: '-0.02em',
          }}
        >
          BazardShop
        </Typography>
        <Typography variant="body2" sx={{ color: brand.textMuted, mt: 0.4 }}>
          Marketplace de confiance — achetez et vendez en toute simplicite.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
        <Typography
          component={Link}
          to="/"
          variant="body2"
          sx={{ color: brand.textMuted, '&:hover': { color: brand.primary } }}
        >
          Catalogue
        </Typography>
        <Typography
          component={Link}
          to="/login"
          variant="body2"
          sx={{ color: brand.textMuted, '&:hover': { color: brand.primary } }}
        >
          Connexion
        </Typography>
        <Typography variant="body2" sx={{ color: brand.textSoft }}>
          MDS B3 DEW 2025-2026
        </Typography>
      </Box>
    </Box>
  </Box>
)
