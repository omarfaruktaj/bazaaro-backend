import { resetPasswordService } from "@/lib";
import { APIResponse } from "@/utils";
import type { RequestHandler } from "express";
import type { ResetPasswordSchemaType } from "../schemas";

const resetPassword: RequestHandler = async (req, res, next) => {
	const { password } = req.body as ResetPasswordSchemaType;

	const token = req.params.token;

	const user = await resetPasswordService(token, password);

	res.status(200).json(new APIResponse(200, "Password reset successfully"));
};

export default resetPassword;
