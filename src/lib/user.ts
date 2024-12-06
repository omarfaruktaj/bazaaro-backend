import type { RegisterSchemaType } from "@/api/auth/schemas";
import db from "@/config/db";
import { AppError, createHash } from "@/utils";
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
	const hashedPassword = await createHash(password);

	if (role === UserRoles.VENDOR) {
		const user = await db.user.create({
			data: {
				email,
				role,
				password: hashedPassword,
			},
		});

		return user;
	}

	if (!name) throw new AppError("Name is required.", 400);

	const user = await db.user.create({
		data: {
			email,
			role,
			password: hashedPassword,

			profile: {
				create: {
					name,
				},
			},
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

export const changeUserPassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string,
) => {
	const user = await findUserById(userId);

	if (!user) throw new AppError("No user found.", 404);

	if (user.password !== currentPassword)
		throw new AppError("Your current password is wrong.", 400);

	const hashedPassword = await createHash(newPassword);

	const updatedUser = db.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	return updatedUser;
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
