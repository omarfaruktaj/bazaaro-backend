import { envConfig } from "@/config";
import { createUser, findUserByEmail } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import { createHash } from "@/utils/hash";
import { logger } from "@/utils/logger";
import { generateToken } from "@/utils/token";
import type { RequestHandler } from "express";
import type { RegisterSchemaType } from "../schemas";

const register: RequestHandler = async (req, res, next) => {
	const { name, email, password, role } = req.body as RegisterSchemaType;

	const existingUser = await findUserByEmail(email);

	if (existingUser) return next(new AppError("User already exist", 400));

	const hashedPassword = await createHash(password);

	const newUser = await createUser({
		name,
		email,
		role,
		password: hashedPassword,
	});

	logger.info(`User login in: ${newUser.email}`);

	const accessToken = generateToken(
		{ id: newUser.id, role: newUser.role },
		envConfig.ACCESS_TOKEN_SECRET,
		"15m",
	);
	const refreshToken = generateToken(
		{ id: newUser.id, role: newUser.role },
		envConfig.REFRESH_TOKEN_SECRET,
		"7d",
	);

	res.status(201).json(
		new APIResponse(201, "User registered successfully", {
			user: newUser,
			accessToken,
			refreshToken,
		}),
	);
};

export default register;
