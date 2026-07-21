import User, { type IUser } from "../../models/user.model.js";
import { Types } from "mongoose";

export class UserRepository {
  async findById(id: Types.ObjectId): Promise<IUser | null> {
    return User.findById(id);
  }

  async searchByUsername(
    query: string,
    excludeId: Types.ObjectId,
  ): Promise<IUser[]> {
    return User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: excludeId },
    }).select("username avatar isOnline lastSeen");
  }

  async updateProfile(
    id: Types.ObjectId,
    data: Partial<Pick<IUser, "username" | "avatar">>,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new UserRepository();
