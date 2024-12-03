import type { RegisterSchemaType } from "@/api/auth/schemas";
import db from "@/config/db";
import { UserRoles } from "@prisma/client";

export const findUserByEmail = (email: string) => {
	return db.user.findUnique({
		where: {
			email,
		},
	});
};

export const createUser = ({
	name,
	email,
	password,
	role = UserRoles.CUSTOMER,
}: RegisterSchemaType) => {
	return db.user.create({
		data: {
			email,
			password,
			role,
			profile: {
				create: {
					name,
				},
			},
		},
		select: {
			id: true,
			email: true,
			role: true,
		},
	});
};
