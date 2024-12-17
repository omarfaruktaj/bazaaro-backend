import { updateReviewResponse } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const updateResponse = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const data = req.body;
	const responseId = req.params.responseId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await updateReviewResponse(user, responseId, data);

	res
		.status(200)
		.json(new APIResponse(200, "Response updated successfully", review));
};

export default updateResponse;
