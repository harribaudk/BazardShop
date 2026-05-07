import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChatViewModel } from '../viewmodels/useChatViewModel'

const initialFromName = (name) => (name ? name.charAt(0).toUpperCase() : '?')

const palette = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
const colorFromId = (id) => palette[Math.abs(Number(id) || 0) % palette.length]

const formatHour = (iso) => {
  if (!iso) return ''
  const date = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatDayLabel = (iso) => {
  if (!iso) return ''
  const date = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  if (sameDay(date, today)) return "Aujourd'hui"
  if (sameDay(date, yesterday)) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatRelative = (iso) => {
  if (!iso) return ''
  const date = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "a l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export const ChatView = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeUserId, setActiveUserId] = useState(() => {
    const fromUrl = Number(searchParams.get('with'))
    return Number.isFinite(fromUrl) && fromUrl > 0 ? fromUrl : null
  })
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
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

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return conversations
    return conversations.filter((conversation) => conversation.name.toLowerCase().includes(term))
  }, [conversations, search])

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

  const showSidebar = !isMobile || !activeUserId
  const showConversation = !isMobile || activeUserId

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
        height: { xs: 'calc(100vh - 140px)', md: '78vh' },
      }}
    >
      {showSidebar && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, pb: 1.2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
              <Typography variant="h6" fontWeight={700}>
                Messages
              </Typography>
              <Chip size="small" label={`${conversations.length} discussion${conversations.length > 1 ? 's' : ''}`} />
            </Stack>
            <TextField
              size="small"
              fullWidth
              placeholder="Rechercher une conversation"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      component="span"
                      sx={{ fontSize: 18, color: 'text.secondary' }}
                      aria-hidden
                    >
                      ⌕
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              select
              size="small"
              fullWidth
              value=""
              onChange={(event) => {
                const id = Number(event.target.value)
                if (id) setActiveUserId(id)
              }}
              sx={{ mt: 1.2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="" disabled>
                Demarrer avec un utilisateur
              </MenuItem>
              {contacts.map((contact) => (
                <MenuItem key={contact.id} value={contact.id}>
                  {contact.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 0.5 }}>
            <List dense disablePadding>
              {filteredConversations.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {conversations.length === 0
                      ? 'Aucune conversation. Selectionne un utilisateur pour commencer.'
                      : 'Aucun resultat.'}
                  </Typography>
                </Box>
              )}
              {filteredConversations.map((conversation) => {
                const selected = conversation.userId === activeUserId
                return (
                  <ListItemButton
                    key={conversation.userId}
                    selected={selected}
                    onClick={() => setActiveUserId(conversation.userId)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      px: 1.2,
                      py: 1.1,
                      transition: 'background 0.2s ease',
                      '&.Mui-selected': {
                        background: 'rgba(79,70,229,0.08)',
                      },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color="success"
                      sx={{ mr: 1.4 }}
                    >
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: colorFromId(conversation.userId),
                          fontWeight: 700,
                        }}
                      >
                        {initialFromName(conversation.name)}
                      </Avatar>
                    </Badge>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Typography fontWeight={selected ? 700 : 600} noWrap>
                            {conversation.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelative(conversation.lastMessageAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {conversation.lastMessage || 'Aucun message'}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </Box>
        </Paper>
      )}

      {showConversation && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {!activeContact ? (
            <Box sx={{ m: 'auto', p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(14,165,233,0.15))',
                  fontSize: 30,
                }}
                aria-hidden
              >
                ✉
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Bienvenue dans la messagerie
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Selectionne une conversation existante ou demarre-en une nouvelle.
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  px: { xs: 1.5, sm: 2.2 },
                  py: 1.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.4,
                  background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
                  borderBottom: '1px solid rgba(148,163,184,0.25)',
                }}
              >
                {isMobile && (
                  <IconButton size="small" onClick={() => setActiveUserId(null)} aria-label="Retour">
                    ←
                  </IconButton>
                )}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color="success"
                >
                  <Avatar
                    sx={{
                      bgcolor: colorFromId(activeContact.userId),
                      fontWeight: 700,
                    }}
                  >
                    {initialFromName(activeContact.name)}
                  </Avatar>
                </Badge>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography fontWeight={700} noWrap>
                    {activeContact.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    En ligne sur BazardShop
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  px: { xs: 1.4, sm: 2.4 },
                  py: 2,
                  overflowY: 'auto',
                  background:
                    'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
                }}
              >
                {loadingMessages && messages.length === 0 ? (
                  <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Stack spacing={1.2}>
                    {messages.length === 0 && (
                      <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                        Aucun message pour le moment. Lance la conversation !
                      </Typography>
                    )}
                    {messages.map((message, index) => {
                      const mine = message.senderId === user?.id
                      const previous = messages[index - 1]
                      const showDayDivider =
                        !previous ||
                        formatDayLabel(previous.createdAt) !== formatDayLabel(message.createdAt)
                      return (
                        <Box key={message.id}>
                          {showDayDivider && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.4 }}>
                              <Chip
                                size="small"
                                label={formatDayLabel(message.createdAt)}
                                sx={{ background: 'rgba(15,23,42,0.06)', color: 'text.secondary' }}
                              />
                            </Box>
                          )}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: mine ? 'flex-end' : 'flex-start',
                              alignItems: 'flex-end',
                              gap: 1,
                            }}
                          >
                            {!mine && (
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  bgcolor: colorFromId(message.senderId),
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {initialFromName(activeContact.name)}
                              </Avatar>
                            )}
                            <Box
                              sx={{
                                maxWidth: { xs: '82%', sm: '70%' },
                                px: 1.7,
                                py: 1.05,
                                borderRadius: mine
                                  ? '18px 18px 4px 18px'
                                  : '18px 18px 18px 4px',
                                background: mine
                                  ? 'linear-gradient(135deg, #4f46e5, #6366f1)'
                                  : '#ffffff',
                                color: mine ? '#fff' : 'text.primary',
                                boxShadow: mine
                                  ? '0 8px 22px rgba(79,70,229,0.28)'
                                  : '0 4px 14px rgba(15,23,42,0.06)',
                              }}
                            >
                              <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                                {message.content}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  textAlign: 'right',
                                  opacity: mine ? 0.85 : 0.6,
                                }}
                              >
                                {formatHour(message.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </Stack>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mx: 1.5, mb: 1 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSend}
                sx={{
                  p: 1.4,
                  borderTop: '1px solid rgba(148,163,184,0.25)',
                  display: 'flex',
                  gap: 1,
                  background: '#fff',
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ecris un message..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={sending}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 999,
                      background: '#f8fafc',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={sending || !draft.trim()}
                  sx={{ borderRadius: 999, px: 2.4 }}
                >
                  Envoyer
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  )
}
