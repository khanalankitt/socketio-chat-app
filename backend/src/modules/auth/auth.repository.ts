import User, { type IUser } from "../../models/user.model.js";

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }
}

export default new AuthRepository();
