import { envConfig } from "@/config";
import { createUser } from "@/lib";
import { APIResponse, generateJWTToken, logger } from "@/utils";
import type { RequestHandler } from "express";
import type { RegisterSchemaType } from "../schemas";

const register: RequestHandler = async (req, res, next) => {
	const { name, email, password, role } = req.body as RegisterSchemaType;

	const newUser = await createUser({
		name,
		email,
		role,
		password,
	});

	logger.info(`User login in: ${newUser.email}`);

	const accessToken = generateJWTToken(
		{ id: newUser.id, role: newUser.role },
		envConfig.ACCESS_TOKEN_SECRET,
		envConfig.ACCESS_TOKEN_EXPIRE,
	);
	const refreshToken = generateJWTToken(
		{ id: newUser.id, role: newUser.role },
		envConfig.REFRESH_TOKEN_SECRET,
		envConfig.REFRESH_TOKEN_EXPIRE,
	);

	res.cookie("access-token", accessToken, {
		expires: new Date(
			Date.now() + envConfig.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: req.secure,
	});

	res.status(201).json(
		new APIResponse(201, "User registered successfully", {
			user: newUser,
			accessToken,
			refreshToken,
		}),
	);
};

export default register;
