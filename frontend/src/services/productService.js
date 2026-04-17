import { apiClient } from './apiClient'

export const productService = {
  list: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (payload) => apiClient.post('/products', payload),
  update: (id, payload) => apiClient.put(`/products/${id}`, payload),
  remove: (id) => apiClient.delete(`/products/${id}`),
}
