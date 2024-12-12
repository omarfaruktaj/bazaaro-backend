import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import {
	ChangeStatus,
	deleteItem,
	findAll,
	getMeController,
} from "./controllers";

const router = Router();
router.patch(
	"/change-status/:userId",
	authorizeWithRoles("ADMIN"),
	ChangeStatus,
);

router.get(
	"/me",
	authorizeWithRoles(UserRoles.ADMIN, UserRoles.VENDOR, UserRoles.CUSTOMER),
	getMeController,
);
router.route("/").get(authorizeWithRoles("ADMIN"), findAll);

router.route("/:userId").delete(authorizeWithRoles("ADMIN"), deleteItem);

export default router;
