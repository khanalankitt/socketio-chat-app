import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
dotenv.config();

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signToken = (_id: string) => {
  return jwt.sign({ sub: _id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
