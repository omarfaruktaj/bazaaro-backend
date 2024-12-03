import { authRoutes } from "@/api/auth";
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);

export default router;
