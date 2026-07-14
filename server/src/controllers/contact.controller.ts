import { Request, Response } from "express";
import { ZodError } from "zod";

import { contactSchema } from "../validators/contact.validator.js";
import { ContactService } from "../services/contact.service.js";

export async function createContact(
  req: Request,
  res: Response
) {
  try {
    const data = contactSchema.parse(req.body);

    const contact = await ContactService.create(data);

    return res.status(201).json({
      message: "Message sent successfully.",
      contact,
    });

  } catch (error) {

    if (error instanceof ZodError) {
        
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}