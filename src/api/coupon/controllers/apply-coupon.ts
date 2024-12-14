import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const applyCouponCode = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;
	const { code } = req.body;

	if (!user) return next(new AppError("You don't have permission", 401));

	if (!code) return next(new AppError("Coupon code is required", 400));

	const data = await couponService.applyCoupon(user, code);

	res
		.status(200)
		.json(new APIResponse(200, "Coupon applied successfully", data));
};

export default applyCouponCode;
