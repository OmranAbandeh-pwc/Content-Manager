

import { queryDatabase } from "../db/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

interface TokenRow extends RowDataPacket {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

interface RefreshTokenData {
  userId: number;
  token: string;
  expiresAt: Date;
}

export class TokenService {
  /**
   * Save refresh token to database
   */
  async saveRefreshToken(data: RefreshTokenData): Promise<void> {
    const { userId, token, expiresAt } = data;

    await queryDatabase(
      "INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  }

  /**
   * Find refresh token in database
   */
  async findRefreshToken(token: string): Promise<TokenRow | null> {
    const result = await queryDatabase(
      "SELECT * FROM refresh_tokens WHERE token = ?",
      [token]
    );

    const rows = result as TokenRow[];
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Delete refresh token (for logout)
   */
  async deleteRefreshToken(token: string): Promise<void> {
    await queryDatabase("DELETE FROM refresh_tokens WHERE token = ?", [token]);
  }

  /**
   * Delete all user's refresh tokens
   */
  async deleteUserRefreshTokens(userId: number): Promise<void> {
    await queryDatabase("DELETE FROM refresh_tokens WHERE userId = ?", [
      userId,
    ]);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // Check if refresh token exists in database
    const storedToken = await this.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new Error("REFRESH_TOKEN_NOT_FOUND");
    }

    // Check if token is expired
    if (new Date(storedToken.expiresAt) < new Date()) {
      await this.deleteRefreshToken(refreshToken);
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    // Verify userId matches
    if (storedToken.userId !== decoded.userId) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // Generate new tokens
    const tokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
    };

    const newAccessToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Token Rotation: Delete old refresh token and save new one
    await this.deleteRefreshToken(refreshToken);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await this.saveRefreshToken({
      userId: decoded.userId,
      token: newRefreshToken,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

// Export singleton instance
export const tokenService = new TokenService();