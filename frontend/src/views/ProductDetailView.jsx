import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { getFileUrl } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'
import { useProductDetailViewModel } from '../viewmodels/useProductDetailViewModel'

export const ProductDetailView = () => {
  const { productId } = useParams()
  const { product, loading, error } = useProductDetailViewModel(productId)
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const handleContactSeller = () => {
    if (!product) return
    if (!token) {
      navigate('/login')
      return
    }
    if (user?.id === product.createdBy) {
      navigate('/dashboard')
      return
    }
    navigate(`/chat?with=${product.createdBy}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '45vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Produit introuvable.'}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Retour au catalogue
        </Button>
      </Paper>
    )
  }

  return (
    <Stack spacing={2.2}>
      <Button component={RouterLink} to="/" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Retour au catalogue
      </Button>

      <Paper sx={{ p: { xs: 1.2, sm: 2.2 }, borderRadius: 4 }}>
        <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' } }}>
          <Box
            component="img"
            src={
              product.imageUrl
                ? getFileUrl(product.imageUrl)
                : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80'
            }
            alt={product.title}
            sx={{
              width: '100%',
              height: { xs: 260, sm: 360, md: 520 },
              objectFit: 'cover',
              borderRadius: 3,
            }}
          />

          <Stack
            spacing={2}
            sx={{
              p: { xs: 1.2, sm: 1.5, md: 2 },
              borderRadius: 3,
              background: 'linear-gradient(180deg, rgba(79,70,229,0.06), rgba(79,70,229,0.015))',
            }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" color="primary" label="Produit verifie" />
              <Chip size="small" variant="outlined" label={`Vendeur: ${product.sellerName}`} />
            </Stack>

            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.9rem', md: '2.2rem' } }}>
              {product.title}
            </Typography>

            <Typography
              variant="h4"
              color="primary"
              sx={{ fontSize: { xs: '1.55rem', sm: '2rem' }, fontWeight: 800 }}
            >
              {Number(product.price).toFixed(2)} EUR
            </Typography>

            <Divider />

            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
              {product.description}
            </Typography>

            <Stack spacing={1.2} sx={{ mt: 'auto', pt: 1 }}>
              <Button variant="contained" size="large" fullWidth onClick={handleContactSeller}>
                {user?.id === product.createdBy ? 'Gerer ce produit' : 'Contacter le vendeur'}
              </Button>
              <Button variant="outlined" size="large" fullWidth component={RouterLink} to="/">
                Continuer mes achats
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
