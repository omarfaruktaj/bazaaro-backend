import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	blacklistShopController,
	createShopController,
	deleteShopController,
	findAll,
	getProductsController,
	updateShopController,
} from "./controllers";
import getVendorProfile from "./controllers/get-vendor-profile";
import { ShopSchema, UpdateShopSchema } from "./schemas";

const router = Router();

router.get("/profile", authorizeWithRoles("VENDOR"), getVendorProfile);

router.get("/products", authorizeWithRoles("VENDOR"), getProductsController);

router
	.route("/")
	.get(authorizeWithRoles("ADMIN"), findAll)
	.post(
		authorizeWithRoles("VENDOR"),
		validateRequest(ShopSchema),
		createShopController,
	);

router
	.route("/:shopId")
	.put(
		authorizeWithRoles("VENDOR"),
		validateRequest(UpdateShopSchema),
		updateShopController,
	)
	.delete(authorizeWithRoles("VENDOR", "ADMIN"), deleteShopController);

router.put(
	"/:shopId/blacklist",
	authorizeWithRoles("ADMIN"),
	blacklistShopController,
);

export default router;
