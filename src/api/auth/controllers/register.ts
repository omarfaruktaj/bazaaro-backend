import { createUser, findUserByEmail } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import { createHash } from "@/utils/hash";
import type { RequestHandler } from "express";
import type { RegisterSchemaType } from "../schemas";

const register: RequestHandler = async (req, res, next) => {
	const { name, email, password, role } = req.body as RegisterSchemaType;

	const existingUser = await findUserByEmail(email);

	if (existingUser)
		return next(new AppError("Email is already registered", 400));

	const hashedPassword = await createHash(password);

	const newUser = await createUser({
		name,
		email,
		role,
		password: hashedPassword,
	});

	res
		.status(201)
		.json(new APIResponse(201, "User registered successfully", newUser));
};

export default register;
