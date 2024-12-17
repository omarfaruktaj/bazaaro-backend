import { createReviewResponse } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const createResponse = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const data = req.body;
	const user = req.user;
	const reviewId = req.params.reviewId;

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await createReviewResponse(user, reviewId, data);

	res
		.status(201)
		.json(new APIResponse(201, "Response created successfully", review));
};

export default createResponse;
