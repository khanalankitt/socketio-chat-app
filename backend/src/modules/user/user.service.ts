import { Types } from "mongoose";
import userRepository from "./user.repository.js";

export class UserService {
  async getProfile(_id: string) {
    const user = await userRepository.findById(new Types.ObjectId(_id));
    if (!user) throw new Error("User not found");
    return user;
  }

  async getUserById(targetId: string) {
    const user = await userRepository.findById(new Types.ObjectId(targetId));
    if (!user) throw new Error("User not found");
    return user;
  }

  async searchUsers(query: string, requesterId: string) {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query cannot be empty");
    }
    return userRepository.searchByUsername(
      query.trim(),
      new Types.ObjectId(requesterId),
    );
  }

  async updateProfile(
    _id: string,
    data: { username?: string; avatar?: string },
  ) {
    const updated = await userRepository.updateProfile(
      new Types.ObjectId(_id),
      data,
    );
    if (!updated) throw new Error("User not found");
    return updated;
  }
}

export default new UserService();
