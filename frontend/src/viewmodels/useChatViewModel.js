import { useCallback, useEffect, useRef, useState } from 'react'
import { ConversationModel, MessageModel } from '../models/MessageModel'
import { chatService } from '../services/chatService'

const POLL_INTERVAL_MS = 4000

export const useChatViewModel = (activeUserId) => {
  const [conversations, setConversations] = useState([])
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const pollRef = useRef(null)

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

    pollRef.current = setInterval(() => {
      refreshMessages(activeUserId)
    }, POLL_INTERVAL_MS)

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [activeUserId, refreshMessages])

  const sendMessage = async (userId, content) => {
    const trimmed = (content || '').trim()
    if (!trimmed || !userId) return
    setSending(true)
    try {
      await chatService.sendMessage(userId, trimmed)
      await refreshMessages(userId)
      await refreshConversations()
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
