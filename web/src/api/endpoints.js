import { apiClient } from './client';

export const fetchHealth = () => apiClient.get('/health').then((r) => r.data);

export const fetchCategories = () =>
  apiClient.get('/categories').then((r) => r.data.data);

export const fetchProjects = (params = {}) =>
  apiClient.get('/projects', { params }).then((r) => r.data);

export const fetchProject = (slug) =>
  apiClient.get(`/projects/${slug}`).then((r) => r.data.data);

export const fetchProjectCities = () =>
  apiClient.get('/projects/cities').then((r) => r.data.data);

export const fetchServices = (params = {}) =>
  apiClient.get('/services', { params }).then((r) => r.data.data);

export const fetchSettings = () =>
  apiClient.get('/settings/public').then((r) => r.data.data);

export const fetchSocialFeed = (params = {}) =>
  apiClient.get('/social/feed', { params }).then((r) => r.data.data);

export const submitContact = (payload) =>
  apiClient.post('/contact', payload).then((r) => r.data);

export const submitQuote = (payload) => {
  const files = Array.isArray(payload.attachments) ? payload.attachments : [];

  // Si pas de fichiers, envoi JSON classique (plus rapide, plus simple)
  if (files.length === 0) {
    const { attachments: _attachments, ...rest } = payload; // eslint-disable-line no-unused-vars
    return apiClient.post('/quotes', rest).then((r) => r.data);
  }

  // Avec fichiers : multipart/form-data
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'attachments') return;
    if (value === null || value === undefined || value === '') return;
    form.append(key, value);
  });
  files.forEach((file) => form.append('attachments[]', file));

  return apiClient.post('/quotes', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const login = (payload) =>
  apiClient.post('/auth/login', payload).then((r) => r.data);

export const logout = () => apiClient.post('/auth/logout').then((r) => r.data);

export const fetchMe = () => apiClient.get('/auth/me').then((r) => r.data.data);

export const updatePassword = (payload) =>
  apiClient.patch('/auth/password', payload).then((r) => r.data);
