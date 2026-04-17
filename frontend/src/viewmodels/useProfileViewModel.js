import { useState } from 'react'
import { authService } from '../services/authService'
import { uploadService } from '../services/uploadService'
import { useAuth } from '../context/AuthContext'

export const useProfileViewModel = () => {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateProfile = async (payload, file) => {
    setLoading(true)
    setMessage('')
    try {
      let avatarUrl = payload.avatar_url || user?.avatar_url || ''
      if (file) {
        const uploadResponse = await uploadService.uploadFile(file)
        avatarUrl = uploadResponse.data.fileUrl
      }
      await authService.updateProfile({ ...payload, avatar_url: avatarUrl })
      const me = await authService.me()
      setUser(me.data)
      setMessage('Profil mis a jour avec succes.')
    } catch {
      setMessage("Echec de mise a jour du profil.")
    } finally {
      setLoading(false)
    }
  }

  return { loading, message, updateProfile }
}
