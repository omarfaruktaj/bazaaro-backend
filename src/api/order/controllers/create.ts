import { orderService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { cartItems, couponCode, paymentData } = req.body;

  if (!user) return next(new AppError("You don't have permission", 401));
  if (!cartItems || cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }
  if (!Array.isArray(cartItems)) {
    return next(new AppError("Cart items must be an array", 400));
  }

  const order = await orderService.createOrder({
    user,
    cartItems,
    couponCode: couponCode || null,
    paymentData,
  });

  res
    .status(201)
    .json(new APIResponse(201, "Order created successfully", order));
};

export default create;
