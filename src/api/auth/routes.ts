import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	loginController,
	registerController,
	requestRestPasswordController,
	resetPasswordController,
} from "./controllers";
import {
	LoginSchema,
	RegisterSchema,
	RequestResetPasswordSchema,
	ResetPasswordSchema,
} from "./schemas";

const router = Router();

router.post("/register", validateRequest(RegisterSchema), registerController);
router.post("/login", validateRequest(LoginSchema), loginController);
router.post(
	"/request-password-reset",
	validateRequest(RequestResetPasswordSchema),
	requestRestPasswordController,
);
router.post(
	"/reset-password/:resetToken",
	validateRequest(ResetPasswordSchema),
	resetPasswordController,
);

export default router;
