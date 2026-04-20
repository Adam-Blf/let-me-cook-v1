import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';
import SignOutButton from './SignOutButton';

const TIER_LABEL: Record<string, string> = {
  monthly: 'Mensuel · 7,99 €/mois',
  yearly: 'Annuel · 39,99 €/an',
  lifetime: 'À vie · 99,99 € payé',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const { count: recipesCount } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true });

  return (
    <main className="flex-1 px-5 pt-5" style={{ background: tokens.cream }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="mono text-[11px] tracking-widest uppercase mb-1" style={{ color: tokens.saffron }}>
            PROFIL
          </div>
          <h1 className="serif italic text-5xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
            {profile?.full_name ?? 'Chef'}
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.inkMuted }}>{user?.email}</p>
        </div>
        <Cooky size={60} pose="happy" />
      </div>

      <section className="mt-6 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>
          Abonnement
        </div>
        <div className="flex items-baseline gap-2">
          <div className="serif italic text-3xl" style={{ color: tokens.ink }}>
            {profile?.subscription_tier ? 'Let Me Cook Pro' : 'Gratuit'}
          </div>
          {profile?.subscription_active && (
            <div
              className="mono text-[10px] tracking-widest px-2 py-[2px] rounded-full"
              style={{ background: tokens.saffron, color: tokens.espresso }}
            >
              ACTIF
            </div>
          )}
        </div>
        {profile?.subscription_tier && (
          <p className="text-xs mt-1" style={{ color: tokens.inkMuted }}>
            {TIER_LABEL[profile.subscription_tier]}
          </p>
        )}
        {profile?.subscription_until && (
          <p className="text-xs mt-1" style={{ color: tokens.inkMuted }}>
            Renouvellement · {new Date(profile.subscription_until).toLocaleDateString('fr-FR')}
          </p>
        )}
        <Link
          href="/account"
          className="inline-block mt-4 px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase"
          style={{ border: `1px solid ${tokens.line}`, color: tokens.ink }}
        >
          Gérer mon abonnement →
        </Link>
      </section>

      <section className="mt-3 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
          Statistiques
        </div>
        <div className="flex items-baseline gap-6">
          <div>
            <div className="serif italic text-3xl" style={{ color: tokens.saffron }}>{recipesCount ?? 0}</div>
            <div className="mono text-[10px] tracking-widest uppercase" style={{ color: tokens.inkMuted }}>Recettes</div>
          </div>
        </div>
      </section>

      <section className="mt-3 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <SignOutButton />
      </section>
    </main>
  );
}
