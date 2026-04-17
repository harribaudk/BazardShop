import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export const getFileUrl = (relativeUrl) => {
  if (!relativeUrl) return ''
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl
  }
  const host = API_BASE_URL.replace('/api', '')
  return `${host}${relativeUrl}`
}
