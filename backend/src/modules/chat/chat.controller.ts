import type { Request, Response, NextFunction } from "express";
import chatService from "./chat.service.js";

export class ChatController {
  async createOrGetChat(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = (req as any)._id;
      const { other_id } = req.body;
      console.log(_id, other_id);

      const chat = await chatService.createOrGetChat(_id, other_id);
      res.status(200).json(chat);
    } catch (err) {
      next(err);
    }
  }

  async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = (req as any)._id;
      const chats = await chatService.getUserChats(_id);
      res.status(200).json(chats);
    } catch (err) {
      next(err);
    }
  }

  async getChatById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const _id = (req as any)._id;

      const chat = await chatService.getChatById(String(id), _id);
      res.status(200).json(chat);
    } catch (err) {
      next(err);
    }
  }
}

export default new ChatController();
