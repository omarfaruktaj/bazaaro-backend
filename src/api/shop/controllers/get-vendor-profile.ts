import { findProfile } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getVendorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;

	if (!user) return next(new AppError("User is not authenticated", 401));
	const shops = await findProfile(user);

	res
		.status(200)
		.json(new APIResponse(200, "Shops retrieved successfully", shops));
};

export default getVendorProfile;
