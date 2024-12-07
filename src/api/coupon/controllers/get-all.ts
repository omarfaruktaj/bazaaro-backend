import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const coupons = await couponService.getCoupons(user);

	res
		.status(200)
		.json(new APIResponse(200, "Coupons retrieved successfully", coupons));
};

export default getAll;
