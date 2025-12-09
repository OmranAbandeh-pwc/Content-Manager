import { createContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../utils/apiClient";
import { cookieStorage } from "../utils/cookieStorage";
import { API_CONFIG } from "../config/api.config";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Update your response interface to match the API structure
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have tokens in cookies
        if (!cookieStorage.hasToken()) {
          setIsLoading(false);
          return;
        }

        // Try to get user data from cookie first
        const cachedUser = cookieStorage.getUserData<User>();
        if (cachedUser) {
          setUser(cachedUser);
          setIsLoading(false);
          return;
        }

        // If no cached user, verify token with backend
        const response = await apiClient.get<{
          success: boolean;
          data: { user: User };
        }>(API_CONFIG.ENDPOINTS.AUTH.VERIFY);

        if (response.success && response.data.user) {
          setUser(response.data.user);
          cookieStorage.setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        cookieStorage.clearAll();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        { email, password },
        false // Don't require auth for login
      );

      console.log("Full response: ", response);

      // Check if request was successful
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Access nested data
      const { accessToken, refreshToken, user } = response.data;

      console.log("Tokens: ", { accessToken, refreshToken });
      console.log("User: ", user);

      // Store tokens in cookies
      cookieStorage.setToken(
        accessToken,
        API_CONFIG.TOKEN_EXPIRY.ACCESS_TOKEN_MINUTES
      );
      cookieStorage.setRefreshToken(
        refreshToken,
        API_CONFIG.TOKEN_EXPIRY.REFRESH_TOKEN_DAYS
      );
      cookieStorage.setUserData(user);

      setUser(user);
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during login";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup user
   */
  const signup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
        { name: fullName, email, password },
        false // Don't require auth for signup
      );

      console.log("Signup response: ", response);

      // Check if request was successful
      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }

      // Access nested data
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens in cookies
      cookieStorage.setToken(
        accessToken,
        API_CONFIG.TOKEN_EXPIRY.ACCESS_TOKEN_MINUTES
      );
      cookieStorage.setRefreshToken(
        refreshToken,
        API_CONFIG.TOKEN_EXPIRY.REFRESH_TOKEN_DAYS
      );
      cookieStorage.setUserData(user);

      setUser(user);
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during signup";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout endpoint (optional - to invalidate refresh token on backend)
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT).catch(() => {
        // Ignore errors, we're logging out anyway
      });
    } finally {
      // Clear all cookies and state
      cookieStorage.clearAll();
      setUser(null);
      setError(null);
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { user: User };
      }>(API_CONFIG.ENDPOINTS.USER.PROFILE);

      if (response.success && response.data.user) {
        setUser(response.data.user);
        cookieStorage.setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    setError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
