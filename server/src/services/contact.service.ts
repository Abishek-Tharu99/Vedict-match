import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";
import { sendContactEmail } from "../lib/mail.js";

type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export class ContactService {
  static async create(data: ContactInput) {

    // Save into Neon
    const [contact] = await db
      .insert(contacts)
      .values(data)
      .returning();

    // Send Email
    await sendContactEmail(data);

    return contact;
  }
}