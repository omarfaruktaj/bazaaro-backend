import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import { loginController, registerController } from "./controllers";
import { RegisterSchema, loginSchema } from "./schemas";

const router = Router();

router.post("/register", validateRequest(RegisterSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);

export default router;
