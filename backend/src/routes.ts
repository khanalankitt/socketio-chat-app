import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import messageRoutes from "./modules/message/message.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/message", messageRoutes);
router.use("/user", userRoutes);

export default router;
