import { cleanEnv, num, str } from "envalid";

export const envConfig = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ["development", "production", "test"],
		default: "development",
	}),
	PORT: num({ default: 5000 }),
	ACCESS_TOKEN_SECRET: str(),
	REFRESH_TOKEN_SECRET: str(),
	EMAIL_HOST: str(),
	EMAIL_PORT: str(),
	EMAIL_USERNAME: str(),
	EMAIL_PASSWORD: str(),
	EMAIL_FROM: str(),
	SENDER_EMAIL: str(),
	SENDER_APP_PASSWORD: str(),
});
