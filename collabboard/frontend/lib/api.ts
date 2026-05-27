'use client';

import axios from 'axios';
import { supabase } from './supabase';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const demoToken = process.env.NEXT_PUBLIC_DEMO_TOKEN ?? 'dev-demo-token';

export const api = axios.create({ baseURL: API_URL });

export async function getAuthToken() {
  if (demoMode) {
    return demoToken;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
