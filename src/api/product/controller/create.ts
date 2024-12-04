import { createProduct } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;

	const product = await createProduct(data);

	res
		.status(201)
		.json(new APIResponse(201, "Product created successfully", product));
};

export default create;
