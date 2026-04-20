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

export default function EditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [prep, setPrep] = useState<number | ''>('');
  const [cook, setCook] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>(2);
  const [kcal, setKcal] = useState<number | ''>('');
  const [ingredients, setIngredients] = useState<Ing[]>([{ q: '', u: 'g', name: '', cat: 'pantry' }]);
  const [steps, setSteps] = useState<Step[]>([{ t: '', timer: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!title) return setError('Titre requis');
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }
    const { data, error: err } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        source_platform: 'manual',
        title,
        subtitle: subtitle || null,
        prep_minutes: prep || null,
        cook_minutes: cook || null,
        servings: servings || null,
        ingredients: ingredients.filter((i) => i.name),
        steps: steps.filter((s) => s.t),
        nutrition: kcal ? { kcal } : {},
        tone: 'saffron',
      })
      .select('id')
      .single();
    setLoading(false);
    if (err) return setError(err.message);
    router.push(`/recipe/${data.id}`);
  };

  return (
    <main className="min-h-screen px-5 pt-5 pb-28" style={{ background: tokens.cream }}>
      <button onClick={() => router.back()} className="text-sm" style={{ color: tokens.inkMuted }}>
        ‹ Annuler
      </button>
      <div className="flex items-start justify-between mt-3">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            NOUVELLE RECETTE
          </div>
          <h1 className="serif italic text-4xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            À ta façon.
          </h1>
        </div>
        <Cooky size={60} pose="thinking" />
      </div>

      <section className="mt-6 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la recette"
          className="px-4 py-3 rounded-2xl text-base serif italic"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px solid ${tokens.line}`, fontSize: 24 }}
        />
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="En une ligne..."
          className="px-4 py-3 rounded-2xl text-sm"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px solid ${tokens.line}` }}
        />
      </section>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <NumInput label="Prép (min)" value={prep} onChange={setPrep} />
        <NumInput label="Cuisson (min)" value={cook} onChange={setCook} />
        <NumInput label="Portions" value={servings} onChange={setServings} />
      </section>

      <section className="mt-4">
        <NumInput label="Calories/portion (kcal)" value={kcal} onChange={setKcal} />
      </section>

      {/* Ingredients */}
      <section className="mt-6">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>Ingrédients</div>
        <div className="flex flex-col gap-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 p-3 rounded-xl" style={{ background: tokens.paper }}>
              <input value={ing.q} onChange={(e) => updateIng(i, { q: e.target.value })} placeholder="Qté" className="w-14 px-2 py-1 rounded-md mono text-sm" style={{ background: tokens.cream, color: tokens.ink }} />
              <select value={ing.u} onChange={(e) => updateIng(i, { u: e.target.value })} className="w-16 px-1 py-1 rounded-md text-xs" style={{ background: tokens.cream, color: tokens.ink }}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <input value={ing.name} onChange={(e) => updateIng(i, { name: e.target.value })} placeholder="ex. farine" className="flex-1 px-2 py-1 rounded-md text-sm" style={{ background: tokens.cream, color: tokens.ink }} />
              <select value={ing.cat} onChange={(e) => updateIng(i, { cat: e.target.value as Ing['cat'] })} className="w-24 px-1 py-1 rounded-md text-xs" style={{ background: tokens.cream, color: tokens.ink }}>
                {CATS.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
              </select>
              <button onClick={() => removeIng(i)} style={{ color: tokens.tomato, width: 20 }}>×</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIngredients((list) => [...list, { q: '', u: 'g', name: '', cat: 'pantry' }])}
          className="mt-2 px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px dashed ${tokens.line}` }}
        >
          + Ajouter ingrédient
        </button>
      </section>

      {/* Steps */}
      <section className="mt-6">
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>Étapes</div>
        <div className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-2 p-3 rounded-xl" style={{ background: tokens.paper }}>
              <div className="serif italic text-2xl w-8 flex-shrink-0" style={{ color: tokens.saffron }}>{i + 1}</div>
              <textarea
                value={s.t}
                onChange={(e) => updateStep(i, { t: e.target.value })}
                placeholder="Décris l'étape..."
                className="flex-1 px-2 py-1 rounded-md text-sm resize-none"
                style={{ background: tokens.cream, color: tokens.ink, minHeight: 56 }}
              />
              <input
                type="number"
                value={s.timer ?? ''}
                onChange={(e) => updateStep(i, { timer: e.target.value ? +e.target.value : null })}
                placeholder="min"
                className="w-14 px-2 py-1 rounded-md text-sm mono self-start"
                style={{ background: tokens.cream, color: tokens.ink }}
              />
              <button onClick={() => removeStep(i)} style={{ color: tokens.tomato, width: 20, alignSelf: 'flex-start' }}>×</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setSteps((list) => [...list, { t: '', timer: null }])}
          className="mt-2 px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase"
          style={{ background: tokens.paper, color: tokens.ink, border: `1px dashed ${tokens.line}` }}
        >
          + Ajouter étape
        </button>
      </section>

      {error && <p className="text-sm text-center mt-4" style={{ color: tokens.tomato }}>{error}</p>}

      <button
        onClick={save}
        disabled={loading}
        className="fixed bottom-6 left-5 right-5 h-14 rounded-full font-medium text-[15px] disabled:opacity-60"
        style={{ background: tokens.saffron, color: tokens.espresso, maxWidth: 'calc(100vw - 40px)' }}
      >
        {loading ? 'Enregistrement...' : 'Enregistrer la recette'}
      </button>
    </main>
  );

  function updateIng(i: number, patch: Partial<Ing>) {
    setIngredients((list) => list.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)));
  }
  function removeIng(i: number) {
    setIngredients((list) => list.filter((_, idx) => idx !== i));
  }
  function updateStep(i: number, patch: Partial<Step>) {
    setSteps((list) => list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function removeStep(i: number) {
    setSteps((list) => list.filter((_, idx) => idx !== i));
  }
}

function NumInput({ label, value, onChange }: { label: string; value: number | ''; onChange: (v: number | '') => void }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: tokens.paper, border: `1px solid ${tokens.line}` }}>
      <div className="mono text-[9px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value ? +e.target.value : '')}
        className="w-full outline-none mt-1 mono"
        style={{ background: 'transparent', color: tokens.ink, fontSize: 18 }}
      />
    </div>
  );
}
