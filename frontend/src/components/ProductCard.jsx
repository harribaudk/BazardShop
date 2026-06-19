import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getFileUrl } from '../services/apiClient'
import { brand } from '../theme/tokens'

const fallbackImage =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'

export const ProductCard = ({ product, canEdit, onEdit, onDelete }) => {
  const imageSrc = product.imageUrl ? getFileUrl(product.imageUrl) : fallbackImage
  const sellerInitial = product.sellerName ? product.sellerName.charAt(0).toUpperCase() : 'V'

  if (canEdit) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: `${brand.radius.lg}px`,
          overflow: 'hidden',
          border: `1px solid ${brand.borderLight}`,
          boxShadow: brand.shadows.sm,
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardActionArea component={RouterLink} to={`/products/${product.id}`}>
            <Box
              component="img"
              src={imageSrc}
              alt={product.title}
              className="product-image"
              sx={{
                width: '100%',
                height: { xs: 200, sm: 220 },
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </CardActionArea>
          <Chip
            size="small"
            label={`${Number(product.price).toFixed(2)} EUR`}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              color: '#fff',
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.2 }}>
          <Typography
            sx={{
              fontSize: '1.05rem',
              fontWeight: 700,
              mb: 0.8,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: brand.textMuted,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.55,
            }}
          >
            {product.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ flexWrap: 'wrap', gap: 1, px: 2, pb: 2, pt: 0 }}>
          <Button
            size="small"
            component={RouterLink}
            to={`/products/${product.id}`}
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
          >
            Voir
          </Button>
          <Button size="small" variant="outlined" onClick={() => onEdit(product)}>
            Modifier
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(product.id)}>
            Supprimer
          </Button>
        </CardActions>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: `${brand.radius.lg}px`,
        overflow: 'hidden',
        border: `1px solid ${brand.borderLight}`,
        boxShadow: brand.shadows.sm,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: brand.shadows.lg,
          borderColor: 'rgba(13, 148, 136, 0.35)',
          '& .product-card-image': {
            transform: 'scale(1.06)',
          },
          '& .product-card-cta': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/products/${product.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: brand.surfaceMuted,
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={product.title}
            className="product-card-image"
            sx={{
              width: '100%',
              height: { xs: 220, sm: 240, md: 250 },
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.45s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, transparent 45%, rgba(15, 23, 42, 0.55) 100%)',
              pointerEvents: 'none',
            }}
          />
          <Chip
            size="small"
            label="Disponible"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(255,255,255,0.92)',
              color: brand.primaryDark,
              fontWeight: 700,
              fontSize: 11,
            }}
          />
          <Typography
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 14,
              color: '#fff',
              fontWeight: 800,
              fontSize: { xs: '1.15rem', sm: '1.25rem' },
              letterSpacing: '-0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.35)',
            }}
          >
            {Number(product.price).toFixed(2)} EUR
          </Typography>
          <Box
            className="product-card-cta"
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              opacity: { xs: 1, md: 0 },
              transform: { xs: 'none', md: 'translateY(8px)' },
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <Chip
              size="small"
              icon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
              label="Voir details"
              sx={{
                bgcolor: brand.primary,
                color: '#fff',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#fff' },
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.4, textAlign: 'left' }}>
          <Typography
            sx={{
              fontSize: '1.08rem',
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.35,
              color: brand.text,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: brand.textMuted,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
              minHeight: 44,
            }}
          >
            {product.description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: brand.primaryMuted,
                color: brand.primaryDark,
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {sellerInitial}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <PersonRoundedIcon sx={{ fontSize: 14, color: brand.textSoft }} />
                <Typography
                  variant="caption"
                  sx={{ color: brand.textSoft, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Vendeur
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 600, color: brand.text, fontSize: 13.5 }}
              >
                {product.sellerName}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
