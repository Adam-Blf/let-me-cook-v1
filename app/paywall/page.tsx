// Paywall web · redirect vers Stripe Payment Links (pas besoin de backend custom).
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';
import { PAYMENT_LINKS, PLANS, FEATURES, type PlanKey } from '@/lib/plans';

export default function Paywall() {
  const [selected, setSelected] = useState<PlanKey>('yearly');

  return (
    <main style={{ background: tokens.cream }} className="min-h-screen px-5 pt-8 pb-6 flex flex-col">
      <div className="flex flex-col items-center">
        <Cooky size={130} pose="happy" />
        <div className="mono text-[11px] tracking-widest uppercase mt-3" style={{ color: tokens.inkMuted }}>
          LET ME COOK PRO
        </div>
        <h1 className="serif italic text-4xl text-center mt-1 leading-none" style={{ color: tokens.ink, letterSpacing: '-0.02em' }}>
          Transforme chaque vidéo en recette.
        </h1>
        <p className="serif italic text-xl mt-3" style={{ color: tokens.saffron }}>
          Parce que cuisiner c&apos;est s&apos;amuser.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: tokens.saffronSoft, color: tokens.espresso }}
            >
              {f.icon}
            </div>
            <div className="text-sm flex-1" style={{ color: tokens.ink }}>{f.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {(['lifetime', 'yearly', 'monthly'] as PlanKey[]).map((plan) => {
          const p = PLANS[plan];
          const active = selected === plan;
          return (
            <button
              key={plan}
              onClick={() => setSelected(plan)}
              className="relative p-4 rounded-2xl border-2 text-left"
              style={{
                borderColor: active ? tokens.saffron : 'rgba(26,21,17,0.08)',
                background: active ? tokens.paper : 'transparent',
              }}
            >
              {'badge' in p && (
                <div
                  className="absolute -top-2 right-4 px-2 py-[3px] rounded-full mono text-[9px] tracking-widest font-bold"
                  style={{ background: plan === 'yearly' ? tokens.saffron : tokens.ink, color: tokens.cream }}
                >
                  {p.badge}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-base" style={{ color: tokens.ink }}>{p.name}</div>
                  <div className="text-xs mt-[2px]" style={{ color: tokens.inkMuted }}>{p.period}</div>
                  {'trialDays' in p && p.trialDays && (
                    <div className="mono text-[10px] tracking-widest mt-1" style={{ color: tokens.saffron }}>
                      {p.trialDays} JOURS OFFERTS
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="serif text-2xl leading-none" style={{ color: tokens.ink, letterSpacing: '-0.01em' }}>
                    {p.priceLabel}
                  </div>
                  <div className="mono text-[10px] tracking-widest mt-[2px]" style={{ color: tokens.inkMuted }}>
                    {p.monthlyEquivalent}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <a
          href={PAYMENT_LINKS[selected]}
          target="_blank"
          rel="noreferrer"
          className="h-14 rounded-full flex items-center justify-center font-medium text-[15px]"
          style={{ background: tokens.saffron, color: tokens.espresso }}
        >
          {selected === 'lifetime' ? `Débloquer à vie · ${PLANS[selected].priceLabel}` : `Commencer · ${PLANS[selected].priceLabel}`}
        </a>

        <Link
          href="/"
          className="h-10 flex items-center justify-center mono text-[11px] tracking-widest uppercase"
          style={{ color: tokens.inkMuted }}
        >
          Plus tard
        </Link>
      </div>

      <p className="mono text-[9px] text-center mt-4 leading-snug tracking-wide" style={{ color: tokens.inkFaint }}>
        Paiement sécurisé Stripe · Annulable à tout moment · CGU + RGPD sur beloucif.com/letmecook
      </p>
    </main>
  );
}
