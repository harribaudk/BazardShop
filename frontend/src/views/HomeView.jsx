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
          p: { xs: 2.5, md: 4 },
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(120deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          BazardShop - Le Site Ecommerce N°1
        </Typography>
        <Typography sx={{ mb: 2, color: 'rgba(255,255,255,0.86)' }}>
          BazardShop est votre marketplace de confiance pour acheter et vendre facilement tout type de produit, avec une experience fluide, securisee et professionnelle.
        </Typography>
        {!user && (
          <Button component={RouterLink} to="/register" variant="contained" color="warning">
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
      <Grid container spacing={2.2}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
