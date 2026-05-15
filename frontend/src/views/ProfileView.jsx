import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFileUrl } from '../services/apiClient'
import { chatService } from '../services/chatService'
import { productService } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useProfileViewModel } from '../viewmodels/useProfileViewModel'

const MAX_BIO_LENGTH = 280

const initialFromName = (name) => (name ? name.charAt(0).toUpperCase() : 'U')

const parseCreatedAt = (value) => {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  let normalized = String(value).trim()
  if (normalized.includes(' ') && !normalized.includes('T')) {
    normalized = normalized.replace(' ', 'T')
  }
  if (!/[Zz]|[+-]\d{2}:?\d{2}$/.test(normalized)) {
    normalized = `${normalized}Z`
  }
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatMemberSince = (iso) => {
  const date = parseCreatedAt(iso) || new Date()
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const monthsSince = (iso) => {
  const date = parseCreatedAt(iso)
  if (!date) return 0
  return Math.max(
    0,
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
}

const StatCard = ({ icon, label, value, accent }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.4,
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      gap: 1.8,
      border: '1px solid rgba(148, 163, 184, 0.18)',
      background: '#fff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
      },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        background: accent,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          color: '#0f172a',
          mt: 0.6,
          lineHeight: 1.2,
        }}
        noWrap
      >
        {value}
      </Typography>
    </Box>
  </Paper>
)

const SectionTitle = ({ icon, title, subtitle }) => (
  <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: 2.4 }}>
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        color: 'primary.main',
        background: 'rgba(79, 70, 229, 0.1)',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Stack>
)

export const ProfileView = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { loading, message, updateProfile } = useProfileViewModel()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [copied, setCopied] = useState(false)
  const [productsCount, setProductsCount] = useState(0)
  const [conversationsCount, setConversationsCount] = useState(0)

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setBio(user.bio || '')
    setFile(null)
    setPreview(null)
  }, [user])

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    let active = true
    Promise.all([
      productService.list().catch(() => ({ data: [] })),
      chatService.listConversations().catch(() => ({ data: [] })),
    ]).then(([products, conversations]) => {
      if (!active) return
      const myProducts = (products.data || []).filter(
        (item) => item.created_by === user?.id
      )
      setProductsCount(myProducts.length)
      setConversationsCount((conversations.data || []).length)
    })
    return () => {
      active = false
    }
  }, [user?.id])

  const memberSinceLabel = useMemo(
    () => formatMemberSince(user?.created_at),
    [user?.created_at]
  )

  const memberSinceMonths = useMemo(
    () => Math.floor(monthsSince(user?.created_at)),
    [user?.created_at]
  )

  const dirty = useMemo(() => {
    return (
      name !== (user?.name || '') ||
      bio !== (user?.bio || '') ||
      Boolean(file)
    )
  }, [name, bio, file, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    await updateProfile({ name: name.trim(), bio: bio.trim() }, file)
    setFile(null)
  }

  const handleReset = () => {
    setName(user?.name || '')
    setBio(user?.bio || '')
    setFile(null)
  }

  const handleCopyEmail = async () => {
    if (!user?.email) return
    try {
      await navigator.clipboard.writeText(user.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const avatarSrc = preview || (user?.avatar_url ? getFileUrl(user.avatar_url) : undefined)
  const isSeller = productsCount > 0
  const successMessage = message && message.includes('succes')
  const errorMessage = message && !successMessage

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          mb: 3,
          border: '1px solid rgba(148, 163, 184, 0.18)',
          background:
            'linear-gradient(135deg, #312e81 0%, #4f46e5 45%, #0ea5e9 100%)',
          color: '#fff',
          p: { xs: 3, sm: 4 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            filter: 'blur(8px)',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: -90,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'rgba(14, 165, 233, 0.28)',
            filter: 'blur(10px)',
          }}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2.4, sm: 3.4 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ position: 'relative' }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: { xs: 96, sm: 116 },
                height: { xs: 96, sm: 116 },
                fontSize: 38,
                fontWeight: 700,
                bgcolor: '#fff',
                color: 'primary.main',
                border: '4px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.25)',
              }}
            >
              {initialFromName(user?.name)}
            </Avatar>
            {isSeller && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -6,
                  right: -6,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#22c55e',
                  color: '#fff',
                  border: '3px solid #fff',
                  boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                }}
                aria-hidden
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 1 }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                {user?.name || 'Mon profil'}
              </Typography>
              {isSeller && (
                <Chip
                  size="small"
                  icon={<StorefrontRoundedIcon sx={{ fontSize: 16 }} />}
                  label="Vendeur verifie"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
              )}
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2.4 }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ color: 'rgba(255, 255, 255, 0.88)' }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <AlternateEmailRoundedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 14.5 }}>{user?.email}</Typography>
                <Tooltip title={copied ? 'Copie !' : "Copier l'email"} arrow>
                  <IconButton
                    size="small"
                    onClick={handleCopyEmail}
                    sx={{
                      color: '#fff',
                      opacity: 0.85,
                      '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.12)' },
                    }}
                  >
                    <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 14.5 }}>
                  Membre depuis {memberSinceLabel}
                </Typography>
              </Stack>
            </Stack>
            {user?.bio && (
              <Typography
                sx={{
                  mt: 1.6,
                  fontSize: 14.5,
                  color: 'rgba(255, 255, 255, 0.88)',
                  maxWidth: 620,
                  lineHeight: 1.55,
                }}
              >
                {user.bio}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gap: 2.4,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          mb: 3,
        }}
      >
        <StatCard
          icon={<StorefrontRoundedIcon />}
          label="Annonces publiees"
          value={productsCount}
          accent="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
        />
        <StatCard
          icon={<ChatBubbleRoundedIcon />}
          label="Conversations"
          value={conversationsCount}
          accent="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
        />
        <StatCard
          icon={<CalendarMonthRoundedIcon />}
          label="Membre depuis"
          value={
            memberSinceMonths >= 12
              ? `${Math.floor(memberSinceMonths / 12)} an${
                  memberSinceMonths >= 24 ? 's' : ''
                }`
              : memberSinceMonths >= 1
              ? `${memberSinceMonths} mois`
              : memberSinceLabel
          }
          accent="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
        />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'grid',
          gap: 2.4,
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.4, sm: 3 },
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <SectionTitle
            icon={<PhotoCameraRoundedIcon fontSize="small" />}
            title="Photo de profil"
          />
          <Box sx={{ position: 'relative', mb: 2.4 }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: 132,
                height: 132,
                fontSize: 42,
                fontWeight: 700,
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                color: 'primary.main',
              }}
            >
              {initialFromName(user?.name)}
            </Avatar>
            <Tooltip title="Changer la photo" arrow>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  border: '3px solid #fff',
                  boxShadow: '0 6px 18px rgba(79, 70, 229, 0.45)',
                  '&:hover': { bgcolor: '#4338ca' },
                }}
              >
                <PhotoCameraRoundedIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: '#64748b', mb: 1.6, maxWidth: 240 }}
          >
            Choisissez une image carree, idealement 400x400px et inferieure a 2 Mo.
          </Typography>
          {file && (
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={file.name}
              sx={{ maxWidth: '100%' }}
            />
          )}
          <Divider flexItem sx={{ my: 2.4 }} />
          <Stack spacing={1.2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRoundedIcon
                sx={{ color: '#0ea5e9', fontSize: 18 }}
              />
              <Typography sx={{ fontSize: 13, color: '#475569' }}>
                Inscrit le {memberSinceLabel}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.4, sm: 3 },
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: '#fff',
          }}
        >
          <SectionTitle
            icon={<PersonRoundedIcon fontSize="small" />}
            title="Informations personnelles"
            subtitle="Ces informations sont visibles par les autres utilisateurs."
          />

          <Stack spacing={2.2}>
            <TextField
              label="Nom complet"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Adresse email"
              value={user?.email || ''}
              fullWidth
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailRoundedIcon
                      fontSize="small"
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copied ? 'Copie !' : 'Copier'} arrow>
                      <IconButton size="small" onClick={handleCopyEmail}>
                        <ContentCopyRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              helperText="L'email de connexion ne peut pas etre modifie."
            />
            <Box>
              <TextField
                label="Bio"
                value={bio}
                onChange={(event) => {
                  if (event.target.value.length <= MAX_BIO_LENGTH) {
                    setBio(event.target.value)
                  }
                }}
                multiline
                minRows={4}
                fullWidth
                placeholder="Presentez-vous en quelques mots, parlez de vos articles preferes, etc."
                inputProps={{ maxLength: MAX_BIO_LENGTH }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 0.8 }}
              >
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Markdown non supporte
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      bio.length > MAX_BIO_LENGTH * 0.85
                        ? 'warning.main'
                        : '#64748b',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {bio.length}/{MAX_BIO_LENGTH}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (bio.length / MAX_BIO_LENGTH) * 100)}
                sx={{
                  mt: 0.6,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(148, 163, 184, 0.18)',
                  '& .MuiLinearProgress-bar': {
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  },
                }}
              />
            </Box>
          </Stack>

          {message && (
            <Alert
              severity={successMessage ? 'success' : 'error'}
              sx={{ mt: 2.4, borderRadius: '12px' }}
            >
              {message}
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1.4}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ color: '#64748b' }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: dirty ? '#f59e0b' : '#22c55e',
                  boxShadow: dirty
                    ? '0 0 0 3px rgba(245, 158, 11, 0.22)'
                    : '0 0 0 3px rgba(34, 197, 94, 0.22)',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {dirty ? 'Modifications non enregistrees' : 'Tout est a jour'}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: 'column-reverse', sm: 'row' }}
              spacing={1.4}
              alignItems="stretch"
            >
              <Button
                variant="outlined"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleReset}
                disabled={!dirty || loading}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 2.6,
                  py: 1.1,
                  fontWeight: 600,
                  color: '#334155',
                  borderColor: 'rgba(148, 163, 184, 0.6)',
                  bgcolor: '#fff',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    borderColor: '#334155',
                    color: '#0f172a',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#f8fafc',
                    borderColor: 'rgba(148, 163, 184, 0.35)',
                    color: '#94a3b8',
                  },
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                startIcon={
                  loading ? (
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                  ) : (
                    <SaveRoundedIcon />
                  )
                }
                disabled={!dirty || loading || !name.trim()}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                  py: 1.1,
                  fontWeight: 700,
                  color: '#fff',
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 10px 22px rgba(79, 70, 229, 0.32)',
                  transition:
                    'transform 0.18s ease, box-shadow 0.2s ease, background 0.2s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    boxShadow: '0 14px 28px rgba(79, 70, 229, 0.42)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': {
                    color: '#fff',
                    background:
                      'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
                    boxShadow: 'none',
                    opacity: 0.85,
                  },
                }}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 2.4,
          p: { xs: 2.4, sm: 3 },
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.22)',
          background: 'linear-gradient(180deg, #fff 0%, #fef2f2 100%)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              Deconnexion
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.4 }}>
              Vous serez redirige vers l&apos;accueil et devrez vous reconnecter pour acceder a
              votre compte.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            fullWidth={isMobile}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 2.8,
              py: 1.1,
              fontWeight: 600,
              flexShrink: 0,
              borderColor: 'rgba(239, 68, 68, 0.5)',
              '&:hover': {
                borderColor: '#ef4444',
                bgcolor: 'rgba(239, 68, 68, 0.06)',
              },
            }}
          >
            Se deconnecter
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
