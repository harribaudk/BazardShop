import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { brand } from '../theme/tokens'

export const AppNavbar = () => {
  const { token, user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = token
    ? [
        { label: 'Catalogue', to: '/' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Messages', to: '/chat' },
        { label: user?.name || 'Profil', to: '/profile' },
      ]
    : [
        { label: 'Catalogue', to: '/' },
        { label: 'Connexion', to: '/login' },
        { label: 'Inscription', to: '/register' },
      ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const navButtonSx = (active) => ({
    color: active ? '#fff' : 'rgba(255,255,255,0.78)',
    fontWeight: active ? 700 : 500,
    borderRadius: `${brand.radius.sm}px`,
    px: 1.6,
    py: 0.8,
    background: active ? 'rgba(13, 148, 136, 0.35)' : 'transparent',
    '&:hover': {
      color: '#fff',
      background: active ? 'rgba(13, 148, 136, 0.45)' : 'rgba(255,255,255,0.08)',
    },
  })

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ py: { xs: 0.4, sm: 0.8 }, px: { xs: 1.5, sm: 2.5 }, gap: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', minWidth: 0 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              background: brand.gradients.primary,
              boxShadow: brand.shadows.primary,
              flexShrink: 0,
            }}
          >
            <StorefrontRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.05rem', sm: '1.15rem' },
            }}
          >
            BazardShop
          </Typography>
        </Stack>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.6, alignItems: 'center' }}>
          {links.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              sx={navButtonSx(isActive(link.to))}
            >
              {link.label}
            </Button>
          ))}
          {!token && (
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                ml: 1,
                background: brand.gradients.primary,
                boxShadow: brand.shadows.primary,
                '&:hover': { background: brand.gradients.primaryHover },
              }}
            >
              Commencer
            </Button>
          )}
        </Box>

        <IconButton
          color="inherit"
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            bgcolor: 'rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
          }}
          onClick={() => setOpen(true)}
          aria-label="Menu"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: { xs: 280, sm: 300 }, pt: 2 }}>
            <Typography
              sx={{
                px: 2.5,
                pb: 2,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Navigation
            </Typography>
            <List>
              {links.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={Link}
                  to={link.to}
                  selected={isActive(link.to)}
                  onClick={() => setOpen(false)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.4,
                    '&.Mui-selected': {
                      bgcolor: brand.primaryMuted,
                      color: brand.primaryDark,
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}
