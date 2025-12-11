import bcrypt from "bcrypt";
import { queryDatabase } from "../db/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import { tokenService } from "./tokenService";

interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  secondName?: string;
}
interface VerifyUserData {
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  email: string;
  firstName: string | null;
  secondName: string | null;
}

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  firstName: string | null;
  secondName: string | null;
}

export class UserService {
  private saltRounds = 10;

  /**
   * Check if user exists by email
   */
  async findUserByEmail(email: string): Promise<UserRow | null> {
    const result = await queryDatabase(
      "SELECT id, email, firstName, secondName FROM users WHERE email = ?",
      [email]
    );

    const rows = result as UserRow[];
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const { email, password, firstName, secondName } = userData;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error("USER_EXISTS");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Insert user
    const result = await queryDatabase(
      "INSERT INTO users (email, password, firstName, secondName) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, firstName || null, secondName || null]
    );

    const insertResult = result as ResultSetHeader;
    const userId = insertResult.insertId;

    return {
      id: userId,
      email,
      firstName: firstName || null,
      secondName: secondName || null,
    };
  }

  /**
   * Verify user password for login
   */
  async verifyPassword(userData: VerifyUserData): Promise<any> {
    const { email, password } = userData;

    // Get user from database
    const result = await queryDatabase(
      "SELECT id, email, password, firstName, secondName FROM users WHERE email = ?",
      [email]
    );

    const rows = result as UserRow[];

    if (rows.length === 0) {
      throw new Error("EMAIL_INCORRECT");
    }

    const user = rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("PASSWORD_INCORRECT");
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ✅ Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await tokenService.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    // Return tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UserResponse | null> {
    const result = await queryDatabase(
      "SELECT id, email, firstName, secondName FROM users WHERE id = ?",
      [userId]
    );

    const rows = result as UserRow[];
    return rows.length > 0 ? rows[0] : null;
  }
}

// Export singleton instance
export const userService = new UserService();
