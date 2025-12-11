import axiosInstance from '../axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  refreshToken: async (): Promise<string> => {
    const response = await axiosInstance.post<{ token: string }>('/auth/refresh');
    return response.data.token;
  },
};
