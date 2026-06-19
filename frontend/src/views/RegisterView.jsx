import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'
import { brand } from '../theme/tokens'

export const RegisterView = () => {
  const { loading, error, authenticate } = useAuthViewModel()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  return (
    <AuthLayout
      title="Inscription"
      subtitle="Creez votre compte et commencez a vendre en quelques minutes."
    >
      <Stack
        component="form"
        spacing={2.2}
        onSubmit={(event) => {
          event.preventDefault()
          authenticate('register', form)
        }}
      >
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
          helperText="Minimum 6 caracteres"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" disabled={loading} type="submit" size="large" fullWidth>
          {loading ? 'Creation...' : 'Creer mon compte'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: brand.textMuted }}>
            Deja un compte ?{' '}
            <Typography
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ color: brand.primary, fontWeight: 700 }}
            >
              Connecte-toi
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </AuthLayout>
  )
}
