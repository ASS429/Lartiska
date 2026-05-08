import { apiClient } from './client';

export const fetchAdminDashboard = () =>
  apiClient.get('/admin/dashboard').then((r) => r.data.data);

export const fetchAdminQuotes = (params = {}) =>
  apiClient.get('/admin/quotes', { params }).then((r) => r.data);

export const fetchAdminQuote = (id) =>
  apiClient.get(`/admin/quotes/${id}`).then((r) => r.data.data);

export const updateAdminQuote = (id, payload) =>
  apiClient.patch(`/admin/quotes/${id}`, payload).then((r) => r.data);

export const fetchAdminMessages = (params = {}) =>
  apiClient.get('/admin/messages', { params }).then((r) => r.data);

export const fetchAdminMessage = (id) =>
  apiClient.get(`/admin/messages/${id}`).then((r) => r.data.data);

export const markAdminMessageRead = (id) =>
  apiClient.patch(`/admin/messages/${id}/read`).then((r) => r.data);
