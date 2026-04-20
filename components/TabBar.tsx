'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tokens } from '@/lib/tokens';

const TABS = [
  { href: '/library', label: 'Biblio', icon: '▦' },
  { href: '/shopping', label: 'Courses', icon: '☰' },
  { href: '/add', label: '+', icon: '＋', primary: true },
  { href: '/search', label: 'Search', icon: '○' },
  { href: '/profile', label: 'Profil', icon: '◉' },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: tokens.paper,
        borderTop: `1px solid ${tokens.line}`,
        paddingTop: 8,
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        height: 'calc(68px + env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map((t) => {
        const active = pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href));
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col items-center justify-center min-w-[52px] flex-1"
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: t.primary ? 44 : 34,
                height: t.primary ? 44 : 34,
                background: t.primary
                  ? tokens.saffron
                  : active
                  ? tokens.ink
                  : 'transparent',
                color: t.primary
                  ? tokens.espresso
                  : active
                  ? tokens.cream
                  : tokens.inkMuted,
                fontSize: t.primary ? 22 : 14,
                fontWeight: t.primary ? 700 : 500,
              }}
            >
              {t.icon}
            </div>
            {!t.primary && (
              <div
                className="mono text-[9px] tracking-widest uppercase mt-[2px]"
                style={{ color: active ? tokens.ink : tokens.inkMuted }}
              >
                {t.label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
