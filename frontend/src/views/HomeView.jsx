import { Alert, Box, Button, Grid, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { ProductCard } from '../components/ProductCard'

export const HomeView = () => {
  const { user } = useAuth()
  const { products, loading, error } = useProductsViewModel(user?.id)

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2.8, md: 5 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(125deg, #0f172a 0%, #312e81 42%, #4f46e5 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.18), transparent 38%)',
            pointerEvents: 'none',
          }}
        />
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' } }}>
          BazardShop - Le Site Ecommerce N°1
        </Typography>
        <Typography sx={{ mb: 2.5, color: 'rgba(255,255,255,0.92)', maxWidth: 720 }}>
          BazardShop est votre marketplace de confiance pour acheter et vendre facilement tout type de produit, avec une experience fluide, securisee et professionnelle.
        </Typography>
        {!user && (
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="inherit"
            sx={{ color: '#312e81', fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
          >
            Creer un compte vendeur
          </Button>
        )}
      </Paper>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Typography>Chargement...</Typography>}
      {!loading && products.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography>Aucun produit pour le moment.</Typography>
        </Box>
      )}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.2 }}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
