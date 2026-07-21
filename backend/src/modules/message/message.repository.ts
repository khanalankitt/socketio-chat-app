import Message, { type IMessage } from "../../models/message.model.js";
import { Types } from "mongoose";

export class MessageRepository {
  async create(data: {
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
  }): Promise<IMessage> {
    return Message.create(data);
  }

  async findByChat(chatId: Types.ObjectId): Promise<IMessage[]> {
    return Message.find({ chat: chatId })
      .sort({ createdAt: 1 }) // oldest first, natural chat order
      .populate("sender", "username avatar");
  }

  async markAsRead(
    chatId: Types.ObjectId,
    _id: Types.ObjectId,
  ): Promise<void> {
    await Message.updateMany(
      { chat: chatId, sender: { $ne: _id }, isRead: false },
      { $set: { isRead: true } },
    );
  }

  async findById(messageId: Types.ObjectId): Promise<IMessage | null> {
    return Message.findById(messageId);
  }
}

export default new MessageRepository();
