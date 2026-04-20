'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Cooky, type Pose } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

const STEPS: { title: string; body: string; pose: Pose; tone: string }[] = [
  {
    title: 'Partage une vidéo,\nCooky s\'occupe du reste.',
    body: 'YouTube Shorts, tutos longs, et bientôt TikTok + Reels. Cooky comprend tout.',
    pose: 'watching',
    tone: tokens.saffronSoft,
  },
  {
    title: 'Ingrédients,\nétapes, timers.',
    body: 'Cooky lit la vidéo, structure la recette. Quantités exactes, étapes numérotées.',
    pose: 'thinking',
    tone: tokens.creamSoft,
  },
  {
    title: 'Cuisine les\nmains libres.',
    body: 'Mode cuisine en gros caractères, timers intégrés. Comme un chef qui te dicte.',
    pose: 'cooking',
    tone: '#F3E2B8',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/');
      else setUserChecked(true);
    });
  }, [router]);

  if (!userChecked) return <div style={{ background: tokens.cream, minHeight: '100vh' }} />;

  const finish = () => router.replace('/library');
  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : finish());
  const current = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: tokens.cream }}>
      <div className="flex-[1.1] flex items-center justify-center" style={{ background: current.tone }}>
        <Cooky size={220} pose={current.pose} />
      </div>

      <div className="flex-1 flex flex-col px-7 py-8">
        <div className="flex gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{ background: i <= step ? tokens.ink : 'rgba(26,21,17,0.12)' }}
            />
          ))}
        </div>

        <h1
          className="serif italic text-4xl leading-tight whitespace-pre-line"
          style={{ color: tokens.ink, letterSpacing: '-0.02em' }}
        >
          {current.title}
        </h1>
        <p className="text-[15px] leading-relaxed mt-4" style={{ color: tokens.inkMuted }}>
          {current.body}
        </p>

        <div className="flex-1" />

        <div className="flex items-center justify-between">
          <button onClick={finish} className="p-3 mono text-sm font-medium" style={{ color: tokens.inkMuted }}>
            Passer
          </button>
          <button
            onClick={next}
            className="h-12 px-8 rounded-full text-sm font-medium"
            style={{ background: tokens.ink, color: tokens.cream }}
          >
            {step < STEPS.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
}
