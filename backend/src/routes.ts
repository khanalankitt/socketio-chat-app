import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import messageRoutes from "./modules/message/message.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/message", authenticate, messageRoutes);
router.use("/user", authenticate, userRoutes);
router.use("/chat", authenticate, chatRoutes);

export default router;
