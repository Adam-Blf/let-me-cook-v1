// Layout des pages authenticated · gate auth + sub + tab bar
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TabBar } from '@/components/TabBar';
import { InstallPrompt } from '@/components/InstallPrompt';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_active')
    .eq('id', user.id)
    .single();

  if (!profile?.subscription_active) redirect('/paywall');

  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: 'calc(68px + env(safe-area-inset-bottom))' }}>
      {children}
      <InstallPrompt />
      <TabBar />
    </div>
  );
}
