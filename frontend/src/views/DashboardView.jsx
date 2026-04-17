import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'
import { useAuth } from '../context/AuthContext'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'

export const DashboardView = () => {
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
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard vendeur
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Ajouter un produit
        </Typography>
        <ProductForm onSubmit={createProduct} submitLabel="Creer produit" />
      </Paper>
      {error && <Alert severity="error">{error}</Alert>}
      {!myProducts.length && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6">Aucun produit publie</Typography>
            <Typography color="text.secondary">
              Utilise le formulaire ci-dessus pour creer ton premier produit.
            </Typography>
          </Stack>
        </Paper>
      )}
      <Grid container spacing={2}>
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
      <Dialog open={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} fullWidth>
        <DialogTitle>Modifier un produit</DialogTitle>
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
