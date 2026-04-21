'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Recipe = {
  id: string;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  tone: string | null;
  cooked_count: number;
  created_at: string;
  prep_minutes: number | null;
  cook_minutes: number | null;
};

const TONE_BG: Record<string, [string, string]> = {
  cream: [tokens.creamSoft, tokens.cream],
  saffron: [tokens.saffronSoft, tokens.saffron],
  tomato: ['#E8A59A', tokens.tomato],
  olive: ['#B5BE94', tokens.olive],
  honey: ['#E8D19A', tokens.honey],
  plum: ['#B08FA0', tokens.plum],
};

const FILTERS: Array<{ id: string; label: string; match: (r: Recipe) => boolean }> = [
  { id: 'all', label: 'Tout', match: () => true },
  {
    id: 'quick',
    label: 'Rapide',
    match: (r) => {
      const total = (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);
      return total > 0 && total <= 20;
    },
  },
  {
    id: 'veggie',
    label: 'Végé',
    match: (r) => (r.tags ?? []).some((t) => /vég|veggie|vegan/i.test(t)),
  },
  {
    id: 'dinner',
    label: 'Dîner',
    match: (r) => (r.tags ?? []).some((t) => /d[iî]ner|dinner/i.test(t)),
  },
  {
    id: 'dessert',
    label: 'Dessert',
    match: (r) => (r.tags ?? []).some((t) => /dessert|sucr/i.test(t)),
  },
];

export default function LibraryClient({ recipes }: { recipes: Recipe[] }) {
  const [filter, setFilter] = useState('all');
  const totalCooked = useMemo(() => recipes.reduce((s, r) => s + (r.cooked_count || 0), 0), [recipes]);

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter);
    return f ? recipes.filter(f.match) : recipes;
  }, [filter, recipes]);

  return (
    <main className="flex-1 px-5 pt-5" style={{ background: tokens.cream }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            Bibliothèque
          </div>
          <h1 className="serif italic text-5xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            Ta cuisine
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.inkMuted }}>
            {recipes.length} recette{recipes.length > 1 ? 's' : ''} · <span style={{ color: tokens.saffron }}>{totalCooked}</span> plats ce mois-ci
          </p>
        </div>
        <Cooky size={60} pose="wave" />
      </div>

      {/* filter chips */}
      <div className="mt-5 flex gap-2 overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex-shrink-0 h-8 px-4 rounded-full mono text-[11px] tracking-widest uppercase transition-colors"
              style={{
                background: active ? tokens.ink : tokens.paper,
                color: active ? tokens.cream : tokens.inkMuted,
                border: `1px solid ${active ? tokens.ink : 'rgba(26,21,17,0.08)'}`,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        recipes.length === 0 ? (
          <Link
            href="/add"
            className="mt-8 block p-8 rounded-3xl text-center"
            style={{ background: tokens.paper, color: tokens.inkMuted }}
          >
            <div className="serif italic text-2xl" style={{ color: tokens.ink }}>Vide pour le moment.</div>
            <p className="text-sm mt-2">Colle ta première vidéo YouTube pour commencer.</p>
            <div
              className="inline-block mt-4 px-6 py-2 rounded-full mono text-[11px] tracking-widest uppercase"
              style={{ background: tokens.saffron, color: tokens.espresso }}
            >
              Ajouter une recette
            </div>
          </Link>
        ) : (
          <div className="mt-8 p-6 rounded-3xl text-center" style={{ background: tokens.paper, color: tokens.inkMuted }}>
            Aucune recette dans ce filtre.
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-5">
          {filtered.map((r) => {
            const [c1, c2] = TONE_BG[r.tone || 'saffron'] ?? TONE_BG.saffron;
            return (
              <Link
                key={r.id}
                href={`/recipe/${r.id}`}
                className="rounded-2xl p-4 aspect-square flex flex-col justify-between relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
              >
                <div className="mono text-[9px] tracking-widest uppercase" style={{ color: tokens.espresso, opacity: 0.7 }}>
                  {(r.tags as string[] | null)?.[0] ?? ''}
                </div>
                <div className="serif italic text-lg leading-tight" style={{ color: tokens.ink, letterSpacing: '-0.01em' }}>
                  {r.title}
                </div>
                {r.cooked_count > 0 && (
                  <div
                    className="absolute top-3 right-3 px-2 py-[2px] rounded-full mono text-[10px]"
                    style={{ background: tokens.ink, color: tokens.saffron }}
                  >
                    {r.cooked_count}×
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
