'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/global/Button';
import { CheckIcon, LoadingSpinnerIcon } from '@/components/global/icons';
import {
  FeedbackFieldError,
  FeedbackFieldLabel,
  FeedbackTextarea,
  FeedbackTextInput,
} from '@/components/pages/blog/FeedbackFormFields';

interface BlogRatingComponentProps {
  blogId: string;
}

export default function BlogRatingComponent({ blogId }: BlogRatingComponentProps) {
  const [rating, setRating] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [errors, setErrors] = useState<{ rating?: string; email?: string; submit?: string }>({});

  useEffect(() => {
    if (isSubmitted) {
      // small timeout so initial render applies 'hidden' state and transition animates
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors: { rating?: string; email?: string } = {};

    if (rating === 0) {
      nextErrors.rating = 'Please select a star rating before submitting.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/blog-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          email: email.trim(),
          rating,
          suggestion: suggestion.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rating');
      }

      setIsSubmitted(true);
      setRating(0);
      setEmail('');
      setSuggestion('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Note: we no longer early-return when submitted. Instead the success panel
  // is rendered as an absolute overlay above the form so the form's height
  // remains in the document flow and layout doesn't jump.

  return (
    <section className="relative my-16 border-t border-gray-200 py-12">
      <div className="mb-6">
        <div className="inline-block mb-1">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-accent-from/20 text-accent-to text-xs font-semibold uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-accent-from to-accent-to" aria-hidden="true" />
            Feedback
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-bold text-gray-900">Rate this article</h3>
        <p className="mt-1 text-gray-600">Share a quick rating and suggestion to help us improve upcoming posts.</p>
      </div>

      {errors.submit && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errors.submit}
        </div>
      )}

      {isSubmitted && (
          <div className={`${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out z-10 bg-white/80 backdrop-blur-sm pointer-events-auto rounded-2xl p-4`}> 
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">🎉 Submitted Successfully! 🥳</h3>
              <p className="text-sm text-gray-600 mb-3">Thank you for your suggestion, it will help us a lot.</p>
              <Button variant="secondary" onClick={() => setIsSubmitted(false)} className="inline-flex">
                Submit another suggestion
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="pb-1">
              <p className="block text-sm font-medium text-gray-700 mb-1.5">Star rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoveredStar || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className={`rounded-lg p-1.5 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-from/40 ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <svg
                        className="h-9 w-9 transition-transform duration-200"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient id={`star-gradient-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-from)" />
                            <stop offset="100%" stopColor="var(--accent-to)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          fill={active ? `url(#star-gradient-${star})` : '#d1d5db'}
                          stroke={active ? 'var(--accent-from)' : '#9ca3af'}
                          strokeWidth="1"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You selected <span className="font-semibold text-gray-900">{rating} / 5</span>
                </p>
              )}
              <FeedbackFieldError message={errors.rating} />
            </div>

            <div>
              <FeedbackFieldLabel htmlFor="email">Email Address</FeedbackFieldLabel>
              <FeedbackTextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="your.email@example.com"
                required
                disabled={isSubmitted}
                hasError={Boolean(errors.email)}
              />
              <FeedbackFieldError message={errors.email} />
            </div>
          </div>

          <div className="md:col-span-1">
            <FeedbackFieldLabel htmlFor="suggestion">Your Suggestion (Optional)</FeedbackFieldLabel>
            <FeedbackTextarea
              id="suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value.substring(0, 5000))}
              placeholder="Tell us what you think we could improve..."
              maxLength={5000}
              rows={6}
              disabled={isSubmitted}
            />
            <p className="mt-1 text-xs text-gray-500">
              {suggestion.length} / 5000 characters
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-1">
          <p className="text-xs text-gray-500 text-center sm:text-left">We use your feedback only to improve content quality.</p>
          <div className="w-full sm:w-auto">
            <Button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              variant="primary"
              size="lg"
              className="w-full min-w-0 hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinnerIcon className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
