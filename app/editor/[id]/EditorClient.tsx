'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Ing = { q: string; u: string; name: string; cat: 'produce' | 'dairy' | 'meat' | 'pantry' };
type Step = { t: string; timer: number | null };

const UNITS = ['g', 'kg', 'ml', 'cl', 'l', 'c.à.c', 'c.à.s', 'pièce'];
const CATS: Array<{ v: Ing['cat']; label: string }> = [
  { v: 'produce', label: 'Fruits & lég.' },
  { v: 'dairy', label: 'Laitier' },
  { v: 'meat', label: 'Viande/poisson' },
  { v: 'pantry', label: 'Épicerie' },
];

type Recipe = {
  id: string;
  title: string;
  subtitle: string | null;
  prep_minutes: number | null;
  cook_minutes: number | null;
  servings: number | null;
  ingredients: unknown;
  steps: unknown;
  nutrition: { kcal?: number } | null;
};

export default function EditorClient({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [title, setTitle] = useState(recipe.title);
  const [subtitle, setSubtitle] = useState(recipe.subtitle ?? '');
  const [prep, setPrep] = useState<number | ''>(recipe.prep_minutes ?? '');
  const [cook, setCook] = useState<number | ''>(recipe.cook_minutes ?? '');
  const [servings, setServings] = useState<number | ''>(recipe.servings ?? '');
  const [kcal, setKcal] = useState<number | ''>(recipe.nutrition?.kcal ?? '');
  const [ingredients, setIngredients] = useState<Ing[]>((recipe.ingredients as Ing[]) ?? []);
  const [steps, setSteps] = useState<Step[]>((recipe.steps as Step[]) ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!title) return setError('Titre requis');
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from('recipes')
      .update({
        title,
        subtitle: subtitle || null,
        prep_minutes: prep || null,
        cook_minutes: cook || null,
        servings: servings || null,
        ingredients: ingredients.filter((i) => i.name),
        steps: steps.filter((s) => s.t),
        nutrition: kcal ? { kcal } : {},
      })
      .eq('id', recipe.id);
    setLoading(false);
    if (err) return setError(err.message);
    router.push(`/recipe/${recipe.id}`);
  };

  const remove = async () => {
    if (!confirm('Supprimer cette recette ?')) return;
    const supabase = createClient();
    await supabase.from('recipes').delete().eq('id', recipe.id);
    router.push('/library');
  };

  return (
    <main className="min-h-screen px-5 pt-5 pb-28" style={{ background: tokens.cream }}>
      <button onClick={() => router.back()} className="text-sm" style={{ color: tokens.inkMuted }}>
        ‹ Annuler
      </button>
      <div className="flex items-start justify-between mt-3">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            ÉDITION
          </div>
          <h1 className="serif italic text-3xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            Modifier
          </h1>
        </div>
        <Cooky size={52} pose="thinking" />
      </div>

      <section className="mt-6 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-3 rounded-2xl text-base serif italic"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px solid ${tokens.line}`, fontSize: 24 }}
        />
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Sous-titre..."
          className="px-4 py-3 rounded-2xl text-sm"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px solid ${tokens.line}` }}
        />
      </section>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <NumInput label="Prép (min)" value={prep} onChange={setPrep} />
        <NumInput label="Cuisson (min)" value={cook} onChange={setCook} />
        <NumInput label="Portions" value={servings} onChange={setServings} />
      </section>
      <section className="mt-3">
        <NumInput label="Calories/portion (kcal)" value={kcal} onChange={setKcal} />
      </section>

      <section className="mt-6">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>Ingrédients</div>
        <div className="flex flex-col gap-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 p-3 rounded-xl" style={{ background: tokens.paper }}>
              <input value={ing.q} onChange={(e) => update(i, { q: e.target.value })} placeholder="Qté" className="w-14 px-2 py-1 rounded-md mono text-sm" style={{ background: tokens.cream, color: tokens.ink }} />
              <select value={ing.u} onChange={(e) => update(i, { u: e.target.value })} className="w-16 px-1 py-1 rounded-md text-xs" style={{ background: tokens.cream, color: tokens.ink }}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <input value={ing.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="nom" className="flex-1 px-2 py-1 rounded-md text-sm" style={{ background: tokens.cream, color: tokens.ink }} />
              <select value={ing.cat} onChange={(e) => update(i, { cat: e.target.value as Ing['cat'] })} className="w-24 px-1 py-1 rounded-md text-xs" style={{ background: tokens.cream, color: tokens.ink }}>
                {CATS.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
              </select>
              <button onClick={() => removeIng(i)} style={{ color: tokens.tomato, width: 20 }}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => setIngredients((l) => [...l, { q: '', u: 'g', name: '', cat: 'pantry' }])} className="mt-2 px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase" style={{ background: tokens.paper, color: tokens.ink, border: `1px dashed ${tokens.line}` }}>
          + Ajouter
        </button>
      </section>

      <section className="mt-6">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>Étapes</div>
        <div className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-2 p-3 rounded-xl" style={{ background: tokens.paper }}>
              <div className="serif italic text-2xl w-8" style={{ color: tokens.saffron }}>{i + 1}</div>
              <textarea value={s.t} onChange={(e) => updStep(i, { t: e.target.value })} className="flex-1 px-2 py-1 rounded-md text-sm resize-none" style={{ background: tokens.cream, color: tokens.ink, minHeight: 56 }} />
              <input type="number" value={s.timer ?? ''} onChange={(e) => updStep(i, { timer: e.target.value ? +e.target.value : null })} placeholder="min" className="w-14 px-2 py-1 rounded-md text-sm mono self-start" style={{ background: tokens.cream, color: tokens.ink }} />
              <button onClick={() => removeStep(i)} style={{ color: tokens.tomato, width: 20, alignSelf: 'flex-start' }}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => setSteps((l) => [...l, { t: '', timer: null }])} className="mt-2 px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase" style={{ background: tokens.paper, color: tokens.ink, border: `1px dashed ${tokens.line}` }}>
          + Ajouter étape
        </button>
      </section>

      <button onClick={remove} className="mt-8 w-full py-3 rounded-full mono text-[11px] tracking-widest uppercase" style={{ border: `1px solid ${tokens.line}`, color: tokens.tomato }}>
        Supprimer cette recette
      </button>

      {error && <p className="text-sm text-center mt-4" style={{ color: tokens.tomato }}>{error}</p>}

      <button onClick={save} disabled={loading} className="fixed bottom-6 left-5 right-5 h-14 rounded-full font-medium text-[15px] disabled:opacity-60" style={{ background: tokens.saffron, color: tokens.espresso, maxWidth: 'calc(100vw - 40px)' }}>
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </main>
  );

  function update(i: number, patch: Partial<Ing>) {
    setIngredients((l) => l.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeIng(i: number) {
    setIngredients((l) => l.filter((_, idx) => idx !== i));
  }
  function updStep(i: number, patch: Partial<Step>) {
    setSteps((l) => l.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function removeStep(i: number) {
    setSteps((l) => l.filter((_, idx) => idx !== i));
  }
}

function NumInput({ label, value, onChange }: { label: string; value: number | ''; onChange: (v: number | '') => void }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}>
      <div className="mono text-[9px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>{label}</div>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value ? +e.target.value : '')} className="w-full outline-none mt-1 mono" style={{ background: 'transparent', color: tokens.ink, fontSize: 18 }} />
    </div>
  );
}
