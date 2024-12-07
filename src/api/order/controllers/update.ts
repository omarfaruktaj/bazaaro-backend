import { orderService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const orderId = req.params.orderId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const order = await orderService.updateOrderStatus(user, orderId, data);

	res
		.status(200)
		.json(new APIResponse(200, "Order status updated successfully", order));
};

export default update;
