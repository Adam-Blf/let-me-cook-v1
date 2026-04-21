// Fallback page servie par le service worker quand l'utilisateur est offline
import { Cooky } from '@/components/Cooky';
import { tokens } from '@/lib/tokens';

export const dynamic = 'force-static';

export default function OfflinePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: `radial-gradient(ellipse at 50% 45%, ${tokens.creamSoft}, ${tokens.cream})` }}
    >
      <Cooky size={160} pose="sleeping" />
      <div className="mono text-[11px] tracking-widest uppercase mt-6" style={{ color: tokens.inkMuted }}>
        HORS LIGNE
      </div>
      <h1
        className="serif italic leading-tight mt-2"
        style={{ color: tokens.ink, fontSize: 'clamp(40px, 10vw, 64px)', letterSpacing: '-0.03em' }}
      >
        Cooky fait la sieste.
      </h1>
      <p className="text-sm mt-4 max-w-xs" style={{ color: tokens.inkMuted }}>
        Pas de réseau. Reviens dès que tu es connecté pour continuer la cuisine.
      </p>
    </main>
  );
}
