import { Router } from "express";
import chatController from "./chat.controller.js";

const router = Router();

router.post("/", chatController.createOrGetChat);
router.get("/", chatController.getUserChats);
router.get("/:id", chatController.getChatById);

export default router;
