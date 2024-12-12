import { getMe } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getMeController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const userInfo = await getMe(user.id);

	res.status(200).json(new APIResponse(200, "Get User successfully", userInfo));
};

export default getMeController;
