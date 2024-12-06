import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	blacklistShopController,
	createShopController,
	deleteShopController,
	findAll,
	updateShopController,
} from "./controllers";
import { ShopSchema, UpdateShopSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.get(authorizeWithRoles("ADMIN"), findAll)
	.post(
		authorizeWithRoles("VENDOR"),
		validateRequest(ShopSchema),
		createShopController,
	)
	.put(
		authorizeWithRoles("VENDOR"),
		validateRequest(UpdateShopSchema),
		updateShopController,
	);

router
	.route("/:shopId")
	.put(authorizeWithRoles("ADMIN"), blacklistShopController)
	.delete(authorizeWithRoles("VENDOR", "ADMIN"), deleteShopController);

export default router;
