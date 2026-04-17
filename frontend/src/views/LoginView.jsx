import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'

export const LoginView = () => {
  const { loading, error, authenticate } = useAuthViewModel()
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 4 },
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 4,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Connexion
      </Typography>
      <Stack component="form" spacing={2} onSubmit={(event) => {
        event.preventDefault()
        authenticate('login', form)
      }}>
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
          fullWidth
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" disabled={loading} type="submit" size="large">
          Se connecter
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Pas encore de compte ?{' '}
            <RouterLink to="/register">Inscris-toi</RouterLink>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
