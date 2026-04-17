import { Button, Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import { getFileUrl } from '../services/apiClient'

export const ProductCard = ({ product, canEdit, onEdit, onDelete }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    }}
  >
    <CardMedia
      component="img"
      height="220"
      image={
        product.imageUrl
          ? getFileUrl(product.imageUrl)
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
      }
      alt={product.title}
      className="product-image"
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6">{product.title}</Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {product.description}
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          {Number(product.price).toFixed(2)} EUR
        </Typography>
        <Chip size="small" label={product.sellerName} />
      </Stack>
    </CardContent>
    {canEdit && (
      <CardActions>
        <Button size="small" onClick={() => onEdit(product)}>
          Modifier
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(product.id)}>
          Supprimer
        </Button>
      </CardActions>
    )}
  </Card>
)
