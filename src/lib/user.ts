import type { RegisterSchemaType } from "@/api/auth/schemas";
import db from "@/config/db";
import { AppError } from "@/utils";
import { UserRoles } from "@prisma/client";

export const findUserByEmail = (email: string) => {
	return db.user.findUnique({
		where: {
			email,
			deletedAt: null,
		},
	});
};

export const findUserById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id,
			deletedAt: null,
		},
	});
};

export const createUser = async ({
	name,
	email,
	password,
	role = UserRoles.CUSTOMER,
}: RegisterSchemaType) => {
	const isExistedUser = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (isExistedUser) throw new AppError("Email already registered.", 400);

	const user = await db.user.create({
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

	return user;
};

interface UserUpdate {
	userId: string;
	email?: string;
	password?: string;
	role?: UserRoles;
}

export const updateUser = ({ userId, email, password, role }: UserUpdate) => {
	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			email,
			password,
			role,
		},
	});
};
