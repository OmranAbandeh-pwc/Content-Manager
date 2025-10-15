export type ThemeMode = 'light' | 'dark';

export interface Theme {
  // Primary Colors
  primaryMain: string;
  primaryLight: string;
  primaryDark: string;
  primaryContrast: string;

  // Secondary Colors
  secondaryMain: string;
  secondaryLight: string;
  secondaryDark: string;

  // Background Colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;

  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  // Status Colors
  success: string;
  error: string;
  warning: string;
  info: string;

  // Border & Divider
  border: string;
  divider: string;

  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export const lightTheme: Theme = {
  // Primary Colors
  primaryMain: '#667eea',
  primaryLight: '#8b9ef5',
  primaryDark: '#4c5fd4',
  primaryContrast: '#ffffff',

  // Secondary Colors
  secondaryMain: '#764ba2',
  secondaryLight: '#9b6ec8',
  secondaryDark: '#5a3780',

  // Background Colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f7fafc',
  bgTertiary: '#edf2f7',

  // Text Colors
  textPrimary: '#1a202c',
  textSecondary: '#718096',
  textDisabled: '#a0aec0',

  // Status Colors
  success: '#48bb78',
  error: '#f56565',
  warning: '#ed8936',
  info: '#4299e1',

  // Border & Divider
  border: '#e2e8f0',
  divider: '#cbd5e0',

  // Shadows
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 25px rgba(0, 0, 0, 0.15)',
};

export const darkTheme: Theme = {
  // Primary Colors
  primaryMain: '#8b9ef5',
  primaryLight: '#a5b5f7',
  primaryDark: '#667eea',
  primaryContrast: '#1a202c',

  // Secondary Colors
  secondaryMain: '#9b6ec8',
  secondaryLight: '#b88ed4',
  secondaryDark: '#764ba2',

  // Background Colors
  bgPrimary: '#1a202c',
  bgSecondary: '#2d3748',
  bgTertiary: '#4a5568',

  // Text Colors
  textPrimary: '#f7fafc',
  textSecondary: '#cbd5e0',
  textDisabled: '#718096',

  // Status Colors
  success: '#68d391',
  error: '#fc8181',
  warning: '#f6ad55',
  info: '#63b3ed',

  // Border & Divider
  border: '#4a5568',
  divider: '#2d3748',

  // Shadows
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.3)',
  shadowLg: '0 10px 25px rgba(0, 0, 0, 0.5)',
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};