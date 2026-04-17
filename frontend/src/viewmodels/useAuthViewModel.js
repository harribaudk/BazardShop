import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export const useAuthViewModel = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authenticate = async (mode, payload) => {
    setLoading(true)
    setError('')
    try {
      const response =
        mode === 'register'
          ? await authService.register(payload)
          : await authService.login(payload)
      login(response.data.token, response.data.user)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, authenticate }
}
