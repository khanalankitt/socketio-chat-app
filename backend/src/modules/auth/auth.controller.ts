import type { Request, Response } from "express";
import authService from "./auth.service.js";
import { COOKIE_OPTIONS } from "../../utils/cookieOptions.js";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const { token, user } = await authService.register(
        username,
        email,
        password,
      );
      res.cookie("token", token, COOKIE_OPTIONS);
      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.cookie("token", token, COOKIE_OPTIONS);
      res.status(200).json({ user });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token", COOKIE_OPTIONS);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new AuthController();
