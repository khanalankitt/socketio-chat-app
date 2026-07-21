import { Types } from "mongoose";
import messageRepository from "./message.repository.js";
import Chat from "../../models/chat.model.js";

export class MessageService {
  async sendMessage(chatId: string, senderId: string, content: string) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    const isParticipant = chat.participants.some(
      (p) => p.toString() === senderId,
    );
    if (!isParticipant) throw new Error("Not a participant of this chat");

    const message = await messageRepository.create({
      chat: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(senderId),
      content,
    });

    chat.lastMessage = message._id;
    await chat.save();

    return message.populate("sender", "username avatar");
  }

  async getMessages(chatId: string, requesterId: string) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    const isParticipant = chat.participants.some(
      (p) => p.toString() === requesterId,
    );
    if (!isParticipant) throw new Error("Not a participant of this chat");

    return messageRepository.findByChat(new Types.ObjectId(chatId));
  }

  async markAsRead(chatId: string, _id: string) {
    await messageRepository.markAsRead(
      new Types.ObjectId(chatId),
      new Types.ObjectId(_id),
    );
    return { message: "Messages marked as read" };
  }
}

export default new MessageService();
