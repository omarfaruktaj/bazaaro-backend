import type { ErrorRequestHandler, Request, Response } from "express";
import { envConfig } from "../config/env";
import { APIResponse, type AppError } from "../utils";

const handleDevelopmentError = (
	err: AppError,
	_req: Request,
	res: Response,
) => {
	return res.status(err.code || 500).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
	});
};

const handleProductionError = (err: AppError, _req: Request, res: Response) => {
	//* Trusted Error send message
	if (err.isOperational) {
		return res
			.status(err.code)
			.json(
				new APIResponse(
					err.code,
					err.message,
					null,
					null,
					null,
					err.errors || null,
				),
			);
	}
	//! Untrusted error! Don't leap information

	return res
		.status(500)
		.json(
			new APIResponse(500, "Something went wrong!", null, null, null, null),
		);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
	if (envConfig.NODE_ENV === "development") {
		handleDevelopmentError(error, req, res);
	} else if (envConfig.NODE_ENV === "production") {
		const err = { ...error };
		err.status = error.status || "error";
		err.statusCode = error.statusCode || 500;

		handleProductionError(err, req, res);
	}
};

export default globalErrorHandler;
