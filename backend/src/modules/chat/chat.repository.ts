import Chat, { type IChat } from "../../models/chat.model.js";
import { Types } from "mongoose";

export class ChatRepository {
  async findExistingChat(
    _id: Types.ObjectId,
    otherUserId: Types.ObjectId,
  ): Promise<IChat | null> {
    return Chat.findOne({
      participants: { $all: [_id, otherUserId], $size: 2 },
    });
  }

  async create(participants: Types.ObjectId[]): Promise<IChat> {
    return Chat.create({ participants });
  }

  async findByUser(_id: Types.ObjectId): Promise<IChat[]> {
    return Chat.find({ participants: _id })
      .sort({ updatedAt: -1 }) // most recently active chat first
      .populate("participants", "username avatar isOnline lastSeen")
      .populate("lastMessage");
  }

  async findById(chatId: Types.ObjectId): Promise<IChat | null> {
    return Chat.findById(chatId)
      .populate("participants", "username avatar isOnline lastSeen")
      .populate("lastMessage");
  }
}

export default new ChatRepository();
