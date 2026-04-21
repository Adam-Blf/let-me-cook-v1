'use client';
import { useEffect, useState } from 'react';
import { tokens } from '@/lib/tokens';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'lmc_install_dismissed_at';
const DISMISS_DAYS = 7;

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return; // déjà installé

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const ago = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (ago < DISMISS_DAYS) return;
    }

    setDismissed(false);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(navigator as unknown as { standalone?: boolean }).standalone;
    setIsIOS(ios);
    if (ios) {
      setShowIOSHint(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  const install = async () => {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') dismiss();
    setEvent(null);
  };

  if (dismissed) return null;

  // Android/Desktop prompt natif
  if (event && !isIOS) {
    return (
      <div
        className="fixed bottom-[calc(78px+env(safe-area-inset-bottom))] left-4 right-4 z-50 p-4 rounded-2xl flex items-center gap-3"
        style={{
          background: tokens.ink,
          color: tokens.cream,
          boxShadow: '0 10px 40px rgba(26,21,17,0.25)',
        }}
      >
        <div className="flex-1">
          <div className="font-medium text-sm">Installer Let Me Cook</div>
          <div className="text-xs opacity-70 mt-[2px]">Ouverture rapide, hors ligne, et partage direct</div>
        </div>
        <button
          onClick={install}
          className="px-4 py-2 rounded-full mono text-[11px] tracking-widest uppercase"
          style={{ background: tokens.saffron, color: tokens.espresso }}
        >
          Installer
        </button>
        <button
          onClick={dismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(246,241,232,0.1)', color: tokens.cream }}
        >
          ×
        </button>
      </div>
    );
  }

  // iOS Safari · instructions visuelles
  if (showIOSHint && isIOS) {
    return (
      <div
        className="fixed bottom-[calc(78px+env(safe-area-inset-bottom))] left-4 right-4 z-50 p-4 rounded-2xl"
        style={{
          background: tokens.ink,
          color: tokens.cream,
          boxShadow: '0 10px 40px rgba(26,21,17,0.25)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="font-medium text-sm">Installe Let Me Cook sur ton iPhone</div>
            <div className="text-xs opacity-80 mt-2 leading-relaxed">
              Touche <b>⇪</b> en bas de Safari → <b>Sur l&apos;écran d&apos;accueil</b>. L&apos;app s&apos;ouvre comme native, sans barre d&apos;adresse.
            </div>
          </div>
          <button
            onClick={dismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(246,241,232,0.1)', color: tokens.cream }}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return null;
}
