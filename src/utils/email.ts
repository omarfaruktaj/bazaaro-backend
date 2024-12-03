import { envConfig } from "@/config";
import nodemailer from "nodemailer";

interface EmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export class Email {
	newTransporter() {
		if (envConfig.NODE_ENV === "production") {
			return nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				tls: {
					rejectUnauthorized: false,
				},
				auth: {
					user: envConfig.SENDER_EMAIL,
					pass: envConfig.SENDER_APP_PASSWORD,
				},
			});
		}

		return nodemailer.createTransport({
			host: envConfig.EMAIL_HOST,
			port: Number(envConfig.EMAIL_PORT),
			secure: false,
			auth: {
				user: envConfig.EMAIL_USERNAME,
				pass: envConfig.EMAIL_PASSWORD,
			},
		});
	}

	async send(options: EmailOptions) {
		const { to, subject, html, text } = options;

		const mailOptions = {
			to,
			subject,
			html,
			text,
			from: `Bazaaro <${envConfig.EMAIL_FROM}>`,
		};

		const info = await this.newTransporter().sendMail(mailOptions);
		console.log("Message sent: %s", info);
		console.log(nodemailer.getTestMessageUrl(info));
	}
}
