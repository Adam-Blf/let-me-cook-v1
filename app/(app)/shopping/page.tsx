import { createClient } from '@/lib/supabase-server';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

type Ingredient = { q: string; u: string; name: string; cat: 'produce' | 'dairy' | 'meat' | 'pantry' };

const CAT_LABEL: Record<string, string> = {
  produce: 'Fruits & légumes',
  dairy: 'Produits laitiers',
  meat: 'Viande & poisson',
  pantry: 'Épicerie',
};
const CAT_ICON: Record<string, string> = {
  produce: '🥬',
  dairy: '🥚',
  meat: '🥩',
  pantry: '🧂',
};

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, ingredients')
    .order('created_at', { ascending: false })
    .limit(20);

  const grouped: Record<string, Array<{ q: string; u: string; name: string; recipe: string }>> = {
    produce: [],
    dairy: [],
    meat: [],
    pantry: [],
  };

  (recipes ?? []).forEach((r) => {
    const list = (r.ingredients ?? []) as Ingredient[];
    list.forEach((ing) => {
      const cat = ing.cat ?? 'pantry';
      if (grouped[cat]) {
        grouped[cat].push({ q: ing.q, u: ing.u, name: ing.name, recipe: r.title });
      }
    });
  });

  const totalItems = Object.values(grouped).reduce((s, list) => s + list.length, 0);

  return (
    <main className="flex-1 px-5 pt-5" style={{ background: tokens.cream }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            COURSES
          </div>
          <h1 className="serif italic text-5xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            Liste
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.inkMuted }}>
            {totalItems} article{totalItems > 1 ? 's' : ''} à acheter
          </p>
        </div>
        <Cooky size={60} pose="cooking" />
      </div>

      {totalItems === 0 ? (
        <div className="mt-8 p-6 rounded-3xl text-center" style={{ background: tokens.paper, color: tokens.inkMuted }}>
          <div className="serif italic text-xl" style={{ color: tokens.ink }}>Liste vide</div>
          <p className="text-sm mt-1">Extrais une recette pour générer ta liste.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {Object.entries(grouped)
            .filter(([, list]) => list.length > 0)
            .map(([cat, list]) => (
              <section key={cat} className="p-5 rounded-3xl" style={{ background: tokens.paper }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 20 }}>{CAT_ICON[cat]}</span>
                  <h2 className="mono text-[11px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>
                    {CAT_LABEL[cat]}
                  </h2>
                  <span className="text-xs ml-auto" style={{ color: tokens.inkFaint }}>{list.length}</span>
                </div>
                <ul>
                  {list.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-baseline py-2 border-b last:border-b-0"
                      style={{ borderColor: 'rgba(26,21,17,0.06)' }}
                    >
                      <span className="mono w-20 font-semibold text-sm" style={{ color: tokens.saffron }}>
                        {ing.q} {ing.u}
                      </span>
                      <span className="flex-1 text-sm" style={{ color: tokens.ink }}>{ing.name}</span>
                      <span className="text-[10px] italic" style={{ color: tokens.inkFaint }}>
                        {ing.recipe}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </main>
  );
}
