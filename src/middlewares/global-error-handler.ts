import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { ErrorRequestHandler, Request, Response } from "express";
import { ZodError, type ZodIssue } from "zod";
import { envConfig } from "../config/env";
import { APIResponse, AppError } from "../utils";

//* handle zod errors
const handleZodError = (err: ZodError) => {
	const errorMessages = err.issues.map((issue: ZodIssue) => {
		return {
			path: String(issue?.path[issue.path.length - 1]),
			message: issue.message,
		};
	});
	const message = errorMessages
		.map((msg) => `${msg.path}: ${msg.message}`)
		.join(", ");

	return new AppError(message || "Validation Error", 400, errorMessages);
};

//* handle prisma error
const handlePrismaError = (err: PrismaClientKnownRequestError) => {
	let message = "Database Error";
	let code = 500;

	if (err.code === "P2002") {
		const target = err.meta?.target;
		if (Array.isArray(target)) {
			message = `Duplicate entry for ${target.join(", ")}`;
		} else {
			message = "Duplicate entry for a field.";
		}
		code = 409;
	} else if (err.code === "P2025") {
		message = "Record not found.";
		code = 404;
	}

	return new AppError(message, code);
};

const handleJWTError = () =>
	new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
	new AppError("Your token has expired! Please log in again.", 401);

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
	console.log(error);
	if (envConfig.NODE_ENV === "development") {
		handleDevelopmentError(error, req, res);
	} else if (envConfig.NODE_ENV === "production") {
		let err = { ...error };

		err.message = error.message;
		err.status = error.status || "error";
		err.statusCode = error.code || 500;

		if (error instanceof ZodError) {
			err = handleZodError(error);
		}

		if (error instanceof PrismaClientKnownRequestError) {
			err = handlePrismaError(error);
		}

		if (error.name === "JsonWebTokenError") err = handleJWTError();
		if (error.name === "TokenExpiredError") err = handleJWTExpiredError();

		handleProductionError(err, req, res);
	}
};

export default globalErrorHandler;
