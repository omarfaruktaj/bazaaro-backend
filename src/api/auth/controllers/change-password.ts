import { changeUserPassword } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";
import type { ChangePasswordSchemaType } from "../schemas";

const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { currentPassword, newPassword } = req.body as ChangePasswordSchemaType;

	const userId = req.user?.id;

	if (!userId) return next(new AppError("You don't have permission", 401));

	await changeUserPassword(userId, currentPassword, newPassword);

	res.status(200).json(new APIResponse(200, "Password changed Successfully"));
};

export default changePassword;
