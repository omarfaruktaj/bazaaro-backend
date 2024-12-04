import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import { createShopController } from "./controllers";
import { ShopSchema } from "./schemas";

const router = Router();

router.post(
	"/",
	authorizeWithRoles("ADMIN", "CUSTOMER"),
	validateRequest(ShopSchema),
	createShopController,
);

export default router;
