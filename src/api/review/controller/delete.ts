import { deleteReview } from "@/lib/review";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const id = req.params.reviewId;
	const review = await deleteReview(id);

	res
		.status(200)
		.json(new APIResponse(200, "Review deleted successfully", review));
};

export default deleteController;
