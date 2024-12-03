import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import { registerController } from "./controllers";
import { RegisterSchema } from "./schemas";

const router = Router();

router.post("/register", validateRequest(RegisterSchema), registerController);

export default router;
