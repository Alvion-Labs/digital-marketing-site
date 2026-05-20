'use client';

import { useEffect, useState } from 'react';

interface Props {
  texts: string[];
  duration?: number;
  speed?: number;
  pause?: number;
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
      <span key={key} className={`${className} typing-headline-text`}>
        {texts[index]}
      </span>
    </div>
  );
}
