import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import { addProduct, getCart, removeItem, updateQuantity } from "./controllers";
import { CartSchema, UpdateQuantitySchema } from "./schemas";

const router = Router();

router.route("/").get(getCart).post(validateRequest(CartSchema), addProduct);

router
	.route("/:cartItemId")
	.put(validateRequest(UpdateQuantitySchema), updateQuantity)
	.delete(removeItem);
export default router;
