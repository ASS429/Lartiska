import { apiClient } from './client';

export const fetchHealth = () => apiClient.get('/health').then((r) => r.data);

export const fetchCategories = () =>
  apiClient.get('/categories').then((r) => r.data.data);

export const fetchProjects = (params = {}) =>
  apiClient.get('/projects', { params }).then((r) => r.data);

export const fetchProject = (slug) =>
  apiClient.get(`/projects/${slug}`).then((r) => r.data.data);

export const fetchServices = (params = {}) =>
  apiClient.get('/services', { params }).then((r) => r.data.data);

export const fetchSettings = () =>
  apiClient.get('/settings/public').then((r) => r.data.data);

export const fetchSocialFeed = (params = {}) =>
  apiClient.get('/social/feed', { params }).then((r) => r.data.data);

export const submitContact = (payload) =>
  apiClient.post('/contact', payload).then((r) => r.data);

export const submitQuote = (payload) =>
  apiClient.post('/quotes', payload).then((r) => r.data);

export const login = (payload) =>
  apiClient.post('/auth/login', payload).then((r) => r.data);

export const logout = () => apiClient.post('/auth/logout').then((r) => r.data);

export const fetchMe = () => apiClient.get('/auth/me').then((r) => r.data.data);
