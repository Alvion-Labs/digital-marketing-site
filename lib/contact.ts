export const CONTACT_INFO = {
  whatsappPhone: '6230930041',
  whatsappTitle: 'WhatsApp',
  whatsappSubtitle: 'Chat with us directly',
  whatsappMessage:
    'Hi Alvion Digital! I visited your website and would like to discuss digital marketing services.',
  emailAddress: 'thakursureshkumar118@gmail.com',
  emailTitle: 'Email',
  emailSubject: 'Inquiry from Alvion Digital website',
  emailBody: 'Hi Alvion Digital,\n\nI would like to discuss your digital marketing services.',
} as const;

export const WHATSAPP_LINK = `https://wa.me/${CONTACT_INFO.whatsappPhone}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`;

export const MAILTO_LINK = `mailto:${CONTACT_INFO.emailAddress}?subject=${encodeURIComponent(CONTACT_INFO.emailSubject)}&body=${encodeURIComponent(CONTACT_INFO.emailBody)}`;
