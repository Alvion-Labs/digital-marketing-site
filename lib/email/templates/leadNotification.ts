export interface LeadEmailData {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export function generateLeadNotificationHTML(data: LeadEmailData): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Submission - Alvion Digital</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #eef4fb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
    }
    .wrapper {
      width: 100%;
      padding: 32px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(148, 163, 184, 0.18);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #0b3a57 55%, #0891b2 100%);
      color: white;
      padding: 36px 40px;
      text-align: center;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 18px;
      padding: 14px 22px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.18);
      margin-bottom: 18px;
    }
    .brand img {
      display: block;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      object-fit: cover;
      background: white;
      margin-right: 10px;
    }
    .brand-text {
      text-align: left;
      line-height: 1.25;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 12px;
      opacity: 0.82;
      margin: 6px 0 0;
    }
    .title {
      margin: 0;
      font-size: 30px;
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 12px auto 0;
      max-width: 520px;
      font-size: 15px;
      line-height: 1.65;
      opacity: 0.92;
    }
    .content {
      padding: 34px 40px 40px;
    }
    .pill {
      display: inline-block;
      padding: 8px 14px;
      border-radius: 999px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .intro {
      font-size: 16px;
      line-height: 1.7;
      color: #334155;
      margin: 0 0 24px;
    }
    .info {
      background: linear-gradient(180deg, #f8fbff 0%, #f1f7ff 100%);
      border: 1px solid #dbeafe;
      border-left: 5px solid #0ea5e9;
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 16px;
    }
    .label {
      font-size: 12px;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }
    .value {
      font-size: 15px;
      color: #0f172a;
      word-break: break-word;
    }
    .message-box {
      background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 22px;
      margin-top: 10px;
      line-height: 1.8;
      color: #1e293b;
      white-space: normal;
    }
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px 40px 28px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
      line-height: 1.7;
    }
    .cta {
      display: inline-block;
      margin-top: 18px;
      padding: 12px 20px;
      border-radius: 999px;
      background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
      color: white !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
    }
    @media (max-width: 640px) {
      .header,
      .content,
      .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .title {
        font-size: 24px;
      }
      .brand {
        padding: 10px 14px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="brand">
          <img src="cid:alvion-logo" alt="Alvion Digital Marketing logo" />
          <div class="brand-text">
            <p class="brand-title">Alvion Digital Marketing</p>
            <p class="brand-subtitle">Lead Notification</p>
          </div>
        </div>
        <h1 class="title">New Lead Submission</h1>
        <p class="subtitle">A new inquiry has been submitted from your website. Review the details below and reply directly to the lead.</p>
      </div>

      <div class="content">
        <span class="pill">Website Lead</span>
        <p class="intro">Hello, you have received a new lead submission from your website. Here are the details:</p>

        <div class="info">
          <div class="label">Name</div>
          <div class="value">${safeName}</div>
        </div>

        <div class="info">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;font-weight:600;">${safeEmail}</a></div>
        </div>

        <div class="info">
          <div class="label">Submitted On</div>
          <div class="value">${escapeHtml(data.submittedAt)}</div>
        </div>

        <div class="label" style="margin-top: 22px;">Message</div>
        <div class="message-box">${safeMessage}</div>

        <a class="cta" href="mailto:${safeEmail}">Reply to Lead</a>
      </div>

      <div class="footer">
        <p style="margin: 0;">This email was automatically generated from your website contact form.</p>
        <p style="margin: 6px 0 0;">© ${new Date().getFullYear()} Alvion Digital Marketing</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (character) => map[character]);
}
