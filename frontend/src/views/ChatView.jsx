import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChatViewModel } from '../viewmodels/useChatViewModel'

const initialFromName = (name) => (name ? name.charAt(0).toUpperCase() : '?')

const formatTime = (iso) => {
  if (!iso) return ''
  const date = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ChatView = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeUserId, setActiveUserId] = useState(() => {
    const fromUrl = Number(searchParams.get('with'))
    return Number.isFinite(fromUrl) && fromUrl > 0 ? fromUrl : null
  })
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)

  const {
    conversations,
    contacts,
    messages,
    loadingMessages,
    sending,
    error,
    sendMessage,
  } = useChatViewModel(activeUserId)

  const activeContact = useMemo(() => {
    const fromConversation = conversations.find((c) => c.userId === activeUserId)
    if (fromConversation) return fromConversation
    const fromContacts = contacts.find((c) => c.id === activeUserId)
    return fromContacts
      ? { userId: fromContacts.id, name: fromContacts.name, email: fromContacts.email }
      : null
  }, [activeUserId, contacts, conversations])

  useEffect(() => {
    if (activeUserId) {
      setSearchParams({ with: String(activeUserId) }, { replace: true })
    }
  }, [activeUserId, setSearchParams])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!draft.trim() || !activeUserId) return
    await sendMessage(activeUserId, draft)
    setDraft('')
  }

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '320px 1fr' } }}>
      <Paper sx={{ p: 1.5, borderRadius: 3, height: { md: '70vh' }, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ px: 1, py: 0.5 }}>
          Messages
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          Demarrer une discussion
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value=""
          onChange={(event) => {
            const id = Number(event.target.value)
            if (id) setActiveUserId(id)
          }}
          sx={{ my: 1 }}
        >
          <MenuItem value="" disabled>
            Choisir un utilisateur
          </MenuItem>
          {contacts.map((contact) => (
            <MenuItem key={contact.id} value={contact.id}>
              {contact.name}
            </MenuItem>
          ))}
        </TextField>

        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          Conversations
        </Typography>
        <List dense>
          {conversations.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              Aucune conversation pour le moment.
            </Typography>
          )}
          {conversations.map((conversation) => (
            <ListItemButton
              key={conversation.userId}
              selected={conversation.userId === activeUserId}
              onClick={() => setActiveUserId(conversation.userId)}
              sx={{ borderRadius: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: 1.2, bgcolor: 'primary.main' }}>
                {initialFromName(conversation.name)}
              </Avatar>
              <ListItemText
                primary={conversation.name}
                secondary={conversation.lastMessage || 'Pas de message'}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 0, borderRadius: 3, display: 'flex', flexDirection: 'column', height: { md: '70vh' } }}>
        {!activeContact ? (
          <Box sx={{ p: 3, m: 'auto', textAlign: 'center' }}>
            <Typography variant="h6">Selectionne une conversation</Typography>
            <Typography color="text.secondary">
              Choisis un contact ou ouvre une discussion existante.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(148,163,184,0.25)', display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{initialFromName(activeContact.name)}</Avatar>
              <Box>
                <Typography fontWeight={700}>{activeContact.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Discussion avec un autre membre BazardShop
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', background: 'linear-gradient(180deg, #f8fafc, #eef2f7)' }}>
              {loadingMessages && messages.length === 0 ? (
                <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Stack spacing={1.2}>
                  {messages.length === 0 && (
                    <Typography color="text.secondary" textAlign="center">
                      Pas encore de message. Lance la conversation !
                    </Typography>
                  )}
                  {messages.map((message) => {
                    const mine = message.senderId === user?.id
                    return (
                      <Box
                        key={message.id}
                        sx={{
                          alignSelf: mine ? 'flex-end' : 'flex-start',
                          maxWidth: { xs: '85%', sm: '70%' },
                          bgcolor: mine ? 'primary.main' : '#fff',
                          color: mine ? '#fff' : 'text.primary',
                          px: 1.6,
                          py: 1,
                          borderRadius: 2,
                          boxShadow: mine
                            ? '0 6px 18px rgba(79,70,229,0.25)'
                            : '0 4px 12px rgba(15,23,42,0.06)',
                        }}
                      >
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.75 }}>
                          {formatTime(message.createdAt)}
                        </Typography>
                      </Box>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </Stack>
              )}
            </Box>

            <Box component="form" onSubmit={handleSend} sx={{ p: 1.5, borderTop: '1px solid rgba(148,163,184,0.25)', display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ecris un message..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={sending}
              />
              <Button type="submit" variant="contained" disabled={sending || !draft.trim()}>
                Envoyer
              </Button>
              <IconButton sx={{ display: { xs: 'none' } }} aria-label="placeholder" />
            </Box>
            {error && (
              <Alert severity="error" sx={{ m: 1.5, mt: 0 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Box>
  )
}
