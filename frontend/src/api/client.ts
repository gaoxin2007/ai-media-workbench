import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Should be in .env

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  ip: {
    generate: '/api/ip/generate',
    history: '/api/ip/history',
    detail: (id: number) => `/api/ip/${id}`,
    update: (id: number) => `/api/ip/${id}`,
  },
  benchmark: {
    search: '/api/benchmark/search',
  },
  script: {
    extract: '/api/script/extract',
    rewrite: '/api/script/rewrite',
  },
  avatar: {
    create: '/api/avatar/create',
  },
};
