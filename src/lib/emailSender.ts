import nodemailer from 'nodemailer';
import { Buffer } from 'buffer'; // Explicitly import Buffer

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
  secure: (process.env.EMAIL_SERVER_PORT === '465'), // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // Add TLS options if needed, e.g., ignore self-signed certs in dev
  // tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string; // Plain text version
  html: string; // HTML version
  attachments?: { filename: string; content: Buffer; contentType: string }[];
}

export async function sendEmail({ to, subject, text, html, attachments }: EmailOptions): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender address
    to: to, // List of receivers
    subject: subject, // Subject line
    text: text, // Plain text body
    html: html, // HTML body
    attachments: attachments,
  };

  try {
    console.log(`Sending email to ${to} with subject: ${subject}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Only with ethereal email
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Implement retry logic or better error handling as needed
  }
}