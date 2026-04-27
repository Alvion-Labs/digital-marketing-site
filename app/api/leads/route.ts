import { readFile } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import LeadModel from '@/lib/models/Lead';
import { sendEmail } from '@/lib/email/send';
import { generateLeadNotificationHTML } from '@/lib/email/templates/leadNotification';

type LeadPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePayload(payload: LeadPayload) {
  return {
    name: payload.name?.trim() ?? '',
    email: payload.email?.trim().toLowerCase() ?? '',
    message: payload.message?.trim() ?? '',
  };
}

export async function POST(request: Request) {
  try {
    const rawBody = (await request.json()) as LeadPayload;
    const { name, email, message } = normalizePayload(rawBody);

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (message.length < 10) {
      return Response.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const lead = await LeadModel.create({
      name,
      email,
      message,
      source: 'website',
      status: 'new',
    });

    const recipientEmail = process.env.CONTACT_EMAIL_RECIPIENT;
    if (recipientEmail) {
      const submittedAt = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: process.env.TIMEZONE || 'UTC',
      });

      const emailHTML = generateLeadNotificationHTML({
        name,
        email,
        message,
        submittedAt,
      });

      const logoPath = join(process.cwd(), 'public', 'AlvionLogo.png');
      const logoBuffer = await readFile(logoPath);

      try {
        await sendEmail({
          to: recipientEmail,
          subject: `New Lead Submission from ${name}`,
          html: emailHTML,
          replyTo: email,
          attachments: [
            {
              filename: 'alvion-logo.png',
              content: logoBuffer,
              cid: 'alvion-logo',
              contentType: 'image/png',
            },
          ],
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    return Response.json(
      {
        success: true,
        id: String(lead._id),
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected server error.';

    return Response.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
