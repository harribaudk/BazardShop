import { Box, Paper, Stack, Typography } from '@mui/material'
import { brand } from '../theme/tokens'

export const AuthLayout = ({ title, subtitle, children }) => (
  <Box
    sx={{
      display: 'grid',
      gap: { xs: 2.4, md: 3 },
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      alignItems: 'stretch',
      maxWidth: 980,
      mx: 'auto',
    }}
  >
    <Paper
      elevation={0}
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        p: 5,
        borderRadius: `${brand.radius.xl}px`,
        background: brand.gradients.auth,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        boxShadow: brand.shadows.lg,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(20, 184, 166, 0.25)',
          filter: 'blur(12px)',
        }}
      />
      <Typography
        variant="h3"
        sx={{
          position: 'relative',
          fontSize: '2rem',
          mb: 1.5,
          fontWeight: 800,
        }}
      >
        BazardShop
      </Typography>
      <Typography
        sx={{
          position: 'relative',
          color: 'rgba(255,255,255,0.88)',
          lineHeight: 1.7,
          maxWidth: 360,
        }}
      >
        Rejoignez une marketplace moderne pour acheter, vendre et echanger avec des
        utilisateurs de confiance.
      </Typography>
      <Stack spacing={1.2} sx={{ position: 'relative', mt: 4 }}>
        {['Catalogue produits', 'Dashboard vendeur', 'Messagerie integree'].map((item) => (
          <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: brand.primaryLight,
                boxShadow: '0 0 0 4px rgba(20, 184, 166, 0.2)',
              }}
            />
            <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{item}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.8, sm: 4 },
        borderRadius: `${brand.radius.xl}px`,
        background: brand.gradients.card,
        boxShadow: brand.shadows.md,
      }}
    >
      <Typography variant="h4" sx={{ mb: 0.6, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: brand.textMuted, mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Paper>
  </Box>
)
