import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { LoginInput } from "../validators/auth.validator.js";

export class AuthService {
  static async login(data: LoginInput) {
    const adminUsername = process.env.ADMIN_USERNAME!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    if (data.username !== adminUsername) {
      throw new Error("Invalid username or password");
    }

    const isValid = await bcrypt.compare(
      data.password,
      adminPassword
    );

    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      {
        username: adminUsername,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
    };
  }
}