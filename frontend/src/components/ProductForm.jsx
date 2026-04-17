import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

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
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField label="Titre" name="title" value={form.title} onChange={handleChange} required />
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        multiline
        minRows={2}
      />
      <TextField
        label="Prix"
        name="price"
        type="number"
        inputProps={{ min: 0, step: 0.01 }}
        value={form.price}
        onChange={handleChange}
        required
      />
      <Button variant="outlined" component="label">
        Ajouter image/audio/video
        <input
          type="file"
          hidden
          accept="image/*,audio/*,video/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </Button>
      <Button type="submit" variant="contained">
        {submitLabel}
      </Button>
    </Stack>
  )
}
