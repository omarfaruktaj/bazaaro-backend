import { orderService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const paymentData = req.body;

	if (!user) return next(new AppError("You don't have permission", 401));

	const order = await orderService.createOrder(user, paymentData);

	res
		.status(201)
		.json(new APIResponse(201, "Order created successfully", order));
};

export default create;
