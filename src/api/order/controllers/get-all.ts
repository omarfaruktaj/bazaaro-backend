import { orderService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const orders = await orderService.getOrders(user);

	res
		.status(200)
		.json(new APIResponse(200, "Orders retrieved successfully", orders));
};

export default getAll;
