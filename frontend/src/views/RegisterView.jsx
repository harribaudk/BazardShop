import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'

export const RegisterView = () => {
  const { loading, error, authenticate } = useAuthViewModel()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Inscription
      </Typography>
      <Stack component="form" spacing={2} onSubmit={(event) => {
        event.preventDefault()
        authenticate('register', form)
      }}>
        <TextField
          label="Nom"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
          fullWidth
        />
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
          Creer mon compte
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Deja un compte ? <RouterLink to="/login">Connecte-toi</RouterLink>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
