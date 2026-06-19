import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import SortRoundedIcon from '@mui/icons-material/SortRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { ProductCard } from '../components/ProductCard'
import { brand } from '../theme/tokens'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus recents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix decroissant' },
  { value: 'name', label: 'Nom A-Z' },
]

const ProductSkeleton = () => (
  <Paper
    sx={{
      borderRadius: `${brand.radius.lg}px`,
      overflow: 'hidden',
      border: `1px solid ${brand.borderLight}`,
    }}
  >
    <Skeleton variant="rectangular" height={240} />
    <Box sx={{ p: 2.4 }}>
      <Skeleton width="85%" height={28} />
      <Skeleton width="100%" sx={{ mt: 1 }} />
      <Skeleton width="70%" />
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton width={100} height={32} />
      </Stack>
    </Box>
  </Paper>
)

export const HomeView = () => {
  const { user } = useAuth()
  const { products, loading, error } = useProductsViewModel(user?.id)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    let list = [...products]

    if (term) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.sellerName?.toLowerCase().includes(term)
      )
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-desc':
        list.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'name':
        list.sort((a, b) => a.title.localeCompare(b.title, 'fr'))
        break
      default:
        list.sort((a, b) => b.id - a.id)
    }

    return list
  }, [products, search, sort])

  const priceRange = useMemo(() => {
    if (!products.length) return null
    const prices = products.map((p) => Number(p.price))
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [products])

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 3,
          borderRadius: `${brand.radius.xl}px`,
          background: brand.gradients.hero,
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
          border: 'none',
          boxShadow: brand.shadows.lg,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: brand.gradients.heroGlow,
            pointerEvents: 'none',
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          sx={{ position: 'relative' }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Chip
              icon={<VerifiedRoundedIcon sx={{ fontSize: 16 }} />}
              label="Marketplace verifiee"
              size="small"
              sx={{
                mb: 1.5,
                bgcolor: 'rgba(255,255,255,0.14)',
                color: '#fff',
                fontWeight: 600,
                '& .MuiChip-icon': { color: brand.primaryLight },
              }}
            />
            <Typography
              variant="h3"
              sx={{
                mb: 1.2,
                fontSize: { xs: '1.65rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              BazardShop — Le site e-commerce N°1
            </Typography>
            <Typography
              sx={{
                mb: 2.5,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.7,
                fontSize: { xs: 15, md: 16.5 },
              }}
            >
              BazardShop est votre marketplace de confiance pour acheter et vendre facilement
              tout type de produit, avec une experience fluide, securisee et professionnelle.
            </Typography>
            {!user && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagRoundedIcon />}
                  sx={{
                    background: '#fff',
                    color: brand.primaryDark,
                    fontWeight: 700,
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                    '&:hover': { background: '#f0fdfa', color: brand.primaryDark },
                  }}
                >
                  Creer un compte vendeur
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.45)',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Se connecter
                </Button>
              </Stack>
            )}
          </Box>
          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', lg: 'grid' },
              placeItems: 'center',
              width: 140,
              height: 140,
              borderRadius: '32px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <ShoppingBagRoundedIcon sx={{ fontSize: 64, color: brand.primaryLight }} />
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.4 },
          mb: 3,
          borderRadius: `${brand.radius.lg}px`,
          background: '#fff',
          boxShadow: brand.shadows.sm,
          border: `1px solid ${brand.borderLight}`,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.4 }}>
              Catalogue produits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading
                ? 'Chargement des annonces...'
                : `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} affiche${filteredProducts.length > 1 ? 's' : ''}`}
              {priceRange && !loading
                ? ` · de ${priceRange.min.toFixed(2)} a ${priceRange.max.toFixed(2)} EUR`
                : ''}
            </Typography>
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.4}
            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 420 } }}
          >
            <TextField
              size="small"
              placeholder="Rechercher un produit, vendeur..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: brand.textSoft }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { sm: 240 } }}
            />
            <TextField
              select
              size="small"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              sx={{ minWidth: { sm: 180 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortRoundedIcon fontSize="small" sx={{ color: brand.textSoft }} />
                  </InputAdornment>
                ),
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: `${brand.radius.sm}px` }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item}>
              <ProductSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && products.length === 0 && (
        <Paper
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            borderRadius: `${brand.radius.lg}px`,
            bgcolor: brand.surfaceMuted,
            border: `1px dashed ${brand.border}`,
          }}
        >
          <ShoppingBagRoundedIcon sx={{ fontSize: 56, color: brand.primary, mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" sx={{ mb: 0.8, fontWeight: 700 }}>
            Aucun produit pour le moment
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Le catalogue est vide. Revenez bientot ou creez un compte vendeur pour publier la
            premiere annonce.
          </Typography>
          {!user && (
            <Button component={RouterLink} to="/register" variant="contained" size="large">
              Devenir vendeur
            </Button>
          )}
        </Paper>
      )}

      {!loading && products.length > 0 && filteredProducts.length === 0 && (
        <Paper
          sx={{
            py: 6,
            textAlign: 'center',
            borderRadius: `${brand.radius.lg}px`,
            bgcolor: brand.surfaceMuted,
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.6, fontWeight: 700 }}>
            Aucun resultat
          </Typography>
          <Typography color="text.secondary">
            Essayez un autre mot-cle ou reinitialisez la recherche.
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => setSearch('')}>
            Effacer la recherche
          </Button>
        </Paper>
      )}

      {!loading && filteredProducts.length > 0 && (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {filteredProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
