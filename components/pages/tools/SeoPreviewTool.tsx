'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import Container from '@/components/global/Container';

type DeviceView = 'desktop' | 'mobile';

const DEFAULT_TITLE = 'Digital Marketing Agency for Growth-Focused Brands';
const DEFAULT_DESCRIPTION =
  'Preview how your title and description may appear in Google results before publishing, so your team can review the snippet with confidence.';
const TITLE_TARGET = '40-58 chars';
const DESCRIPTION_TARGET = '120-141 chars';

function clampText(value: string, limit: number) {
  const text = value.trim();
  if (text.length <= limit) return text;

  // Find the last space before or at the limit
  const truncated = text.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace === -1) return `${truncated}…`;

  // Find the full word at the truncation boundary
  const nextSpace = text.indexOf(' ', limit);
  const word = nextSpace === -1 ? text.slice(lastSpace + 1) : text.slice(lastSpace + 1, nextSpace);
  const wordPositionInTruncated = truncated.length - lastSpace - 1;
  const wordMidpoint = word.length / 2;

  let result;
  if (wordPositionInTruncated < wordMidpoint) {
    // Cut the word — end at previous word boundary
    result = text.slice(0, lastSpace);
  } else {
    // Keep the whole word
    const wordEnd = nextSpace === -1 ? text.length : nextSpace;
    result = text.slice(0, wordEnd);
    if (result.length > limit * 1.3) {
      result = text.slice(0, lastSpace);
    }
  }

  // Only add ellipsis if the result is shorter than the original text
  if (result.length < text.length) {
    return `${result} …`;
  }
  return result;
}

function getFitInfo(length: number) {
  if (length === 0) return { label: 'Empty', color: 'text-gray-400' };
  if (length < 40) return { label: 'Short', color: 'text-amber-600' };
  if (length > 58) return { label: 'Too long', color: 'text-red-500' };
  return { label: 'Good', color: 'text-emerald-600' };
}

function getDescFitInfo(length: number) {
  if (length === 0) return { label: 'Empty', color: 'text-gray-400' };
  if (length < 120) return { label: 'Short', color: 'text-amber-600' };
  if (length > 141) return { label: 'Too long', color: 'text-red-500' };
  return { label: 'Good', color: 'text-emerald-600' };
}

export default function SeoPreviewTool() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [device, setDevice] = useState<DeviceView>('desktop');

  const titleLength = Array.from(title.trim()).length;
  const descriptionLength = Array.from(description.trim()).length;
  const titleFit = getFitInfo(titleLength);
  const descFit = getDescFitInfo(descriptionLength);

  const isLongTitle = titleLength > 58;
  const isLongDesc = descriptionLength > 141;

  const allGood = useMemo(
    () => titleFit.label === 'Good' && descFit.label === 'Good',
    [titleFit.label, descFit.label],
  );

  const titleDesktopLimit = 58;
  const descDesktopLimit = 141;
  const titleMobileLimit = 78; // Allow ~2 lines on mobile (approx 39 chars per line)
  const descMobileLimit = 110;

  const titleLimit = device === 'mobile' ? titleMobileLimit : titleDesktopLimit;
  const descLimit = device === 'mobile' ? descMobileLimit : descDesktopLimit;

  return (
    <section className="bg-white">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 h-8 px-4 rounded-full border border-[#1a1054]/10 bg-[#1a1054]/5 text-sm font-medium text-[#1a1054]">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#1a1054] to-[#255ff1] shadow-[0_0_0_4px_rgba(37,95,241,0.12)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">SEO Preview Tool</span>
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl md:text-5xl">
              100% Match: Free Google Search Result Preview Tool
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Test your SEO title and meta description in a desktop or mobile SERP preview, then tune the length, clarity, and click appeal before the page goes live.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start lg:order-none">
            <div className="space-y-6 min-w-0 order-2 lg:order-none">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit" aria-label="Preview device">
                  <button
                    type="button"
                    aria-pressed={device === 'desktop'}
                    onClick={() => setDevice('desktop')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      device === 'desktop'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    aria-pressed={device === 'mobile'}
                    onClick={() => setDevice('mobile')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      device === 'mobile'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mobile
                  </button>
                </div>

                <Image
                  src={allGood ? '/icons/Green check Icon.webp' : '/icons/Gray check Icon.webp'}
                  alt={allGood ? 'All good' : 'Needs attention'}
                  width={28}
                  height={28}
                  className="w-7 h-7 transition-opacity duration-500"
                />
              </div>

              <div>
                <label className="block">
                  <span className="text-base font-semibold text-gray-900">Page title</span>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    rows={2}
                    placeholder="Enter your SEO title"
                    aria-describedby="seo-title-guidance"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#255ff1]/40 focus:ring-4 focus:ring-[#255ff1]/10 resize-none"
                  />
                </label>
                <div id="seo-title-guidance" className="mt-2 flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Image
                      src={titleFit.label === 'Good' ? '/icons/Green check Icon.webp' : '/icons/Gray check Icon.webp'}
                      alt=""
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                    <span className={titleFit.color}>{titleFit.label}</span>
                  </span>
                  <span className="text-right text-gray-400">{titleLength} / {TITLE_TARGET}</span>
                </div>
                {isLongTitle && (
                  <p className="mt-1 text-xs text-red-500">Search engines may truncate titles over 58 characters.</p>
                )}
              </div>

              <div>
                <label className="block">
                  <span className="text-base font-semibold text-gray-900">Meta description</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={220}
                    placeholder="Enter your meta description"
                    aria-describedby="seo-description-guidance"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#255ff1]/40 focus:ring-4 focus:ring-[#255ff1]/10 resize-none"
                  />
                </label>
                <div id="seo-description-guidance" className="mt-2 flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Image
                      src={descFit.label === 'Good' ? '/icons/Green check Icon.webp' : '/icons/Gray check Icon.webp'}
                      alt=""
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                    <span className={descFit.color}>{descFit.label}</span>
                  </span>
                  <span className="text-right text-gray-400">{descriptionLength} / {DESCRIPTION_TARGET}</span>
                </div>
                {isLongDesc && (
                  <p className="mt-1 text-xs text-red-500">Search engines may truncate descriptions over 141 characters.</p>
                )}
              </div>
            </div>

            <div className="space-y-4 min-w-0 order-1 lg:order-none">
              <div className={`${device === 'mobile' ? 'max-w-[390px]' : ''}`}>
                <div
                  className={`rounded-xl border overflow-hidden transition-all duration-500 bg-white border-gray-200`}
                >

                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-2.5 bg-gray-50">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-[11px] text-gray-400 truncate">
                      tools / seo-preview
                    </span>
                  </div>

                  {/* Google Search Result — exact Google colors */}
                  <div className={`${device === 'mobile' ? 'px-4 py-4' : 'px-7 py-7'}`}>
                    {/* Skeleton result above */}
                    <div className="space-y-[3px] opacity-40 mb-3">
                      {device === 'mobile' ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-gray-300" />
                          <div className="h-4 w-24 rounded bg-gray-300" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-gray-300" />
                          <div className="h-4 w-24 rounded bg-gray-300" />
                          <div className="h-3 w-2 bg-gray-300" />
                          <div className="h-3 w-40 rounded bg-gray-300" />
                        </div>
                      )}
                      <div className="h-5 w-3/4 rounded bg-gray-300" />
                      <div className="h-4 w-full rounded bg-gray-300" />
                    </div>

                    {/* Actual preview result */}
                    <div className="space-y-[3px] bg-gray-50/50 rounded px-3 py-2 -mx-3 mb-3">
                      {/* URL line */}
                      {device === 'mobile' ? (
                        <div className="flex items-center gap-1.5">
                          <Image
                            src="/Croped%20SIngle%20%22A%22%20Logo.png"
                            alt=""
                            width={18}
                            height={18}
                            className="rounded-full shrink-0"
                          />
                          <span className="text-[#006621] text-sm">alviondigital.in</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Image
                            src="/Croped%20SIngle%20%22A%22%20Logo.png"
                            alt=""
                            width={28}
                            height={28}
                            className="rounded-full shrink-0"
                          />
                          <div>
                            <span className="text-[#202124] text-base">alviondigital.in</span>
                            <div className="text-[#5f6368] text-[13px]">https://www.alviondigital.in › tools › seo-preview</div>
                          </div>
                        </div>
                      )}

                      {/* Title — Google's exact link blue */}
                      <h3 className={`text-[#1a0dab] hover:underline cursor-pointer ${
                        device === 'mobile'
                          ? 'text-lg font-normal leading-snug line-clamp-2'
                          : 'text-xl font-normal leading-snug truncate'
                      }`}>
                        {device === 'mobile' ? title.trim() : clampText(title, titleLimit)}
                      </h3>

                      {/* Description — Google's exact snippet color */}
                      <p className="text-[#3c4043] leading-relaxed text-sm">
                        <>
                          <span className="text-[#70757a]">28 May 2026 — </span>
                          {clampText(description, descLimit)}
                        </>
                      </p>
                    </div>

                    {/* Skeleton result below */}
                    <div className="space-y-[3px] opacity-40">
                      {device === 'mobile' ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-gray-300" />
                          <div className="h-4 w-24 rounded bg-gray-300" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-gray-300" />
                          <div className="h-4 w-24 rounded bg-gray-300" />
                          <div className="h-3 w-2 bg-gray-300" />
                          <div className="h-3 w-40 rounded bg-gray-300" />
                        </div>
                      )}
                      <div className="h-5 w-5/6 rounded bg-gray-300" />
                      <div className="h-4 w-full rounded bg-gray-300" />
                    </div>

                    {/* Site links hint — desktop only */}
                    {device === 'desktop' && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-[#70757a]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span>More results from alviondigital.in</span>
                      </div>
                    )}
                  </div>

                  {/* Device indicator */}
                  <div className="border-t border-gray-100 px-5 py-2 bg-gray-50/50">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{device === 'desktop' ? 'Desktop preview' : 'Mobile preview'}</span>
                      <span>Google Search Result</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick-reference cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <h4 className="text-sm font-semibold text-gray-900">Title length</h4>
              </div>
              <p className="text-xs text-gray-500">Keep around 40-58 characters so your title is less likely to truncate on desktop.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                <h4 className="text-sm font-semibold text-gray-900">Description length</h4>
              </div>
              <p className="text-xs text-gray-500">Stay within 120-141 characters to make your snippet easier to scan in search results.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <h4 className="text-sm font-semibold text-gray-900">Device previews</h4>
              </div>
              <p className="text-xs text-gray-500">Toggle between desktop and mobile views; each has different SERP layouts.</p>
            </div>
          </div>
        </div>
      </Container>

    </section>
  );
}
