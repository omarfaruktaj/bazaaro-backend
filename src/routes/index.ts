import { authRoutes } from "@/api/auth";
import { categoryRoutes } from "@/api/category";
import { productRoutes } from "@/api/product";
import { shopRoutes } from "@/api/shop";
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router;
