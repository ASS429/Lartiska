import { useQuery } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchProjects,
  fetchProject,
  fetchServices,
  fetchSettings,
  fetchSocialFeed,
} from '@/api/endpoints';

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 5 * 60 * 1000 });

export const useProjects = (params) =>
  useQuery({ queryKey: ['projects', params], queryFn: () => fetchProjects(params) });

export const useProject = (slug) =>
  useQuery({ queryKey: ['project', slug], queryFn: () => fetchProject(slug), enabled: !!slug });

export const useServices = (params) =>
  useQuery({ queryKey: ['services', params], queryFn: () => fetchServices(params), staleTime: 5 * 60 * 1000 });

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: fetchSettings, staleTime: 30 * 60 * 1000 });

export const useSocialFeed = (params) =>
  useQuery({ queryKey: ['social-feed', params], queryFn: () => fetchSocialFeed(params), staleTime: 10 * 60 * 1000 });
