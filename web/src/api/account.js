import { apiClient } from './client';

export const fetchMyQuotes = (params = {}) =>
  apiClient.get('/account/quotes', { params }).then((r) => r.data);
