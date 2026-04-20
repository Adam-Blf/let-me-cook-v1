'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Step = { t: string; timer: number | null };

export default function CookClient({ id, title, steps }: { id: string; title: string; steps: Step[] }) {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [timerSec, setTimerSec] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  // Keep screen awake
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const lock = async () => {
      try {
        wakeLock = await (navigator as unknown as { wakeLock?: { request: (t: string) => Promise<WakeLockSentinel> } }).wakeLock?.request('screen') ?? null;
      } catch {}
    };
    lock();
    return () => { void wakeLock?.release(); };
  }, []);

  const startTimer = () => {
    if (!step?.timer) return;
    setTimerSec(step.timer * 60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSec((s) => {
        if (s === null) return null;
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          try { new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==').play(); } catch {}
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerSec(null);
  };

  const next = async () => {
    resetTimer();
    if (isLast) {
      const supabase = createClient();
      const { data: current } = await supabase
        .from('recipes')
        .select('cooked_count')
        .eq('id', id)
        .single();
      await supabase
        .from('recipes')
        .update({
          cooked_count: (current?.cooked_count ?? 0) + 1,
          last_cooked_at: new Date().toISOString(),
        })
        .eq('id', id);
      router.push(`/recipe/${id}/finished`);
      return;
    }
    setStepIdx((i) => i + 1);
  };

  const prev = () => {
    resetTimer();
    setStepIdx((i) => Math.max(0, i - 1));
  };

  const mm = timerSec != null ? String(Math.floor(timerSec / 60)).padStart(2, '0') : '';
  const ss = timerSec != null ? String(timerSec % 60).padStart(2, '0') : '';

  return (
    <main className="min-h-screen flex flex-col p-7" style={{ background: tokens.espresso }}>
      <header className="flex items-center justify-between">
        <button onClick={() => router.push(`/recipe/${id}`)} className="mono text-[11px] tracking-widest uppercase" style={{ color: tokens.inkFaint }}>
          ‹ Quitter
        </button>
        <div className="mono text-[11px] tracking-widest uppercase" style={{ color: tokens.saffron }}>
          COOK MODE · {stepIdx + 1}/{steps.length}
        </div>
        <Cooky size={44} pose="cooking" />
      </header>

      <div className="flex gap-1 mt-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i <= stepIdx ? tokens.saffron : 'rgba(246,241,232,0.15)' }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mono text-[10px] tracking-widest uppercase mb-4" style={{ color: tokens.inkFaint }}>
          {title}
        </div>
        <h1
          className="serif italic leading-tight"
          style={{ color: tokens.cream, fontSize: 'clamp(32px, 8vw, 56px)', letterSpacing: '-0.02em' }}
        >
          {step?.t}
        </h1>

        {step?.timer && timerSec === null && (
          <button
            onClick={startTimer}
            className="mt-8 self-start px-5 py-3 rounded-full font-medium text-sm flex items-center gap-2"
            style={{ background: tokens.tomato, color: tokens.cream }}
          >
            ⏱ Lancer timer · {step.timer} min
          </button>
        )}
        {timerSec !== null && (
          <div className="mt-8 p-6 rounded-3xl" style={{ background: tokens.espressoCard }}>
            <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.tomato }}>
              MINUTEUR
            </div>
            <div
              className="mono font-bold leading-none"
              style={{ color: timerSec === 0 ? tokens.tomato : tokens.cream, fontSize: 'clamp(56px, 16vw, 96px)' }}
            >
              {mm}:{ss}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={resetTimer} className="px-4 py-2 rounded-full text-xs" style={{ background: 'rgba(246,241,232,0.1)', color: tokens.cream }}>
                Reset
              </button>
              <button onClick={startTimer} className="px-4 py-2 rounded-full text-xs" style={{ background: 'rgba(246,241,232,0.1)', color: tokens.cream }}>
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={prev}
          disabled={stepIdx === 0}
          className="h-14 w-14 rounded-full flex items-center justify-center disabled:opacity-30"
          style={{ background: 'rgba(246,241,232,0.1)', color: tokens.cream, fontSize: 22 }}
        >
          ‹
        </button>
        <button
          onClick={next}
          className="h-14 flex-1 rounded-full font-medium text-sm"
          style={{ background: tokens.saffron, color: tokens.espresso }}
        >
          {isLast ? '✓ Terminé' : 'Suivant →'}
        </button>
      </div>
    </main>
  );
}
