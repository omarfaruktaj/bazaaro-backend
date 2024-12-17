import { deleteReviewResponse } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteResponse = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const responseId = req.params.responseId;
	const user = req.user;
	console.log(responseId);

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await deleteReviewResponse(user, responseId);

	res
		.status(200)
		.json(new APIResponse(200, "Response deleted successfully", review));
};

export default deleteResponse;
