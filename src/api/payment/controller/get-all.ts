import { findAllPayments } from "@/lib/payment";
import { APIResponse, filterQueryParams } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const query = filterQueryParams(req.query, [
		"page",
		"limit",
		"sort",
		"fields",
		"include",
	]);
	const { data, pagination } = await findAllPayments(query);

	res
		.status(200)
		.json(
			new APIResponse(200, "Payments retrieved successfully", data, pagination),
		);
};

export default getAll;
