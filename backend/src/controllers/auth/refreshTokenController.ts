import { Request, Response } from "express";
import { tokenService } from "../../services/tokenService";

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Check if refresh token provided
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Get new tokens
    const tokens = await tokenService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Refresh token error:", error);

      if (error.message === "INVALID_REFRESH_TOKEN") {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      if (error.message === "REFRESH_TOKEN_NOT_FOUND") {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
      }

      if (error.message === "REFRESH_TOKEN_EXPIRED") {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};