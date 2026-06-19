import { Box, Typography } from '@mui/material'
import { brand } from '../theme/tokens'

export const PageHeader = ({ title, subtitle, action }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: brand.text,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: brand.textMuted, mt: 0.6, maxWidth: 560 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
)
