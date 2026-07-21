import { Types } from "mongoose";
import chatRepository from "./chat.repository.js";

export class ChatService {
  async createOrGetChat(_id: string, otherUserId: string) {
    if (_id === otherUserId) {
      throw new Error("Cannot create a chat with yourself");
    }

    const userObjectId = new Types.ObjectId(_id);
    const otherObjectId = new Types.ObjectId(otherUserId);

    const existing = await chatRepository.findExistingChat(
      userObjectId,
      otherObjectId,
    );
    if (existing) return existing;

    return chatRepository.create([userObjectId, otherObjectId]);
  }

  async getUserChats(_id: string) {
    return chatRepository.findByUser(new Types.ObjectId(_id));
  }

  async getChatById(chatId: string, requesterId: string) {
    const chat = await chatRepository.findById(new Types.ObjectId(chatId));
    if (!chat) throw new Error("Chat not found");

    const isParticipant = chat.participants.some(
      (p: any) => p._id.toString() === requesterId,
    );
    if (!isParticipant) throw new Error("Not a participant of this chat");

    return chat;
  }
}

export default new ChatService();
