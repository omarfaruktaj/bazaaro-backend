import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const coupon = await couponService.createCoupon(user, data);

	res
		.status(201)
		.json(new APIResponse(201, "Coupon created successfully", coupon));
};

export default create;
