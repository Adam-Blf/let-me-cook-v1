'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Recipe = {
  id: string;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  tone: string | null;
  ingredients: Array<{ name: string }> | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('recipes')
      .select('id, title, subtitle, tags, tone, ingredients')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRecipes((data as Recipe[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return recipes;
    return recipes.filter((r) => {
      if (r.title.toLowerCase().includes(q)) return true;
      if (r.subtitle?.toLowerCase().includes(q)) return true;
      if ((r.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
      if ((r.ingredients || []).some((i) => i.name?.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, recipes]);

  return (
    <main className="flex-1 px-5 pt-5" style={{ background: tokens.cream }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            RECHERCHE
          </div>
          <h1 className="serif italic text-4xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            Trouve ta recette
          </h1>
        </div>
        <Cooky size={52} pose="watching" />
      </div>

      <input
        type="text"
        placeholder="Titre, ingrédient, tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-5 w-full h-12 px-5 rounded-full border text-sm outline-none"
        style={{ borderColor: 'rgba(26,21,17,0.12)', background: tokens.paper, color: tokens.ink }}
      />

      <div className="mt-4 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div
            className="p-6 rounded-3xl text-center"
            style={{ background: tokens.paper, color: tokens.inkMuted }}
          >
            {query ? 'Aucune recette trouvée.' : 'Commence à taper pour chercher.'}
          </div>
        ) : (
          filtered.map((r) => (
            <Link
              key={r.id}
              href={`/recipe/${r.id}`}
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ background: tokens.paper }}
            >
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${tokens.saffronSoft}, ${tokens.saffron})`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="serif italic text-lg leading-tight truncate" style={{ color: tokens.ink }}>
                  {r.title}
                </div>
                {r.subtitle && (
                  <div className="text-xs mt-[2px] truncate" style={{ color: tokens.inkMuted }}>
                    {r.subtitle}
                  </div>
                )}
              </div>
              <div style={{ color: tokens.inkFaint }}>›</div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
