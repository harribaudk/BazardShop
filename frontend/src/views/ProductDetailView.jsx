import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { getFileUrl } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'
import { useProductDetailViewModel } from '../viewmodels/useProductDetailViewModel'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { brand } from '../theme/tokens'

const fallbackImage =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80'

const TrustItem = ({ icon, title, subtitle }) => (
  <Stack direction="row" spacing={1.4} alignItems="flex-start">
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        bgcolor: brand.primaryMuted,
        color: brand.primary,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: 14, color: brand.text }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: brand.textMuted, lineHeight: 1.45 }}>
        {subtitle}
      </Typography>
    </Box>
  </Stack>
)

export const ProductDetailView = () => {
  const { productId } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { product, loading, error } = useProductDetailViewModel(productId)
  const { products } = useProductsViewModel()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const relatedProducts = products
    .filter((item) => item.id !== product?.id)
    .slice(0, 3)

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
      <Paper sx={{ p: 3, borderRadius: `${brand.radius.lg}px` }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Produit introuvable.'}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Retour au catalogue
        </Button>
      </Paper>
    )
  }

  const imageSrc = product.imageUrl ? getFileUrl(product.imageUrl) : fallbackImage

  return (
    <Stack spacing={3}>
      <Breadcrumbs sx={{ color: brand.textMuted, fontSize: 14 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Accueil
        </Link>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Catalogue
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }} noWrap>
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Paper
        sx={{
          borderRadius: `${brand.radius.xl}px`,
          boxShadow: brand.shadows.md,
          overflow: 'hidden',
          border: `1px solid ${brand.borderLight}`,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
          }}
        >
          <Box
            sx={{
              p: { xs: 1.6, sm: 2.4 },
              bgcolor: brand.surfaceMuted,
              borderRight: { lg: `1px solid ${brand.borderLight}` },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: `${brand.radius.lg}px`,
                overflow: 'hidden',
                boxShadow: brand.shadows.sm,
                border: `1px solid ${brand.borderLight}`,
                bgcolor: '#fff',
              }}
            >
              <Box
                component="img"
                src={imageSrc}
                alt={product.title}
                sx={{
                  width: '100%',
                  height: { xs: 300, sm: 400, lg: 480 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </Box>

          <Stack
            spacing={2.4}
            sx={{
              p: { xs: 2.4, sm: 3, md: 3.5 },
              position: { lg: 'sticky' },
              top: { lg: 88 },
              alignSelf: { lg: 'start' },
            }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                icon={<VerifiedRoundedIcon sx={{ fontSize: 16 }} />}
                label="Annonce verifiee"
                color="primary"
              />
              <Chip
                size="small"
                icon={<StorefrontRoundedIcon sx={{ fontSize: 16 }} />}
                variant="outlined"
                label={product.sellerName}
              />
            </Stack>

            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.65rem', sm: '2rem', md: '2.15rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  mb: 1.2,
                }}
              >
                {product.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '2rem', sm: '2.35rem' },
                  fontWeight: 800,
                  color: brand.primary,
                  letterSpacing: '-0.03em',
                }}
              >
                {Number(product.price).toFixed(2)}{' '}
                <Typography component="span" sx={{ fontSize: '1.1rem', fontWeight: 600, color: brand.textMuted }}>
                  EUR
                </Typography>
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  mb: 1.2,
                  color: brand.text,
                }}
              >
                Description
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.85, fontSize: 15 }}
              >
                {product.description}
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: `${brand.radius.md}px`,
                bgcolor: brand.surfaceMuted,
                border: `1px solid ${brand.borderLight}`,
              }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TrustItem
                    icon={<SecurityRoundedIcon fontSize="small" />}
                    title="Paiement securise"
                    subtitle="Transactions protegees sur BazardShop"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TrustItem
                    icon={<SupportAgentRoundedIcon fontSize="small" />}
                    title="Contact direct"
                    subtitle="Messagerie avec le vendeur"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TrustItem
                    icon={<LocalShippingRoundedIcon fontSize="small" />}
                    title="Livraison flexible"
                    subtitle="A convenir avec le vendeur"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TrustItem
                    icon={<VerifiedRoundedIcon fontSize="small" />}
                    title="Vendeur identifie"
                    subtitle={product.sellerName}
                  />
                </Grid>
              </Grid>
            </Paper>

            {!isMobile && (
              <Stack spacing={1.4} sx={{ pt: 0.5 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ChatRoundedIcon />}
                  onClick={handleContactSeller}
                >
                  {user?.id === product.createdBy ? 'Gerer ce produit' : 'Contacter le vendeur'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  component={RouterLink}
                  to="/"
                  startIcon={<ArrowBackRoundedIcon />}
                >
                  Continuer mes achats
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Paper>

      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            borderRadius: `${brand.radius.lg}px ${brand.radius.lg}px 0 0`,
            borderTop: `1px solid ${brand.borderLight}`,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Prix
            </Typography>
            <Typography sx={{ fontWeight: 800, color: brand.primary, fontSize: '1.2rem' }}>
              {Number(product.price).toFixed(2)} EUR
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ChatRoundedIcon />}
            onClick={handleContactSeller}
          >
            {user?.id === product.createdBy ? 'Gerer' : 'Contacter'}
          </Button>
        </Paper>
      )}

      {relatedProducts.length > 0 && (
        <Box sx={{ pb: isMobile ? 10 : 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2.5 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Vous pourriez aussi aimer
            </Typography>
            <Button component={RouterLink} to="/" size="small">
              Voir tout
            </Button>
          </Stack>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {relatedProducts.map((item) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                <ProductCard product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  )
}
