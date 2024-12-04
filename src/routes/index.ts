import { authRoutes } from "@/api/auth";
import { shopRoutes } from "@/api/shop";
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);

export default router;
