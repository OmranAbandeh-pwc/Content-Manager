export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/signin',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      VERIFY: '/api/auth/verify',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
    },
    USER: {
      PROFILE: '/api/user/profile',
      UPDATE: '/api/user/update',
      DELETE: '/api/user/delete',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  TIMEOUT: 10000,
  TOKEN_EXPIRY: {
    ACCESS_TOKEN_MINUTES: 15,
    REFRESH_TOKEN_DAYS: 7,
  },
} as const;