import type { NextFunction, Request, Response } from "express";
import messageService from "./message.service.js";
export class MessageController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, content } = req.body;
      const senderId = (req as any)._id;

      const message = await messageService.sendMessage(
        chatId,
        senderId,
        content,
      );
      res.status(201).json(message);
    } catch (err: any) {
      next(err);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const requesterId = (req as any)._id;

      const messages = await messageService.getMessages(
        String(chatId),
        requesterId,
      );
      res.status(200).json(messages);
    } catch (err: any) {
      next(err);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const _id = (req as any)._id;

      const result = await messageService.markAsRead(String(chatId), _id);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }
}

export default new MessageController();
