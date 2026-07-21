import { Server, Socket } from "socket.io";
import messageService from "../message/message.service.js";

export class SocketService {
  async handleSendMessage(
    io: Server,
    socket: Socket,
    data: { chatId: string; content: string }
  ) {
    const senderId = (socket as any)._id;
    const message = await messageService.sendMessage(data.chatId, senderId, data.content);

    // emit to everyone in the chat room, including sender (for multi-device sync)
    io.to(data.chatId).emit("newMessage", message);
  }

  async handleMarkAsRead(io: Server, socket: Socket, data: { chatId: string }) {
    const _id = (socket as any)._id;
    await messageService.markAsRead(data.chatId, _id);

    io.to(data.chatId).emit("messagesRead", { chatId: data.chatId, _id });
  }

  handleJoinChat(socket: Socket, chatId: string) {
    socket.join(chatId);
  }

  handleLeaveChat(socket: Socket, chatId: string) {
    socket.leave(chatId);
  }
}

export default new SocketService();