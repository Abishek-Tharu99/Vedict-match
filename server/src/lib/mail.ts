import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"Su AI Hustle Contact" <${"hackerheaven73@gmail.com"}>`,
    to: "tegc hzvr dzpb ijdx",
    replyTo: data.email,
    subject: `New Contact: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${data.name}</p>

      <p><strong>Email:</strong> ${data.email}</p>

      <p><strong>Subject:</strong> ${data.subject}</p>

      <hr />

      <p>${data.message}</p>
    `,
  });
}