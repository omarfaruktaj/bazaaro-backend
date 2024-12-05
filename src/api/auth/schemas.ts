import { z } from "zod";

const UserRolesEnum = z.enum(["VENDOR", "CUSTOMER", "ADMIN"]);

export const RegisterSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password should be at least 6 characters long" }),
	role: UserRolesEnum.optional().default("CUSTOMER"),
});

export const LoginSchema = z.object({
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" })
		.max(100, { message: "Password must be less than 100 characters." }),
});
export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: "Invalid email format" }),
});

export const ResetPasswordSchema = z.object({
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" })
		.max(100, { message: "Password must be less than 100 characters." }),
});

export const ChangePasswordSchema = z.object({
	currentPassword: z
		.string()
		.min(6, { message: "Current password must be at least 6 characters long." })
		.max(100, {
			message: "Current password must be less than 100 characters.",
		}),
	newPassword: z
		.string()
		.min(6, { message: "New password must be at least 6 characters long." })
		.max(100, { message: "New password must be less than 100 characters." }),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type loginSchemaType = z.infer<typeof LoginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
