// controllers/signupController.ts
import { Request, Response } from "express";
import { SignupInput, signupSchema } from "../../schemas/userSchema";
import { userService } from "../../services/authService";

export const signupController = async (req: Request, res: Response) => {
  try {
    const userData = req.body as SignupInput;
    // 2. Call service to create user
    const user = await userService.createUser(userData);

    // 3. Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle known errors
    if (error instanceof Error) {
      if (error.message === "USER_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error during signup",
    });
  }
};
