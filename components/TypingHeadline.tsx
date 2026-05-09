'use client';

import { useEffect, useState } from 'react';

interface Props {
  texts: string[];
  duration?: number; // total duration per phrase in ms (overrides speed+pause if provided)
  speed?: number; // ms per character
  pause?: number; // ms pause after typing before switching
  className?: string;
}

export default function TypingHeadline({ texts, duration = 8000, speed = 45, pause = 1400, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const key = `${index}-${texts[index]}`;

  const effectiveDuration = duration;

  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, effectiveDuration);
    return () => clearTimeout(t);
  }, [index, texts.length, effectiveDuration]);

  return (
    <div aria-hidden className="w-full">
      <style>{`
        @keyframes typing {
          0% { clip-path: inset(0 100% 0 0); }
          1% { clip-path: inset(0 100% 0 0); }
          15% { clip-path: inset(0 0% 0 0); }
          85% { clip-path: inset(0 0% 0 0); }
          99% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 100% 0 0); }
        }
        .typing-text {
          display: inline-block;
          white-space: normal; /* allow wrapping so full content shows */
          max-width: 100%;
          box-sizing: border-box;
          animation: typing ${effectiveDuration}ms ease-in-out infinite;
          -webkit-animation: typing ${effectiveDuration}ms ease-in-out infinite;
          animation-fill-mode: both;
        }
        /* On very narrow screens, slightly reduce duration for snappier feel */
        @media (max-width: 420px) {
          .typing-text {
            animation-duration: ${Math.max(3000, Math.floor(effectiveDuration * 0.7))}ms;
          }
        }
      `}</style>

      <span key={key} className={`${className} typing-text`}> 
        {texts[index]}
      </span>
    </div>
  );
}
