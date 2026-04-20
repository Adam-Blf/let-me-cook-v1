import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { tokens } from '@/lib/tokens';
import { Cooky } from '@/components/Cooky';

type Ingredient = { q: string; u: string; name: string; cat: string };
type Step = { t: string; timer: number | null };

const TONE_BG: Record<string, [string, string]> = {
  cream: [tokens.creamSoft, tokens.cream],
  saffron: [tokens.saffronSoft, tokens.saffron],
  tomato: ['#E8A59A', tokens.tomato],
  olive: ['#B5BE94', tokens.olive],
  honey: ['#E8D19A', tokens.honey],
  plum: ['#B08FA0', tokens.plum],
};

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (!recipe) notFound();

  const ingredients = (recipe.ingredients ?? []) as Ingredient[];
  const steps = (recipe.steps ?? []) as Step[];
  const tags = (recipe.tags ?? []) as string[];
  const [c1, c2] = TONE_BG[recipe.tone || 'saffron'] ?? TONE_BG.saffron;

  return (
    <main style={{ background: tokens.cream }} className="min-h-screen pb-24">
      {/* hero */}
      <section
        className="relative p-6 pt-10 pb-8"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        <Link
          href="/app"
          className="absolute top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(251,248,241,0.9)', color: tokens.ink }}
        >
          ‹
        </Link>
        <div className="absolute top-5 right-5">
          <Cooky size={72} pose="cooking" />
        </div>

        <div className="mono text-[10px] tracking-widest uppercase pt-14" style={{ color: tokens.espresso, opacity: 0.7 }}>
          {recipe.source_platform?.toUpperCase()} · {recipe.source_author ?? 'Extrait par Cooky'}
        </div>
        <h1 className="serif italic text-5xl leading-none mt-2" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
          {recipe.title}
        </h1>
        {recipe.subtitle && (
          <p className="text-base mt-2" style={{ color: tokens.inkSoft }}>{recipe.subtitle}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="mono text-[10px] px-3 py-1 rounded-full tracking-widest uppercase"
              style={{ background: 'rgba(251,248,241,0.55)', color: tokens.espresso }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-5 mt-5 mono text-xs" style={{ color: tokens.inkSoft }}>
          {recipe.prep_minutes != null && <span>Prép · {recipe.prep_minutes} min</span>}
          {recipe.cook_minutes != null && <span>Cuisson · {recipe.cook_minutes} min</span>}
          {recipe.servings != null && <span>{recipe.servings} portions</span>}
        </div>
      </section>

      {/* ingredients */}
      {ingredients.length > 0 && (
        <section className="px-6 pt-8">
          <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
            INGRÉDIENTS
          </div>
          <ul>
            {ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline py-3 border-b text-base"
                style={{ borderColor: 'rgba(26,21,17,0.08)', color: tokens.ink }}
              >
                <span className="mono w-28 font-semibold" style={{ color: tokens.saffron }}>
                  {ing.q} {ing.u}
                </span>
                <span className="flex-1">{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* steps */}
      {steps.length > 0 && (
        <section className="px-6 pt-8">
          <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
            ÉTAPES
          </div>
          <ol className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="serif text-3xl flex-shrink-0 leading-none" style={{ color: tokens.saffron, letterSpacing: '-0.02em' }}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-[15px] leading-relaxed" style={{ color: tokens.inkSoft }}>
                    {step.t}
                  </p>
                  {step.timer != null && (
                    <div className="mono text-[11px] tracking-widest mt-1" style={{ color: tokens.tomato }}>
                      MINUTEUR · {step.timer} min
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
