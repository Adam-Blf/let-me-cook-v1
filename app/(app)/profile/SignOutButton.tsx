'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { tokens } from '@/lib/tokens';

export default function SignOutButton() {
  const router = useRouter();
  const onSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  };
  return (
    <button
      onClick={onSignOut}
      className="w-full py-3 rounded-full mono text-[11px] tracking-widest uppercase"
      style={{ background: 'transparent', border: `1px solid ${tokens.line}`, color: tokens.tomato }}
    >
      Déconnexion
    </button>
  );
}
