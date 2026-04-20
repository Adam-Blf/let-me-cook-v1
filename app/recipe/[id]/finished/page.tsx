// Écran Bon appétit · rating + compteur
import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

export default async function FinishedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('id, title, cooked_count')
    .eq('id', id)
    .single();

  if (!recipe) notFound();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: `radial-gradient(ellipse at 50% 45%, ${tokens.saffronSoft}, ${tokens.cream})` }}
    >
      <Cooky size={220} pose="happy" />
      <h1
        className="serif italic leading-none mt-8"
        style={{ color: tokens.ink, fontSize: 'clamp(48px, 12vw, 96px)', letterSpacing: '-0.03em' }}
      >
        Bon appétit.
      </h1>
      <p className="text-sm mt-3" style={{ color: tokens.inkMuted }}>
        {recipe.title}
      </p>

      <div className="flex gap-2 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ color: tokens.saffron, fontSize: 40 }}>★</div>
        ))}
      </div>

      <div
        className="mt-8 inline-flex items-baseline gap-2 px-5 py-3 rounded-full"
        style={{ background: tokens.saffronSoft }}
      >
        <span className="mono font-bold text-2xl" style={{ color: tokens.espresso }}>
          {(recipe.cooked_count ?? 0) + 1}×
        </span>
        <span className="text-sm" style={{ color: tokens.espresso }}>cuisinée</span>
      </div>

      <div className="mt-10 flex flex-col gap-2 w-full max-w-xs">
        <Link
          href="/library"
          className="h-12 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ background: tokens.ink, color: tokens.cream }}
        >
          Retour bibliothèque
        </Link>
        <Link
          href={`/recipe/${recipe.id}`}
          className="h-10 flex items-center justify-center mono text-[11px] tracking-widest uppercase"
          style={{ color: tokens.inkMuted }}
        >
          Revoir la recette
        </Link>
      </div>
    </main>
  );
}
