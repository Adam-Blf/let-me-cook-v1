'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

export default function AddPage() {
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col px-5 pt-5 pb-6" style={{ background: tokens.cream }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            NOUVELLE RECETTE
          </div>
          <h1 className="serif italic text-4xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            Comment commencer ?
          </h1>
        </div>
        <Cooky size={72} pose="thinking" />
      </div>

      <form onSubmit={onExtract} className="mt-6 flex flex-col gap-3 p-5 rounded-3xl" style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
            style={{ background: tokens.saffronSoft, color: tokens.espresso }}
          >
            ▶
          </div>
          <div>
            <div className="font-medium" style={{ color: tokens.ink }}>Importer une vidéo YouTube</div>
            <div className="text-xs" style={{ color: tokens.inkMuted }}>Shorts et tutos longs · Cooky extrait tout</div>
          </div>
        </div>
        <input
          type="url"
          inputMode="url"
          placeholder="https://youtube.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 px-4 rounded-full border text-sm outline-none"
          style={{ borderColor: 'rgba(26,21,17,0.12)', background: tokens.cream, color: tokens.ink }}
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="h-12 rounded-full font-medium text-sm disabled:opacity-60"
          style={{ background: tokens.saffron, color: tokens.espresso }}
        >
          {loading ? 'Cooky regarde la vidéo...' : 'Extraire la recette'}
        </button>
        {error && <p className="text-xs text-center" style={{ color: tokens.tomato }}>{error}</p>}
      </form>

      <Link
        href="/editor"
        className="mt-3 p-5 rounded-3xl flex items-center gap-3"
        style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style={{ background: tokens.saffronSoft, color: tokens.espresso }}
        >
          ✎
        </div>
        <div className="flex-1">
          <div className="font-medium" style={{ color: tokens.ink }}>Créer à la main</div>
          <div className="text-xs" style={{ color: tokens.inkMuted }}>Ta recette, à ta façon</div>
        </div>
        <div style={{ color: tokens.inkFaint }}>›</div>
      </Link>

      <div
        className="mt-3 p-5 rounded-3xl flex items-center gap-3 opacity-60"
        style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style={{ background: tokens.creamSoft, color: tokens.inkMuted }}
        >
          ○
        </div>
        <div className="flex-1">
          <div className="font-medium" style={{ color: tokens.inkMuted }}>Photo de livre (bientôt)</div>
          <div className="text-xs" style={{ color: tokens.inkFaint }}>OCR + extraction depuis un livre</div>
        </div>
      </div>

      <div
        className="mt-3 p-5 rounded-3xl flex items-center gap-3 opacity-60"
        style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style={{ background: tokens.creamSoft, color: tokens.inkMuted }}
        >
          ▷
        </div>
        <div className="flex-1">
          <div className="font-medium" style={{ color: tokens.inkMuted }}>TikTok / Reels (bientôt)</div>
          <div className="text-xs" style={{ color: tokens.inkFaint }}>Pour l&apos;instant, YouTube seulement</div>
        </div>
      </div>
    </main>
  );
}
