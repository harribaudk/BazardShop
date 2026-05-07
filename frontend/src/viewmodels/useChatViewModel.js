import { useCallback, useEffect, useState } from 'react'
import { ConversationModel, MessageModel } from '../models/MessageModel'
import { chatService } from '../services/chatService'
import { getSocket } from '../services/socketService'

export const useChatViewModel = (activeUserId) => {
  const [conversations, setConversations] = useState([])
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const refreshConversations = useCallback(async () => {
    try {
      const { data } = await chatService.listConversations()
      setConversations(data.map((item) => new ConversationModel(item)))
    } catch {
      setError('Impossible de charger les conversations.')
    }
  }, [])

  const refreshContacts = useCallback(async () => {
    try {
      const { data } = await chatService.listUsers()
      setContacts(data)
    } catch {
      setContacts([])
    }
  }, [])

  const refreshMessages = useCallback(async (userId) => {
    if (!userId) return
    try {
      const { data } = await chatService.listMessages(userId)
      setMessages(data.map((item) => new MessageModel(item)))
      setError('')
    } catch {
      setError('Impossible de charger les messages.')
    }
  }, [])

  useEffect(() => {
    refreshConversations()
    refreshContacts()
  }, [refreshContacts, refreshConversations])

  useEffect(() => {
    if (!activeUserId) {
      setMessages([])
      return undefined
    }

    setLoadingMessages(true)
    refreshMessages(activeUserId).finally(() => setLoadingMessages(false))
    return undefined
  }, [activeUserId, refreshMessages])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return undefined

    const handleIncoming = (payload) => {
      const isForActive =
        activeUserId &&
        (payload.sender_id === activeUserId || payload.receiver_id === activeUserId)

      if (isForActive) {
        setMessages((previous) => {
          if (previous.some((message) => message.id === payload.id)) {
            return previous
          }
          return [...previous, new MessageModel(payload)]
        })
      }

      refreshConversations()
    }

    socket.on('chat:message', handleIncoming)
    return () => {
      socket.off('chat:message', handleIncoming)
    }
  }, [activeUserId, refreshConversations])

  const sendMessage = async (userId, content) => {
    const trimmed = (content || '').trim()
    if (!trimmed || !userId) return
    setSending(true)
    try {
      await chatService.sendMessage(userId, trimmed)
    } catch {
      setError("L'envoi a echoue.")
    } finally {
      setSending(false)
    }
  }

  return {
    conversations,
    contacts,
    messages,
    loadingMessages,
    sending,
    error,
    sendMessage,
    refreshMessages,
    refreshConversations,
  }
}
