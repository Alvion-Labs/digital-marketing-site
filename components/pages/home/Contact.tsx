'use client';

import { useState } from 'react';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { CheckIcon, EnvelopeIcon, LoadingSpinnerIcon, WhatsAppIcon } from '@/components/global/icons';
import { CONTACT_INFO, GMAIL_COMPOSE_LINK, WHATSAPP_LINK } from '@/lib/contact';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!values.message.trim()) errors.message = 'Message is required';
  else if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || 'Failed to submit your message.');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-[#0d2d47] border ${
      errors[field] ? 'border-red-500' : 'border-white/10'
    } rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-accent-from focus:ring-1 focus:ring-accent-from transition-colors duration-200`;

  return (
    <section id="contact" className="py-24 bg-[#061c2e]">
      <Container>
        <div className="text-center mb-16">
          <span className="text-accent-to text-sm font-semibold uppercase tracking-widest">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5">
            Get In Touch
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Ready to grow your digital presence? Let&apos;s talk about your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-[#0d2d47] rounded-2xl p-8 border border-white/5">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
                  <CheckIcon className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm mb-6">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <Button variant="secondary" onClick={() => setStatus('idle')}>
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={5}
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{submitError || 'Something went wrong. Please try again.'}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading'}
                  className="w-full py-4 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinnerIcon className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Other Ways to Reach Us</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We&apos;re available Monday–Friday, 9am–6pm. Reach out via WhatsApp for the fastest response.
              </p>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#0d2d47] border border-white/5 hover:border-green-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500/30 transition-colors">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{CONTACT_INFO.whatsappTitle}</p>
                <p className="text-slate-400 text-sm">{CONTACT_INFO.whatsappSubtitle}</p>
              </div>
            </a>

            <a
              href={GMAIL_COMPOSE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#0d2d47] border border-white/5 hover:border-accent-from/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-from/20 flex items-center justify-center text-accent-to group-hover:bg-accent-from/30 transition-colors">
                <EnvelopeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{CONTACT_INFO.emailTitle}</p>
                <p className="text-slate-400 text-sm">{CONTACT_INFO.emailAddress}</p>
              </div>
            </a>
          </div>
        </div>

      </Container>
    </section>
  );
}
