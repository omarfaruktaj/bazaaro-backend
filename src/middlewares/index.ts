import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
const applyMiddleware = (app: Express) => {
	app.use(helmet());
	app.use(cors());
	app.use(morgan("dev"));
	app.use(express.json());
	app.use(cookieParser());
	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000,
			limit: 1000,
			message: "Too many requests, please try again later.",
		}),
	);
};

export default applyMiddleware;
