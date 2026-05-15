import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

/**
 * URL de l'API Lartiska.
 *
 * En dev : Expo Go ne peut pas atteindre 127.0.0.1 (qui pointe le téléphone).
 * On lit `EXPO_PUBLIC_API_URL` qui DOIT être défini dans .env.local — typiquement
 * l'IP de la machine sur le réseau Wi-Fi (ex: http://192.168.1.42:8000/api).
 *
 * En prod (build EAS) : on lit la même var, qui pointera vers Railway.
 */
const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'http://localhost:8000/api';

export const TOKEN_KEY = 'lartiska_token';

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export const API_URL = apiUrl;
