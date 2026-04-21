'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Substitute = { name: string; ratio?: string; note?: string };

function Inner() {
  const router = useRouter();
  const search = useSearchParams();
  const ingredient = search.get('name') ?? '';
  const [subs, setSubs] = useState<Substitute[]>([]);
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ingredient) return;
    fetch('/api/substitutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredient }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setSubs(data.substitutes ?? []);
          setTips(data.tips ?? '');
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [ingredient]);

  return (
    <main className="min-h-screen px-5 pt-5 pb-10" style={{ background: tokens.cream }}>
      <button onClick={() => router.back()} className="text-sm" style={{ color: tokens.inkMuted }}>
        ‹ Retour
      </button>
      <div className="flex items-start justify-between mt-4">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            INGRÉDIENT
          </div>
          <h1 className="serif italic text-5xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            {ingredient}
          </h1>
        </div>
        <Cooky size={60} pose="thinking" />
      </div>

      <section className="mt-8">
        <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
          Substitutions
        </div>
        {loading ? (
          <div className="p-5 rounded-3xl text-center text-sm animate-pulse" style={{ background: tokens.paper, color: tokens.inkMuted }}>
            Cooky réfléchit à des alternatives...
          </div>
        ) : error ? (
          <div className="p-5 rounded-3xl text-sm" style={{ background: tokens.paper, color: tokens.tomato }}>
            {error}
          </div>
        ) : subs.length === 0 ? (
          <div className="p-5 rounded-3xl text-sm" style={{ background: tokens.paper, color: tokens.inkMuted }}>
            Pas de substitut connu · celui-là est irremplaçable.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {subs.map((s, i) => (
              <li key={i} className="p-4 rounded-2xl" style={{ background: tokens.paper }}>
                <div className="flex items-baseline justify-between">
                  <div className="serif italic text-xl" style={{ color: tokens.ink }}>{s.name}</div>
                  {s.ratio && (
                    <div className="mono text-[11px] tracking-widest" style={{ color: tokens.saffron }}>
                      {s.ratio}
                    </div>
                  )}
                </div>
                {s.note && <div className="text-xs mt-1" style={{ color: tokens.inkMuted }}>{s.note}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {tips && (
        <section
          className="mt-6 p-5 rounded-3xl flex gap-3 items-start"
          style={{ background: tokens.saffronSoft }}
        >
          <Cooky size={48} pose="happy" />
          <div className="flex-1 text-sm leading-relaxed" style={{ color: tokens.espresso }}>
            {tips}
          </div>
        </section>
      )}
    </main>
  );
}

export default function IngredientPage() {
  return (
    <Suspense fallback={<div style={{ background: tokens.cream, minHeight: '100vh' }} />}>
      <Inner />
    </Suspense>
  );
}
