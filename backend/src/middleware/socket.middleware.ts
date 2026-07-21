import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

const parseCookie = (cookieHeader: string, key: string): string | undefined => {
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${key}=`))
    ?.split("=")[1];
};

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new Error("No cookie found"));

    const token = parseCookie(rawCookie, "token");
    if (!token) return next(new Error("No token found"));

    const payload = verifyToken(token);
    (socket as any)._id = payload.sub;

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};
