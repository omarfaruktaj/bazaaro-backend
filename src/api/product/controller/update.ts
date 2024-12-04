import { updateProduct } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const id = req.params.productId;
	const product = await updateProduct(id, data);

	res
		.status(200)
		.json(new APIResponse(200, "Product updated successfully", product));
};

export default update;
