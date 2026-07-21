import type { Request, Response, NextFunction } from "express";
import userService from "./user.service.js";

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = (req as any)._id;
      const user = await userService.getProfile(_id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(String(id));
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = (req as any)._id;
      const query = (req.query.q as string) ?? "";
      const users = await userService.searchUsers(query, requesterId);
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = (req as any)._id;
      const { username, avatar } = req.body;
      const updated = await userService.updateProfile(_id, {
        username,
        avatar,
      });
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
