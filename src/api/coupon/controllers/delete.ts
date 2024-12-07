import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const couponId = req.params.couponId;
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const coupon = await couponService.deleteCoupon(user, couponId);

	res
		.status(200)
		.json(new APIResponse(200, "Coupon deleted successfully", coupon));
};

export default deleteController;
