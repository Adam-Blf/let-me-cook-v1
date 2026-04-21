'use client';
import { useEffect, useState } from 'react';
import { Cooky } from './Cooky';
import { tokens } from '@/lib/tokens';

const STAGES = [
  'Lecture du post',
  'Analyse vidéo',
  'Transcription audio',
  'Structuration recette',
];

export function ExtractionLoader({ visible }: { visible: boolean }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage(0);
      setProgress(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(0.95, elapsed / 15000);
      setProgress(p);
      setStage(Math.min(STAGES.length - 1, Math.floor(p * STAGES.length)));
    }, 150);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${tokens.saffronSoft}, ${tokens.cream})`,
      }}
    >
      <div className="mono text-[11px] tracking-widest uppercase" style={{ color: tokens.saffron }}>
        EXTRACTION EN COURS
      </div>

      <div className="mt-8 animate-pulse">
        <Cooky size={180} pose="watching" />
      </div>

      <div
        className="mt-10 w-full max-w-xs h-2 rounded-full overflow-hidden"
        style={{ background: tokens.creamSoft }}
      >
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${tokens.saffron}, ${tokens.tomato})`,
          }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2 items-start">
        {STAGES.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  i < stage ? tokens.olive : i === stage ? tokens.saffron : tokens.inkFaint,
              }}
            />
            <div
              className="text-sm"
              style={{
                color: i === stage ? tokens.ink : tokens.inkMuted,
                fontWeight: i === stage ? 600 : 400,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <p className="mono text-[10px] text-center mt-8 tracking-wide" style={{ color: tokens.inkFaint }}>
        · Cooky, le petit chef ·
      </p>
    </div>
  );
}
