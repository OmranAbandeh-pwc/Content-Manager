import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isLoading } = useAuth();
 * 
 * // Check if user is authenticated
 * if (isAuthenticated) {
 *   console.log('User is logged in:', user);
 * }
 * 
 * // Login
 * await login('email@example.com', 'password123');
 * 
 * // Logout
 * logout();
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};