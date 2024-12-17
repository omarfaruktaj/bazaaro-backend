import { authRoutes } from "@/api/auth";
import { cartRoutes } from "@/api/cart";
import { categoryRoutes } from "@/api/category";
import { couponRoutes } from "@/api/coupon";
import { orderRoutes } from "@/api/order";
import { paymentRoutes } from "@/api/payment";
import { productRoutes } from "@/api/product";
import { reviewRoutes } from "@/api/review";
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
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);

export default router;
