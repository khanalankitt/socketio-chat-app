import { Server, Socket } from "socket.io";
import socketService from "./socket.service.js";
import userRepository from "../user/user.repository.js";
import { Types } from "mongoose";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  const _id = (socket as any)._id;
  const userObjectId = new Types.ObjectId(_id);

  // mark user online on connect
  userRepository.setPresence(userObjectId, {
    isOnline: true,
    socketId: socket.id,
  });

  socket.on("joinChat", (chatId: string) => {
    socketService.handleJoinChat(socket, chatId);
  });

  socket.on("leaveChat", (chatId: string) => {
    socketService.handleLeaveChat(socket, chatId);
  });

  socket.on(
    "sendMessage",
    async (data: { chatId: string; content: string }) => {
      try {
        await socketService.handleSendMessage(io, socket, data);
      } catch (err: any) {
        socket.emit("error", { message: err.message });
      }
    },
  );

  socket.on("markAsRead", async (data: { chatId: string }) => {
    try {
      await socketService.handleMarkAsRead(io, socket, data);
    } catch (err: any) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("disconnect", async () => {
    try {
      await userRepository.setPresence(userObjectId, {
        isOnline: false,
        socketId: null,
        lastSeen: new Date(),
      });

      // let other users know this person went offline
      socket.broadcast.emit("userOffline", { _id });
    } catch (err) {
      console.error("Error handling disconnect:", err);
    }
  });
};
