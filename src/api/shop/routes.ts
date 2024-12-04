import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	createShopController,
	deleteShopController,
	updateShopController,
} from "./controllers";
import { ShopSchema, UpdateShopSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.post(
		authorizeWithRoles("ADMIN", "CUSTOMER"),
		validateRequest(ShopSchema),
		createShopController,
	)
	.put(
		authorizeWithRoles("ADMIN", "CUSTOMER"),
		validateRequest(UpdateShopSchema),
		updateShopController,
	);

router
	.route("/:shopId")
	.delete(authorizeWithRoles("ADMIN", "CUSTOMER"), deleteShopController);

export default router;
