import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'
import { useAuth } from '../context/AuthContext'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { brand } from '../theme/tokens'

export const DashboardView = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useAuth()
  const { myProducts, error, createProduct, updateProduct, deleteProduct } = useProductsViewModel(
    user?.id
  )
  const [editingProduct, setEditingProduct] = useState(null)

  const onDelete = async (id) => {
    await deleteProduct(id)
  }

  return (
    <>
      <PageHeader
        title="Dashboard vendeur"
        subtitle="Publiez, modifiez et gerez vos annonces depuis un espace dedie."
      />

      <Paper
        sx={{
          p: { xs: 2.4, md: 3.2 },
          mb: 3,
          borderRadius: `${brand.radius.lg}px`,
          background: brand.gradients.card,
          boxShadow: brand.shadows.md,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.4} sx={{ mb: 2.4 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: brand.primaryMuted,
              color: brand.primary,
            }}
          >
            <Inventory2RoundedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Ajouter un produit
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Remplissez le formulaire pour publier une nouvelle annonce.
            </Typography>
          </Box>
        </Stack>
        <ProductForm onSubmit={createProduct} submitLabel="Creer produit" />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: `${brand.radius.sm}px` }}>
          {error}
        </Alert>
      )}

      {!myProducts.length && (
        <Paper
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: `${brand.radius.lg}px`,
            bgcolor: brand.surfaceMuted,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Aucun produit publie
            </Typography>
            <Typography color="text.secondary">
              Utilisez le formulaire ci-dessus pour creer votre premier produit.
            </Typography>
          </Stack>
        </Paper>
      )}

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {myProducts.map((product) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
            <ProductCard
              product={product}
              canEdit
              onEdit={setEditingProduct}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Modifier un produit</DialogTitle>
        <DialogContent>
          {editingProduct && (
            <ProductForm
              initialProduct={editingProduct}
              submitLabel="Mettre a jour"
              onSubmit={async (form, file) => {
                await updateProduct(editingProduct.id, form, file)
                setEditingProduct(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
