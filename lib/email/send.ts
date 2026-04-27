// @ts-ignore - nodemailer types issue
import nodemailer from 'nodemailer';

interface EmailConfig {
  provider: 'gmail' | 'smtp';
  from: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  gmailUser?: string;
  gmailPassword?: string;
}

function env(key: string): string | undefined {
  return process.env[key];
}

function getEmailConfig(): EmailConfig {
  const providerFromEnv = env('EMAIL_PROVIDER')?.toLowerCase();
  const hasGmailCreds = Boolean(env('GMAIL_USER') && env('GMAIL_APP_PASSWORD'));
  const provider: 'gmail' | 'smtp' = providerFromEnv === 'gmail' || (hasGmailCreds && !env('SMTP_HOST'))
    ? 'gmail'
    : 'smtp';

  if (provider === 'gmail') {
    return {
      provider: 'gmail',
      from: env('EMAIL_FROM') || '',
      gmailUser: env('GMAIL_USER'),
      gmailPassword: env('GMAIL_APP_PASSWORD'),
    };
  }

  return {
    provider: 'smtp',
    from: env('EMAIL_FROM') || '',
    smtpHost: env('SMTP_HOST'),
    smtpPort: parseInt(env('SMTP_PORT') || '587', 10),
    smtpUser: env('SMTP_USER'),
    smtpPassword: env('SMTP_PASSWORD'),
  };
}

async function createTransporter() {
  const config = getEmailConfig();

  if (config.provider === 'gmail') {
    if (!config.gmailUser || !config.gmailPassword) {
      throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment variables.');
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmailUser,
        pass: config.gmailPassword,
      },
    });
  }

  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
    throw new Error('Missing SMTP configuration in environment variables.');
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    cid?: string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = getEmailConfig();

  if (!config.from) {
    throw new Error('Missing EMAIL_FROM in environment variables.');
  }

  const transporter = await createTransporter();

  await transporter.sendMail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
}
