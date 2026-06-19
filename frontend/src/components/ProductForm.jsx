import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import { Button, Chip, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { brand } from '../theme/tokens'

const initialValues = {
  title: '',
  description: '',
  price: '',
  image_url: '',
}

export const ProductForm = ({ initialProduct, onSubmit, submitLabel }) => {
  const [form, setForm] = useState(initialProduct || initialValues)
  const [file, setFile] = useState(null)

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit(form, file)
    if (!initialProduct) {
      setForm(initialValues)
      setFile(null)
    }
  }

  return (
    <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
      <TextField
        label="Titre"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Prix (EUR)"
        name="price"
        type="number"
        inputProps={{ min: 0, step: 0.01 }}
        value={form.price}
        onChange={handleChange}
        required
        fullWidth
      />
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={<AddPhotoAlternateRoundedIcon />}
        sx={{
          py: 1.4,
          borderStyle: 'dashed',
          borderColor: brand.border,
          color: brand.textMuted,
          '&:hover': {
            borderColor: brand.primary,
            bgcolor: brand.primaryMuted,
            color: brand.primaryDark,
          },
        }}
      >
        Ajouter image / audio / video
        <input
          type="file"
          hidden
          accept="image/*,audio/*,video/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </Button>
      {file && (
        <Chip
          size="small"
          label={file.name}
          onDelete={() => setFile(null)}
          sx={{ alignSelf: 'flex-start', maxWidth: '100%' }}
        />
      )}
      <Button type="submit" variant="contained" size="large" fullWidth>
        {submitLabel}
      </Button>
    </Stack>
  )
}
