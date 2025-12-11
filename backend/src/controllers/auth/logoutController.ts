import { Request, Response } from "express";
import { tokenService } from "../../services/tokenService";

export const logoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete the refresh token from database
      await tokenService.deleteRefreshToken(refreshToken);
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};