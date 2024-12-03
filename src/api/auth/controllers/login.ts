import { envConfig } from "@/config";
import { findUserByEmail } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import { compareHash } from "@/utils/hash";
import { logger } from "@/utils/logger";
import { generateToken } from "@/utils/token";
import type { RequestHandler } from "express";
import type { loginSchemaType } from "../schemas";

const login: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body as loginSchemaType;

	const existingUser = await findUserByEmail(email);

	if (!existingUser || existingUser.deletedAt) {
		return next(new AppError("Invalid credentials", 401));
	}

	const isPasswordCorrect = await compareHash(password, existingUser.password);
	if (!isPasswordCorrect) {
		return next(new AppError("Invalid credentials", 401));
	}

	if (existingUser.suspended) {
		return next(new AppError("User account has been suspended", 400));
	}

	logger.info(`User logged in: ${existingUser.email}`);
	const accessToken = generateToken(
		{ id: existingUser.id, role: existingUser.role },
		envConfig.ACCESS_TOKEN_SECRET,
		"15m",
	);
	const refreshToken = generateToken(
		{ id: existingUser.id, role: existingUser.role },
		envConfig.REFRESH_TOKEN_SECRET,
		"7d",
	);

	res.status(200).json(
		new APIResponse(201, "User login successfully", {
			user: existingUser,
			accessToken,
			refreshToken,
		}),
	);
};

export default login;
