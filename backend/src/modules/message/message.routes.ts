import { Router } from "express";
import messageController from "./message.controller.js";
const router = Router();

router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.getMessages);
router.patch("/:chatId/read", messageController.markAsRead);

export default router;
