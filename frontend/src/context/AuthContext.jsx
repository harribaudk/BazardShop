import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../services/apiClient'
import { authService } from '../services/authService'
import { connectSocket, disconnectSocket } from '../services/socketService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAuthToken(token)
    if (!token) {
      setUser(null)
      setLoading(false)
      disconnectSocket()
      return undefined
    }

    connectSocket(token)

    authService
      .me()
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setLoading(false))

    return () => {
      disconnectSocket()
    }
  }, [token])

  const login = (newToken, nextUser = null) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    if (nextUser) {
      setUser(nextUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ token, user, loading, setUser, login, logout }),
    [loading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider')
  }
  return context
}
