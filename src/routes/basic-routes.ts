import { type Request, type Response, Router } from "express";

const router = Router();

// Root route
router.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to our server!",
	});
});

// Health check route
router.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "The server is running smoothly.",
	});
});

export default router;
