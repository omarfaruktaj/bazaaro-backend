import { updateMyProfile } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;
	const data = req.body;

	if (!user) return next(new AppError("You don't have permission", 401));

	const userInfo = await updateMyProfile(user, data);

	res
		.status(200)
		.json(new APIResponse(200, "User updated successfully", userInfo));
};

export default updateProfile;
