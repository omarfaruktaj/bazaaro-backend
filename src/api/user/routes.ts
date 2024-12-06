import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import { Router } from "express";
import { deleteItem, findAll, suspend } from "./controllers";

const router = Router();

router.route("/").get(authorizeWithRoles("ADMIN"), findAll);

router
	.route("/:userId")
	.put(authorizeWithRoles("ADMIN"), suspend)
	.delete(authorizeWithRoles("ADMIN"), deleteItem);

export default router;
