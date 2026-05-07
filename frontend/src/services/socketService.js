import { io } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const SOCKET_URL = API_BASE_URL.replace('/api', '')

let socket = null

export const connectSocket = (token) => {
  if (!token) return null
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
