// utils/jwt.ts
import jwt from "jsonwebtoken";

// ✅ Separate secrets for access and refresh tokens (IMPORTANT for security!)
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret-change-this";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret-change-this";

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"; // 7 days

export interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Generate Access Token (short-lived)
 */

export const generateToken = (payload: JWTPayload): string => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET must be defined");
  }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as any, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as any,
  });
};

/**
 * Verify Access Token
 */

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Generate Refresh Token (long-lived)
 */

export const generateRefreshToken = (payload: JWTPayload): string => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET must be defined");
  }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as any, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as any,
  });
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    throw new Error("REFRESH_TOKEN_VERIFICATION_FAILED");
  }
};

/**
 * Decode token without verification (useful for debugging)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};
