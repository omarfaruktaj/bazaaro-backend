import { createReview } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const user = req.user;
	const productId = req.params.productId;

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await createReview(user, productId, data);

	res
		.status(201)
		.json(new APIResponse(201, "Review created successfully", review));
};

export default create;
