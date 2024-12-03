import { z } from "zod";

const UserRolesEnum = z.enum(["VENDOR", "CUSTOMER"]);

export const RegisterSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password should be at least 6 characters long" }),
	role: UserRolesEnum.optional().default("CUSTOMER"),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
