import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import {
	ChangeStatus,
	deleteItem,
	findAll,
	getMeController,
	updateProfile,
} from "./controllers";
import { ProfileSchema } from "./schemas";

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
router.put(
	"/me",
	authorizeWithRoles(UserRoles.ADMIN, UserRoles.VENDOR, UserRoles.CUSTOMER),
	validateRequest(ProfileSchema),
	updateProfile,
);

router.route("/").get(authorizeWithRoles("ADMIN"), findAll);

router.route("/:userId").delete(authorizeWithRoles("ADMIN"), deleteItem);

export default router;
