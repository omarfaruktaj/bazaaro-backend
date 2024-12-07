import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const couponId = req.params.couponId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const coupon = await couponService.updateCoupon(user, couponId, data);

	res
		.status(200)
		.json(new APIResponse(200, "Coupon updated successfully", coupon));
};

export default update;
