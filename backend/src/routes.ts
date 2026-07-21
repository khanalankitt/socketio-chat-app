import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import messageRoutes from "./modules/message/message.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/message", messageRoutes);

export default router;
