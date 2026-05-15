import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AppNavbar = () => {
  const { token, user } = useAuth()
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

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ py: { xs: 0.2, sm: 0.6 }, px: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.01em' }}>
          BazardShop
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {links.map((link) => (
            <Button key={link.to} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
        </Box>
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'inline-flex', md: 'none' }, fontSize: 14, px: 1.2 }}
          onClick={() => setOpen(true)}
        >
          Menu
        </IconButton>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: { xs: 240, sm: 280 } }}>
            <List>
              {links.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={() => setOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}
