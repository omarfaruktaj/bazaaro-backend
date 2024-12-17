import { createToken, deleteToken, findUserByEmail } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import { Email } from "@/utils/email";
import { TokenType } from "@prisma/client";
import type { RequestHandler } from "express";
import crypto from "node:crypto";
import { env } from "node:process";
import type { ForgotPasswordSchemaType } from "../schemas";

const forgotPassword: RequestHandler = async (req, res, next) => {
	const { email } = req.body as ForgotPasswordSchemaType;

	const user = await findUserByEmail(email);

	if (!user || user.deletedAt) {
		return next(new AppError("No user with that email found", 401));
	}

	if (user.suspended) {
		return next(new AppError("User account has been suspended", 400));
	}

	const resetToken = crypto.randomBytes(32).toString("hex");
	const hashedResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	const expireAt = new Date(Date.now() + 10 * 60 * 1000);

	const token = await createToken({
		token: hashedResetToken,
		userId: user.id,
		type: TokenType.PASSWORD_RESET,
		expireAt,
	});

	const resetURL = `${env.RESET_TOKEN_CLIENT_URL}?token=${resetToken}`;

	try {
		const mailOptions = {
			to: user.email,
			subject: "Bazaaro Password Reset Request",
			html: `<html>
            <head>
              <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; color: #333; }
                .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; border-top: 4px solid #007bff; }
                .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 20px; line-height: 1.6; }
                .button { display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; transition: background-color 0.3s; }
                .button:hover { background-color: #0056b3; }
                .footer { padding: 20px; font-size: 12px; text-align: center; background-color: #f4f4f9; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset</h1>
                </div>
                <div class="content">
                  <p>Hi User,</p>
                  <p>We've received a request to reset your password. Click the button below to set a new password:</p>
                  <a href="${resetURL}" class="button">Reset Password</a>
                  <p>This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>                  <p>Thank you for being a valued member of our community!</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>`,
			text: `Hi User,

      We've received a request to reset your password for your Gardenia account. 
      Click the link below to set a new password:
      
      ${resetURL}

      This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.

      Thank you for being a valued member of our community!

      &copy; ${new Date().getFullYear()} Gardenia. All rights reserved.
     `,
		};

		const email = new Email();

		const sendmail = await email.send(mailOptions);

		res.status(200).json(new APIResponse(200, "Password reset email sent"));
	} catch (error) {
		await deleteToken(token.id);

		throw new AppError(
			"There was an error sending the email. Try again later!",
			500,
		);
	}
};

export default forgotPassword;
