'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
};

const TONE_BG: Record<string, [string, string]> = {
  cream: [tokens.creamSoft, tokens.cream],
  saffron: [tokens.saffronSoft, tokens.saffron],
  tomato: ['#E8A59A', tokens.tomato],
  olive: ['#B5BE94', tokens.olive],
  honey: ['#E8D19A', tokens.honey],
  plum: ['#B08FA0', tokens.plum],
};

export default function AppClient({ email, recipes }: { email: string; recipes: Recipe[] }) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'paywall') router.push('/paywall');
        else throw new Error(data.error || 'Erreur extraction');
        return;
      }
      router.push(`/recipe/${data.recipe.id}`);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: tokens.cream }} className="min-h-screen">
      {/* header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cooky size={44} pose="wave" />
          <div>
            <div className="serif italic text-2xl leading-none" style={{ color: tokens.ink }}>
              Let Me Cook
            </div>
            <div className="mono text-[9px] tracking-widest uppercase" style={{ color: tokens.inkFaint }}>
              {email}
            </div>
          </div>
        </div>
        <Link
          href="/account"
          className="mono text-[10px] tracking-widest uppercase"
          style={{ color: tokens.inkMuted }}
        >
          Compte
        </Link>
      </header>

      {/* paste URL form */}
      <section className="px-5 pt-6">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.saffron }}>
          NOUVELLE RECETTE
        </div>
        <h2 className="serif italic text-4xl leading-tight" style={{ color: tokens.ink, letterSpacing: '-0.02em' }}>
          Colle un lien YouTube.
        </h2>
        <form onSubmit={onExtract} className="mt-5 flex flex-col gap-2">
          <input
            type="url"
            inputMode="url"
            placeholder="https://youtube.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 px-5 rounded-full border text-sm outline-none"
            style={{
              borderColor: 'rgba(26,21,17,0.12)',
              background: tokens.paper,
              color: tokens.ink,
              fontFamily: tokens.paper,
            }}
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="h-14 rounded-full font-medium text-[15px] disabled:opacity-60"
            style={{ background: tokens.saffron, color: tokens.espresso }}
          >
            {loading ? 'Cooky regarde la vidéo...' : 'Extraire la recette'}
          </button>
          {error && <p className="text-sm text-center" style={{ color: tokens.tomato }}>{error}</p>}
        </form>
      </section>

      {/* library */}
      <section className="px-5 pt-10 pb-24">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>
          BIBLIOTHÈQUE
        </div>
        <h3 className="serif italic text-3xl leading-tight mb-4" style={{ color: tokens.ink }}>
          {recipes.length === 0 ? 'Vide pour le moment.' : `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}
        </h3>

        {recipes.length === 0 ? (
          <div className="p-6 rounded-3xl text-sm" style={{ background: tokens.paper, color: tokens.inkMuted }}>
            Colle ta première vidéo YouTube au-dessus, Cooky en fait une recette.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recipes.map((r) => {
              const [c1, c2] = TONE_BG[r.tone || 'saffron'] ?? TONE_BG.saffron;
              return (
                <Link
                  key={r.id}
                  href={`/recipe/${r.id}`}
                  className="rounded-2xl p-4 aspect-square flex flex-col justify-between relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  <div className="mono text-[9px] tracking-widest uppercase" style={{ color: tokens.espresso, opacity: 0.7 }}>
                    {r.tags?.[0] ?? ''}
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
      </section>
    </div>
  );
}
