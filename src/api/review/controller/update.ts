import { updateReview } from "@/lib/review";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const id = req.params.reviewId;
	const review = await updateReview(id, data);

	res
		.status(200)
		.json(new APIResponse(200, "Review updated successfully", review));
};

export default update;
