import bcrypt from "bcrypt";
import authRepository from "./auth.repository.js";
import { signToken } from "../../utils/jwt.js";

export class AuthService {
  async register(username: string, email: string, userPassword: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userFound = await authRepository.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = signToken(userFound._id.toString());
    const { password, ...user } = userFound.toObject();
    return { token, user };
  }

  async login(email: string, userPassword: string) {
    const userFound = await authRepository.findByEmail(email);
    if (!userFound) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(userPassword, userFound.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = signToken(userFound._id.toString());
    const { password, ...user } = userFound.toObject();
    return { token, user };
  }
}

export default new AuthService();
