import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	changePassword,
	forgotPasswordController,
	loginController,
	refreshTokenController,
	registerController,
	resetPasswordController,
} from "./controllers";
import {
	ChangePasswordSchema,
	ForgotPasswordSchema,
	LoginSchema,
	RegisterSchema,
	ResetPasswordSchema,
} from "./schemas";

const router = Router();
router.post(
	"/reset-password/:token",
	validateRequest(ResetPasswordSchema),
	resetPasswordController,
);
router.post("/signup", validateRequest(RegisterSchema), registerController);
router.post("/login", validateRequest(LoginSchema), loginController);
router.post(
	"/forgot-password",
	validateRequest(ForgotPasswordSchema),
	forgotPasswordController,
);

router.patch(
	"/change-password",
	authorizeWithRoles("ADMIN", "CUSTOMER", "VENDOR"),
	validateRequest(ChangePasswordSchema),
	changePassword,
);

router.post("/refresh-token", refreshTokenController);

export default router;
