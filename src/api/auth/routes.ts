import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	changePassword,
	loginController,
	refreshTokenController,
	registerController,
	requestRestPasswordController,
	resetPasswordController,
} from "./controllers";
import {
	ChangePasswordSchema,
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

router.patch(
	"/changePassword",
	authorizeWithRoles("ADMIN", "CUSTOMER", "VENDOR"),
	validateRequest(ChangePasswordSchema),
	changePassword,
);

router.post("/refreshToken", refreshTokenController);

export default router;
