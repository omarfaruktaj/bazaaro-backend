import { authRoutes } from "@/api/auth";
import { cartRoutes } from "@/api/cart";
import { categoryRoutes } from "@/api/category";
import { productRoutes } from "@/api/product";
import { shopRoutes } from "@/api/shop";
import { userRoutes } from "@/api/user";
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);

export default router;
