'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    // Force l'URL prod · window.location.origin peut être écrasé par le Site URL Supabase.
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <main
      style={{ background: `radial-gradient(ellipse at 30% 25%, ${tokens.saffronSoft}, ${tokens.cream})` }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <Cooky size={170} pose="wave" />
      <h1 className="serif italic text-6xl sm:text-7xl tracking-tight text-center mt-8 leading-none" style={{ color: tokens.ink }}>
        Let Me Cook
      </h1>
      <p className="serif italic text-xl mt-3 text-center" style={{ color: tokens.saffron }}>
        Parce que cuisiner c&apos;est s&apos;amuser.
      </p>
      <p className="text-sm text-center mt-4 max-w-sm" style={{ color: tokens.inkMuted }}>
        Transforme n&apos;importe quelle vidéo YouTube en recette structurée. Ingrédients,
        étapes, timers · Cooky fait le travail.
      </p>

      {!sent ? (
        <form onSubmit={onSubmit} className="mt-10 w-full max-w-sm flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 px-5 rounded-full border text-base outline-none"
            style={{ borderColor: 'rgba(26,21,17,0.12)', background: tokens.paper, color: tokens.ink }}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-14 rounded-full font-medium text-[15px] transition-opacity disabled:opacity-60"
            style={{ background: tokens.ink, color: tokens.cream }}
          >
            {loading ? 'Envoi en cours...' : 'Recevoir un lien magique'}
          </button>
          {error && <p className="text-sm text-center" style={{ color: tokens.tomato }}>{error}</p>}
        </form>
      ) : (
        <div className="mt-10 w-full max-w-sm p-6 rounded-3xl text-center" style={{ background: tokens.paper }}>
          <div className="serif italic text-3xl leading-tight" style={{ color: tokens.ink }}>
            Vérifie tes mails.
          </div>
          <p className="text-sm mt-2" style={{ color: tokens.inkMuted }}>
            Clique sur le lien qu&apos;on vient d&apos;envoyer à <b>{email}</b>.
          </p>
        </div>
      )}

      <p className="mono text-[10px] tracking-widest uppercase mt-auto pt-10" style={{ color: tokens.inkFaint }}>
        · Cooky, le petit chef ·
      </p>
    </main>
  );
}
