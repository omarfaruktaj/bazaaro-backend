import { couponService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const applyCouponCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { code, shopId } = req.body;
  console.log(shopId);

  if (!user) return next(new AppError("You don't have permission", 401));
  if (!shopId) return next(new AppError("Shop ID is required", 400));
  if (!code) return next(new AppError("Coupon code is required", 400));

  const data = await couponService.applyCoupon(user, code, shopId);

  res
    .status(200)
    .json(new APIResponse(200, "Coupon applied successfully", data));
};

export default applyCouponCode;
