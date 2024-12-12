import { findAllProduct } from "@/lib";
import { APIResponse, filterQueryParams } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const query = filterQueryParams(req.query, [
		"page",
		"limit",
		"searchTerm",
		"sort",
		"fields",
		"include",
		"price",
		"shopId",
	]);

	const { data, pagination } = await findAllProduct(query);

	res
		.status(200)
		.json(
			new APIResponse(200, "Products retrieved successfully", data, pagination),
		);
};

export default getAll;
