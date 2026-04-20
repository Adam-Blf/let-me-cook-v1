import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { tokens } from '@/lib/tokens';

type Nutrition = { kcal?: number; protein?: number; carbs?: number; fat?: number; fiber?: number };

export default async function NutritionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('id, title, nutrition, servings')
    .eq('id', id)
    .single();

  if (!recipe) notFound();

  const n = (recipe.nutrition ?? {}) as Nutrition;
  const kcal = n.kcal ?? 0;
  const dailyGoal = 2000;
  const pct = Math.min(100, (kcal / dailyGoal) * 100);

  const total = (n.protein ?? 0) * 4 + (n.carbs ?? 0) * 4 + (n.fat ?? 0) * 9;
  const proteinPct = total ? Math.round(((n.protein ?? 0) * 4 / total) * 100) : 0;
  const carbsPct = total ? Math.round(((n.carbs ?? 0) * 4 / total) * 100) : 0;
  const fatPct = 100 - proteinPct - carbsPct;

  return (
    <main className="min-h-screen px-5 pt-5 pb-10" style={{ background: tokens.cream }}>
      <Link href={`/recipe/${id}`} className="text-sm inline-block" style={{ color: tokens.inkMuted }}>
        ‹ Recette
      </Link>
      <div className="mono text-[11px] tracking-widest uppercase mt-4" style={{ color: tokens.saffron }}>
        NUTRITION
      </div>
      <h1 className="serif italic text-4xl leading-none mt-1" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
        {recipe.title}
      </h1>
      <p className="text-xs mt-1" style={{ color: tokens.inkMuted }}>
        Par portion · {recipe.servings ?? '?'} portions au total
      </p>

      {/* Anneau kcal */}
      <div className="mt-8 flex items-center justify-center">
        <div className="relative" style={{ width: 220, height: 220 }}>
          <svg viewBox="0 0 100 100" width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={50} cy={50} r={44} fill="none" stroke={tokens.creamSoft} strokeWidth={8} />
            <circle
              cx={50}
              cy={50}
              r={44}
              fill="none"
              stroke={tokens.saffron}
              strokeWidth={8}
              strokeDasharray={`${(pct / 100) * 276.5} 276.5`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="serif italic text-5xl" style={{ color: tokens.ink, letterSpacing: '-0.02em' }}>{kcal}</div>
            <div className="mono text-[10px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>kcal</div>
            <div className="text-xs mt-1" style={{ color: tokens.inkMuted }}>
              {Math.round(pct)}% d&apos;un jour
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="mt-8 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
          Macros
        </div>
        <div className="flex h-3 rounded-full overflow-hidden mb-4" style={{ background: tokens.creamSoft }}>
          <div style={{ width: `${proteinPct}%`, background: tokens.tomato }} />
          <div style={{ width: `${carbsPct}%`, background: tokens.saffron }} />
          <div style={{ width: `${fatPct}%`, background: tokens.honey }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Macro label="Protéines" value={n.protein ?? 0} color={tokens.tomato} />
          <Macro label="Glucides" value={n.carbs ?? 0} color={tokens.saffron} />
          <Macro label="Lipides" value={n.fat ?? 0} color={tokens.honey} />
        </div>
        {n.fiber != null && (
          <div className="mt-4 pt-3 border-t flex justify-between text-sm" style={{ borderColor: 'rgba(26,21,17,0.06)' }}>
            <span style={{ color: tokens.inkMuted }}>Fibres</span>
            <span style={{ color: tokens.ink }}>{n.fiber}g</span>
          </div>
        )}
      </div>

      <p className="mono text-[10px] text-center mt-6 tracking-wide" style={{ color: tokens.inkFaint }}>
        Valeurs estimées par Cooky · varient selon préparation réelle
      </p>
    </main>
  );
}

function Macro({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="serif italic text-2xl" style={{ color, letterSpacing: '-0.01em' }}>
        {value}g
      </div>
      <div className="mono text-[10px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>
        {label}
      </div>
    </div>
  );
}
