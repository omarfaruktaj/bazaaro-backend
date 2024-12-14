import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import authorizeWithRoles from "./../../middlewares/authorize-with-roles";
import { addProduct, getCart, removeItem, updateQuantity } from "./controllers";
import { CartSchema, UpdateQuantitySchema } from "./schemas";

const router = Router();

router
	.route("/")
	.get(authorizeWithRoles("VENDOR", "ADMIN", "CUSTOMER"), getCart)
	.post(
		authorizeWithRoles("VENDOR", "ADMIN", "CUSTOMER"),
		validateRequest(CartSchema),
		addProduct,
	);

router
	.route("/:cartItemId")
	.put(
		authorizeWithRoles("VENDOR", "ADMIN", "CUSTOMER"),
		validateRequest(UpdateQuantitySchema),
		updateQuantity,
	)
	.delete(authorizeWithRoles("VENDOR", "ADMIN", "CUSTOMER"), removeItem);
export default router;
