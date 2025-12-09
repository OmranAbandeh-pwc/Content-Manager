import Cookies from 'js-cookie';

interface CookieOptions {
  expires?: number; // Days
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

class CookieStorage {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_DATA_KEY = 'userData';

  // Default options
  private readonly defaultOptions: CookieOptions = {
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    sameSite: 'strict',
    path: '/',
  };

  /**
   * Set access token in cookie
   * @param token - JWT access token
   * @param expiresInMinutes - Expiration time in minutes (default: 15 minutes)
   */
  setToken(token: string, expiresInMinutes: number = 15): void {
    const expiresInDays = expiresInMinutes / (24 * 60); // Convert minutes to days
    
    Cookies.set(this.TOKEN_KEY, token, {
      ...this.defaultOptions,
      expires: expiresInDays,
    });
  }

  /**
   * Set refresh token in cookie
   * @param refreshToken - JWT refresh token
   * @param expiresInDays - Expiration time in days (default: 7 days)
   */
  setRefreshToken(refreshToken: string, expiresInDays: number = 7): void {
    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
      ...this.defaultOptions,
      expires: expiresInDays,
    });
  }

  /**
   * Get access token from cookie
   */
  getToken(): string | undefined {
    return Cookies.get(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from cookie
   */
  getRefreshToken(): string | undefined {
    return Cookies.get(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if access token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if refresh token exists
   */
  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  /**
   * Remove access token
   */
  removeToken(): void {
    Cookies.remove(this.TOKEN_KEY, { path: this.defaultOptions.path });
  }

  /**
   * Remove refresh token
   */
  removeRefreshToken(): void {
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: this.defaultOptions.path });
  }

  /**
   * Remove all tokens and user data
   */
  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUserData();
  }

  /**
   * Set user data in cookie
   * @param user - User object
   */
  setUserData(user: any): void {
    Cookies.set(this.USER_DATA_KEY, JSON.stringify(user), {
      ...this.defaultOptions,
      expires: 7, // 7 days
    });
  }

  /**
   * Get user data from cookie
   */
  getUserData<T = any>(): T | null {
    const data = Cookies.get(this.USER_DATA_KEY);
    
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
      return null;
    }
  }

  /**
   * Remove user data
   */
  removeUserData(): void {
    Cookies.remove(this.USER_DATA_KEY, { path: this.defaultOptions.path });
  }

  /**
   * Set both tokens at once
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Get all tokens
   */
  getTokens(): { accessToken?: string; refreshToken?: string } {
    return {
      accessToken: this.getToken(),
      refreshToken: this.getRefreshToken(),
    };
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}

// Export singleton instance
export const cookieStorage = new CookieStorage();