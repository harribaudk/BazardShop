import { apiClient } from './apiClient'

export const chatService = {
  listUsers: () => apiClient.get('/chat/users'),
  listConversations: () => apiClient.get('/chat/conversations'),
  listMessages: (userId) => apiClient.get(`/chat/conversations/${userId}/messages`),
  sendMessage: (userId, content) =>
    apiClient.post(`/chat/conversations/${userId}/messages`, { content }),
}
