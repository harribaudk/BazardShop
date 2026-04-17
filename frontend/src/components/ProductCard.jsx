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
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.14)',
      },
    }}
  >
    <CardMedia
      component="img"
      sx={{ height: { xs: 190, sm: 210, md: 220 } }}
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 1, sm: 0 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {Number(product.price).toFixed(2)} EUR
        </Typography>
        <Chip size="small" label={product.sellerName} />
      </Stack>
    </CardContent>
    {canEdit && (
      <CardActions sx={{ flexWrap: 'wrap', gap: 1, px: 2, pb: 2 }}>
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
