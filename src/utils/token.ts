import type { UserRoles } from "@prisma/client";
import jwt from "jsonwebtoken";

interface Payload {
	id: string;
	role: UserRoles;
}

export const generateToken = (
	payload: Payload,
	secret: jwt.Secret,
	expiresIn: string | number = "1h",
	algorithm: jwt.Algorithm = "HS256",
) => {
	return jwt.sign(payload, secret, {
		algorithm,
		expiresIn,
	});
};

export const verifyToken = (token: string, secret: string) => {
	return jwt.verify(token, secret);
};
