import { paymentService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { amount } = req.body;
  if (!amount || typeof amount !== "number") {
    return next(
      new AppError("Total amount is required and must be a number", 400)
    );
  }

  if (!user) return next(new AppError("You don't have permission", 401));

  const paymentIntent = await paymentService.createPaymentIntent(user, amount);

  res
    .status(201)
    .json(
      new APIResponse(201, "Payment Intent created successfully", paymentIntent)
    );
};

export default createPaymentIntent;
