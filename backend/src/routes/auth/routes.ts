import express from "express";
import { signupController } from "../../controllers/auth/signup";
import { signinController } from "../../controllers/auth/signin";
import { refreshTokenController } from "../../controllers/auth/refreshTokenController";
import { logoutController } from "../../controllers/auth/logoutController";
import { validateBody } from "../../middlewares/validation";
import { loginSchema, signupSchema } from "../../schemas/userSchema";
import { authenticate } from "../../middlewares/authenticate";
import { verifyController } from "../../controllers/auth/verifyController";

export const router = express.Router();

router.post("/signin", validateBody(loginSchema), signinController);

router.post("/signup", validateBody(signupSchema), signupController);

// ✅ New routes
router.get("/verify", authenticate, verifyController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);
