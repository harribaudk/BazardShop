import { Alert, Avatar, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { getFileUrl } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'
import { useProfileViewModel } from '../viewmodels/useProfileViewModel'

export const ProfileView = () => {
  const { user } = useAuth()
  const { loading, message, updateProfile } = useProfileViewModel()
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [file, setFile] = useState(null)

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 620, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mon profil
      </Typography>
      <Stack component="form" spacing={2} onSubmit={(event) => {
        event.preventDefault()
        updateProfile({ name, bio }, file)
      }}>
        <Avatar
          src={user?.avatar_url ? getFileUrl(user.avatar_url) : undefined}
          sx={{ width: 72, height: 72 }}
        />
        <TextField label="Nom" value={name} onChange={(event) => setName(event.target.value)} required />
        <TextField
          label="Bio"
          multiline
          minRows={3}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
        <Button variant="outlined" component="label" fullWidth>
          Changer avatar
          <input type="file" hidden accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </Button>
        <Button variant="contained" disabled={loading} type="submit" size="large" fullWidth>
          Sauvegarder
        </Button>
        {message && <Alert severity={message.includes('succes') ? 'success' : 'error'}>{message}</Alert>}
      </Stack>
    </Paper>
  )
}
