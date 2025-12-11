import { Request, Response } from "express";
import { userService } from "../../services/authService";

export const verifyController = async (req: Request, res: Response) => {
  try {
    // The user is already verified by the authenticate middleware
    // req.user contains the decoded token payload
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get fresh user data from database
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          secondName: user.secondName,
        },
      },
    });
  } catch (error) {
    console.log("Verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};