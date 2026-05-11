import {
  Alert,
  Avatar,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChatViewModel } from '../viewmodels/useChatViewModel'

const initialFromName = (name) => (name ? name.charAt(0).toUpperCase() : '?')

const AVATAR_PALETTE = [
  '#6366f1',
  '#0ea5e9',
  '#14b8a6',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#ec4899',
  '#22c55e',
]
const colorFromId = (id) =>
  AVATAR_PALETTE[Math.abs(Number(id) || 0) % AVATAR_PALETTE.length]

const parseDate = (iso) => (iso ? new Date(iso.endsWith('Z') ? iso : `${iso}Z`) : null)

const formatHour = (iso) => {
  const date = parseDate(iso)
  if (!date) return ''
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const sameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const formatDayLabel = (iso) => {
  const date = parseDate(iso)
  if (!date) return ''
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (sameDay(date, today)) return "Aujourd'hui"
  if (sameDay(date, yesterday)) return 'Hier'
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const formatRelative = (iso) => {
  const date = parseDate(iso)
  if (!date) return ''
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'maintenant'
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} j`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

const Bubble = ({ message, mine, grouped, showTime }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: mine ? 'flex-end' : 'flex-start',
      mt: grouped ? 0.3 : 0.9,
    }}
  >
    <Box
      sx={{
        position: 'relative',
        maxWidth: { xs: '85%', sm: '70%', md: '62%' },
        px: 1.7,
        py: 1.1,
        bgcolor: mine ? '#4f46e5' : '#ffffff',
        color: mine ? '#fff' : '#0f172a',
        borderRadius: mine
          ? grouped
            ? '20px 6px 6px 20px'
            : '20px 6px 20px 20px'
          : grouped
          ? '6px 20px 20px 6px'
          : '6px 20px 20px 20px',
        boxShadow: mine
          ? '0 8px 22px rgba(79, 70, 229, 0.28)'
          : '0 4px 14px rgba(15, 23, 42, 0.06)',
        border: mine ? 'none' : '1px solid rgba(148, 163, 184, 0.16)',
        animation: 'bubbleIn 0.22s ease both',
        wordBreak: 'break-word',
      }}
    >
      <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 14.5 }}>
        {message.content}
      </Typography>
      {showTime && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          sx={{ mt: 0.4 }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: mine ? 'rgba(255,255,255,0.78)' : '#94a3b8',
            }}
          >
            {formatHour(message.createdAt)}
          </Typography>
          {mine && (
            <DoneAllRoundedIcon
              sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}
              aria-hidden
            />
          )}
        </Stack>
      )}
    </Box>
  </Box>
)

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
  const [tab, setTab] = useState('all')
  const [newAnchorEl, setNewAnchorEl] = useState(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

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
    let list = conversations
    if (term) {
      list = list.filter((conversation) =>
        conversation.name.toLowerCase().includes(term)
      )
    }
    return list
  }, [conversations, search])

  const availableContacts = useMemo(() => {
    const term = search.trim().toLowerCase()
    const ids = new Set(conversations.map((c) => c.userId))
    return contacts
      .filter((contact) => !ids.has(contact.id))
      .filter((contact) => (term ? contact.name.toLowerCase().includes(term) : true))
  }, [contacts, conversations, search])

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend(event)
    }
  }

  const handleStartConversation = (contactId) => {
    setNewAnchorEl(null)
    setActiveUserId(contactId)
  }

  const showSidebar = !isMobile || !activeUserId
  const showConversation = !isMobile || activeUserId

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
        height: { xs: 'calc(100vh - 140px)', md: 'calc(100vh - 160px)' },
        minHeight: 540,
        '@keyframes bubbleIn': {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes pulseDot': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      }}
    >
      {showSidebar && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: '#ffffff',
          }}
        >
          <Box sx={{ p: 2.2, pb: 1.4 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1.2}
              sx={{ mb: 1.8 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.4}
                sx={{ minWidth: 0, flexGrow: 1 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 10px 22px rgba(79, 70, 229, 0.35)',
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  <ChatBubbleRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      color: '#0f172a',
                    }}
                  >
                    Messagerie
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.8}
                    sx={{ mt: 0.5, lineHeight: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#22c55e',
                        boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.18)',
                        animation: 'pulseDot 1.8s ease-in-out infinite',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: 12,
                        lineHeight: 1,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {conversations.length} discussion
                      {conversations.length > 1 ? 's actives' : ' active'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Tooltip title="Nouvelle conversation" arrow>
                <IconButton
                  onClick={(event) => setNewAnchorEl(event.currentTarget)}
                  sx={{
                    width: 40,
                    height: 40,
                    ml: 'auto',
                    flexShrink: 0,
                    borderRadius: 2,
                    color: 'primary.main',
                    background: 'rgba(79, 70, 229, 0.08)',
                    border: '1px solid rgba(79, 70, 229, 0.16)',
                    transition: 'transform 0.18s ease, box-shadow 0.2s ease, background 0.2s ease',
                    '&:hover': {
                      background: 'rgba(79, 70, 229, 0.16)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 18px rgba(79, 70, 229, 0.22)',
                    },
                  }}
                >
                  <AddCommentRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={newAnchorEl}
                open={Boolean(newAnchorEl)}
                onClose={() => setNewAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 260,
                    borderRadius: 2,
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
                  },
                }}
              >
                {availableContacts.length === 0 && (
                  <MenuItem disabled>Aucun contact disponible</MenuItem>
                )}
                {availableContacts.map((contact) => (
                  <MenuItem
                    key={contact.id}
                    onClick={() => handleStartConversation(contact.id)}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1.2,
                        bgcolor: colorFromId(contact.id),
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {initialFromName(contact.name)}
                    </Avatar>
                    <Box>
                      <Typography fontSize={14} fontWeight={600}>
                        {contact.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.6,
                py: 0.6,
                borderRadius: 999,
                bgcolor: '#f1f5f9',
                border: '1px solid transparent',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                '&:focus-within': {
                  borderColor: 'rgba(79,70,229,0.5)',
                  bgcolor: '#fff',
                },
              }}
            >
              <SearchRoundedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
              <InputBase
                fullWidth
                placeholder="Rechercher"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{ fontSize: 14 }}
              />
            </Paper>

            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="fullWidth"
              sx={{
                mt: 1.6,
                minHeight: 44,
                borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                },
                '& .MuiTab-root': {
                  minHeight: 44,
                  py: 1.1,
                  px: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 13.5,
                  lineHeight: 1.4,
                  color: '#64748b',
                  '&.Mui-selected': { color: 'primary.main' },
                },
              }}
            >
              <Tab label="Toutes" value="all" />
              <Tab label="Recents" value="recent" />
            </Tabs>
          </Box>

          <Divider />

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              px: 1,
              py: 0.8,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(148,163,184,0.4)',
                borderRadius: 4,
              },
            }}
          >
            <List dense disablePadding>
              {filteredConversations.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {conversations.length === 0
                      ? 'Aucune conversation. Clique sur + pour en demarrer une.'
                      : 'Aucun resultat pour cette recherche.'}
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
                      position: 'relative',
                      borderRadius: 2,
                      mb: 0.4,
                      px: 1.4,
                      py: 1.2,
                      gap: 1.4,
                      alignItems: 'center',
                      transition: 'background 0.2s ease',
                      '&.Mui-selected': {
                        background: 'rgba(79, 70, 229, 0.06)',
                        '&:hover': { background: 'rgba(79, 70, 229, 0.09)' },
                      },
                      '&::before': selected
                        ? {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 8,
                            bottom: 8,
                            width: 3,
                            borderRadius: 2,
                            background: 'linear-gradient(180deg, #6366f1, #4f46e5)',
                          }
                        : undefined,
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: '#22c55e',
                            border: '2px solid #fff',
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: colorFromId(conversation.userId),
                          fontWeight: 700,
                        }}
                      >
                        {initialFromName(conversation.name)}
                      </Avatar>
                    </Badge>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography
                          fontSize={14.5}
                          fontWeight={selected ? 700 : 600}
                          noWrap
                          sx={{ color: '#0f172a' }}
                        >
                          {conversation.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: '#94a3b8', whiteSpace: 'nowrap' }}
                        >
                          {formatRelative(conversation.lastMessageAt)}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: '#64748b', fontSize: 13, mt: 0.1 }}
                      >
                        {conversation.lastMessage || 'Demarrez la conversation'}
                      </Typography>
                    </Box>
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
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: '#ffffff',
          }}
        >
          {!activeContact ? (
            <Box
              sx={{
                m: 'auto',
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                maxWidth: 460,
              }}
            >
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  mx: 'auto',
                  mb: 2.5,
                  borderRadius: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  background:
                    'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(14,165,233,0.18) 100%)',
                  boxShadow: '0 18px 40px rgba(79,70,229,0.18)',
                }}
                aria-hidden
              >
                <AddCommentRoundedIcon sx={{ fontSize: 48, color: '#4f46e5' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 0.6, letterSpacing: '-0.01em' }}
              >
                Bienvenue dans la messagerie
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                Echange en direct avec les vendeurs et acheteurs de BazardShop.
                Selectionne une conversation a gauche, ou demarres-en une nouvelle.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ flexWrap: 'wrap' }}
                useFlexGap
              >
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label="Temps reel"
                />
                <Chip size="small" variant="outlined" label="Securise" />
                <Chip size="small" variant="outlined" label="Sans pub" />
              </Stack>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  px: { xs: 1.8, sm: 2.4 },
                  py: 1.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.4,
                  borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
                  background: '#ffffff',
                }}
              >
                {isMobile && (
                  <IconButton
                    size="small"
                    onClick={() => setActiveUserId(null)}
                    aria-label="Retour"
                  >
                    <ArrowBackRoundedIcon fontSize="small" />
                  </IconButton>
                )}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: '#22c55e',
                        border: '2px solid #fff',
                      }}
                    />
                  }
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
                  <Typography fontWeight={700} noWrap sx={{ fontSize: 15.5 }}>
                    {activeContact.name}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.8}
                    sx={{ mt: 0.4, lineHeight: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#22c55e',
                        boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.18)',
                        animation: 'pulseDot 1.8s ease-in-out infinite',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        color: '#64748b',
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: '0.01em',
                      }}
                    >
                      Actif maintenant
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              <Box
                ref={messagesContainerRef}
                sx={{
                  flexGrow: 1,
                  px: { xs: 1.6, sm: 3 },
                  py: 2.4,
                  overflowY: 'auto',
                  background:
                    'radial-gradient(at top, #f8fafc 0%, #eef2f7 60%, #e2e8f0 100%)',
                  '&::-webkit-scrollbar': { width: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(148,163,184,0.4)',
                    borderRadius: 4,
                  },
                }}
              >
                {loadingMessages && messages.length === 0 ? (
                  <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Stack spacing={0}>
                    {messages.length === 0 && (
                      <Box
                        sx={{
                          textAlign: 'center',
                          color: '#64748b',
                          mt: 4,
                        }}
                      >
                        <Typography>Aucun message pour le moment.</Typography>
                        <Typography variant="body2">
                          Envoie un premier message pour lancer la conversation.
                        </Typography>
                      </Box>
                    )}
                    {messages.map((message, index) => {
                      const mine = message.senderId === user?.id
                      const previous = messages[index - 1]
                      const next = messages[index + 1]
                      const previousDate = parseDate(previous?.createdAt)
                      const currentDate = parseDate(message.createdAt)
                      const showDayDivider =
                        !previous ||
                        !sameDay(previousDate, currentDate)
                      const grouped =
                        previous &&
                        previous.senderId === message.senderId &&
                        !showDayDivider &&
                        currentDate &&
                        previousDate &&
                        currentDate.getTime() - previousDate.getTime() < 60_000
                      const isLastOfGroup =
                        !next ||
                        next.senderId !== message.senderId ||
                        (parseDate(next.createdAt) &&
                          parseDate(next.createdAt).getTime() -
                            currentDate.getTime() >
                            60_000)
                      return (
                        <Box key={message.id}>
                          {showDayDivider && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2.4,
                                gap: 1.4,
                              }}
                            >
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  height: 1,
                                  background: 'rgba(148,163,184,0.25)',
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1.4,
                                  py: 0.4,
                                  borderRadius: 999,
                                  bgcolor: '#ffffff',
                                  color: '#64748b',
                                  fontWeight: 600,
                                  border: '1px solid rgba(148,163,184,0.22)',
                                }}
                              >
                                {formatDayLabel(message.createdAt)}
                              </Typography>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  height: 1,
                                  background: 'rgba(148,163,184,0.25)',
                                }}
                              />
                            </Box>
                          )}
                          <Bubble
                            message={message}
                            mine={mine}
                            grouped={grouped}
                            showTime={isLastOfGroup}
                          />
                        </Box>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </Stack>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mx: 1.6, mb: 1, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSend}
                sx={{
                  p: 1.6,
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1.2,
                  background: '#fff',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    px: 1.8,
                    py: 0.9,
                    borderRadius: 4,
                    bgcolor: '#f8fafc',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    '&:focus-within': {
                      borderColor: 'rgba(79,70,229,0.4)',
                      bgcolor: '#fff',
                    },
                  }}
                >
                  <InputBase
                    fullWidth
                    multiline
                    maxRows={5}
                    placeholder="Ecris un message..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    inputProps={{ maxLength: 2000 }}
                    sx={{ fontSize: 14.5, lineHeight: 1.5 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: draft.length > 1800 ? 'error.main' : '#94a3b8',
                      fontSize: 11,
                      lineHeight: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {draft.length}/2000
                  </Typography>
                </Paper>
                <IconButton
                  type="submit"
                  disabled={sending || !draft.trim()}
                  sx={{
                    width: 46,
                    height: 46,
                    color: '#fff',
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 10px 24px rgba(79, 70, 229, 0.35)',
                    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 14px 28px rgba(79, 70, 229, 0.45)',
                      background:
                        'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    },
                    '&.Mui-disabled': {
                      background: '#cbd5e1',
                      color: '#fff',
                      boxShadow: 'none',
                    },
                  }}
                  aria-label="Envoyer"
                >
                  {sending ? (
                    <CircularProgress size={18} sx={{ color: '#fff' }} />
                  ) : (
                    <SendRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  )
}
