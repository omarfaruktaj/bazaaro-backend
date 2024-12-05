import { findAllProduct } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const products = await findAllProduct();

	res
		.status(200)
		.json(new APIResponse(200, "Products retrieved successfully", products));
};

export default getAll;
