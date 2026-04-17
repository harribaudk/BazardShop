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
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AppNavbar = () => {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = () => {
    logout()
    navigate('/')
  }

  const links = token
    ? [
        { label: 'Catalogue', to: '/' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: user?.name || 'Profil', to: '/profile' },
      ]
    : [
        { label: 'Catalogue', to: '/' },
        { label: 'Connexion', to: '/login' },
        { label: 'Inscription', to: '/register' },
      ]

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BazardShop
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {links.map((link) => (
            <Button key={link.to} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
          {token && (
            <Button color="inherit" onClick={onLogout}>
              Deconnexion
            </Button>
          )}
        </Box>
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={() => setOpen(true)}
        >
          Menu
        </IconButton>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 260 }}>
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
              {token && (
                <ListItemButton
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                >
                  <ListItemText primary="Deconnexion" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}
