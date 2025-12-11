import { Request, Response } from "express";
import { userService } from "../../services/authService";

export const signinController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const userSigned = await userService.verifyPassword(userData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userSigned,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error : ", error);
      if (error.message === "EMAIL_INCORRECT") {
        return res.status(409).json({
          success: false,
          message: "Wrong email",
        });
      }
      if (error.message === "PASSWORD_INCORRECT") {
        return res.status(409).json({
          success: false,
          message: "Wrong Pass!",
        });
      }
    }
  }
};
