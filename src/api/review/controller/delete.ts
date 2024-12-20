import { deleteReview } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const id = req.params.reviewId;
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await deleteReview(user, id);

	res
		.status(200)
		.json(new APIResponse(200, "Review deleted successfully", review));
};

export default deleteController;
