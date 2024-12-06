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

export const updateUser = async ({
	userId,
	email,
	password,
	role,
}: UserUpdate) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) throw new AppError("No user found", 404);

	if (user.suspended) throw new AppError("User is suspended", 400);

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

export const findAllUsers = () => {
	return db.user.findMany();
};

export const suspendUser = async (userId: string) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) throw new AppError("No user found", 404);

	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			suspended: new Date(),
		},
	});
};

export const deleteUser = async (userId: string) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) throw new AppError("No user found", 404);

	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			suspended: new Date(),
		},
	});
};
