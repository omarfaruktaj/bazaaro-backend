import { updateReview } from "@/lib/review";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const id = req.params.reviewId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const review = await updateReview(user.id, id, data);

	res
		.status(200)
		.json(new APIResponse(200, "Review updated successfully", review));
};

export default update;
