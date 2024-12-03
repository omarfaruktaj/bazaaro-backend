import { cleanEnv, num, str } from "envalid";

export const envConfig = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ["development", "production", "test"],
		default: "development",
	}),
	PORT: num({ default: 5000 }),
	ACCESS_TOKEN_SECRET: str(),
	REFRESH_TOKEN_SECRET: str(),
});
