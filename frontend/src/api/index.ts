import axios, { type AxiosResponse } from 'axios'

// API Configuration - Check runtime config first, then build-time env, then fallback
const getRuntimeConfig = () => {
  // @ts-ignore - window.APP_CONFIG is loaded from public/config.js
  return window.APP_CONFIG?.API_URL || null
}

const API_BASE_URL = getRuntimeConfig() || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Debug logging
console.log('API Configuration:', {
  runtimeConfig: getRuntimeConfig(),
  buildTimeEnv: import.meta.env.VITE_API_URL,
  finalApiUrl: API_BASE_URL
})

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Types
export interface Score {
  id?: number
  initials: string
  score: number
  timestamp?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// API Functions
export const gameApi = {
  // Submit a new score
  async submitScore(scoreData: { initials: string; score: number }): Promise<Score> {
    try {
      const response: AxiosResponse<ApiResponse<Score>> = await api.post('/scores/', scoreData)
      return response.data.data
    } catch (error) {
      console.error('Error submitting score:', error)
      throw error
    }
  },

  // Get top 10 scores (leaderboard)
  async getLeaderboard(): Promise<Score[]> {
    try {
      const response: AxiosResponse<ApiResponse<Score[]>> = await api.get('/scores/top/')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      throw error
    }
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health/')
      return response.data.success
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export default api 