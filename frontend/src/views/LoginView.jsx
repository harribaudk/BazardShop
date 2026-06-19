import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'
import { brand } from '../theme/tokens'

export const LoginView = () => {
  const { loading, error, authenticate } = useAuthViewModel()
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accedez a votre espace vendeur et a la messagerie."
    >
      <Stack
        component="form"
        spacing={2.2}
        onSubmit={(event) => {
          event.preventDefault()
          authenticate('login', form)
        }}
      >
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
        <Button variant="contained" disabled={loading} type="submit" size="large" fullWidth>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: brand.textMuted }}>
            Pas encore de compte ?{' '}
            <Typography
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ color: brand.primary, fontWeight: 700 }}
            >
              Inscris-toi
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </AuthLayout>
  )
}
