import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { tokens } from '@/lib/tokens';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // Stripe Customer Portal · URL générée côté Stripe dashboard
  // https://dashboard.stripe.com/test/settings/billing/portal · configurer puis coller le lien
  const customerPortalLink = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
    ?? 'https://billing.stripe.com/p/login/test_placeholder';

  return (
    <main className="flex-1 px-5 pt-5" style={{ background: tokens.cream }}>
      <Link href="/profile" className="text-sm mb-4 inline-block" style={{ color: tokens.inkMuted }}>
        ‹ Profil
      </Link>
      <h1 className="serif italic text-4xl leading-none mt-2" style={{ color: tokens.ink, letterSpacing: '-0.03em' }}>
        Mon compte
      </h1>

      <section className="mt-6 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>
          Identifiants
        </div>
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(26,21,17,0.06)' }}>
          <span className="text-sm" style={{ color: tokens.inkMuted }}>Email</span>
          <span className="text-sm" style={{ color: tokens.ink }}>{user?.email}</span>
        </div>
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(26,21,17,0.06)' }}>
          <span className="text-sm" style={{ color: tokens.inkMuted }}>ID</span>
          <span className="mono text-[11px]" style={{ color: tokens.ink }}>{user?.id.slice(0, 8)}...</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-sm" style={{ color: tokens.inkMuted }}>Membre depuis</span>
          <span className="text-sm" style={{ color: tokens.ink }}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '-'}
          </span>
        </div>
      </section>

      <section className="mt-3 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-3" style={{ color: tokens.inkMuted }}>
          Abonnement
        </div>
        {profile?.subscription_active ? (
          <>
            <p className="text-sm mb-3" style={{ color: tokens.ink }}>
              Tu es abonné à <b>Let Me Cook Pro</b> · plan <b>{profile.subscription_tier}</b>.
            </p>
            <a
              href={customerPortalLink}
              target="_blank"
              rel="noreferrer"
              className="block text-center py-3 rounded-full text-sm font-medium"
              style={{ background: tokens.ink, color: tokens.cream }}
            >
              Gérer (Stripe) · Annuler / changer de plan
            </a>
            <p className="text-[10px] text-center mt-2" style={{ color: tokens.inkFaint }}>
              Tu arrives sur Stripe Customer Portal pour changer de plan, mettre à jour ta CB, ou annuler.
            </p>
          </>
        ) : (
          <Link
            href="/paywall"
            className="block text-center py-3 rounded-full text-sm font-medium"
            style={{ background: tokens.saffron, color: tokens.espresso }}
          >
            Passer à Pro →
          </Link>
        )}
      </section>

      <section className="mt-3 p-5 rounded-3xl" style={{ background: tokens.paper }}>
        <div className="mono text-[11px] tracking-widest uppercase mb-2" style={{ color: tokens.inkMuted }}>
          Support
        </div>
        <a
          href="mailto:hello@beloucif.com"
          className="block text-sm py-2"
          style={{ color: tokens.ink }}
        >
          hello@beloucif.com
        </a>
      </section>

      <p className="mono text-[9px] text-center mt-6 tracking-wide" style={{ color: tokens.inkFaint }}>
        CGU · Confidentialité · beloucif.com/letmecook
      </p>
    </main>
  );
}
