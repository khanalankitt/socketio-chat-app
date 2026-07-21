import { Router } from "express";
import userController from "./user.controller.js";

const router = Router();

router.get("/me", userController.getProfile);
router.get("/search", userController.searchUsers);
router.get("/:id", userController.getUserById);
router.patch("/me", userController.updateProfile);

export default router;