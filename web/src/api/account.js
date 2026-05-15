import { apiClient } from './client';

export const fetchMyQuotes = (params = {}) =>
  apiClient.get('/account/quotes', { params }).then((r) => r.data);

export const fetchMyQuote = (id) =>
  apiClient.get(`/account/quotes/${id}`).then((r) => r.data.data);

export const respondToQuote = (id, payload) =>
  apiClient.post(`/account/quotes/${id}/respond`, payload).then((r) => r.data);
