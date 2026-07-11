import { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";
import { ZodError } from "zod";

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await AuthService.login(data);

    return res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
}