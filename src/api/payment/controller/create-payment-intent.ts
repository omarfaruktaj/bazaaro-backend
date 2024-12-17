import { paymentService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const createPaymentIntent = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const paymentIntent = await paymentService.createPaymentIntent(user);

	res
		.status(201)
		.json(
			new APIResponse(
				201,
				"Payment Intent created successfully",
				paymentIntent,
			),
		);
};

export default createPaymentIntent;
