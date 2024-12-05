import { findUserById, updateUser } from "@/lib";
import { APIResponse, AppError, createHash } from "@/utils";
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

	const user = await findUserById(userId);

	if (!user) return next(new AppError("No user found.", 404));

	if (user.password !== currentPassword)
		return next(new AppError("Your current password is wrong.", 400));

	const hashedPassword = await createHash(newPassword);

	await updateUser({
		userId: user.id,
		password: hashedPassword,
	});

	res.status(200).json(new APIResponse(200, "Password changed Successfully"));
};

export default changePassword;
