// Main app · paste URL → extract, recipe list
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AppClient from './AppClient';

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_active, subscription_tier, lang')
    .eq('id', user.id)
    .single();

  if (!profile?.subscription_active) redirect('/paywall');

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, subtitle, tags, tone, cooked_count, created_at')
    .order('created_at', { ascending: false })
    .limit(30);

  return <AppClient email={user.email ?? ''} recipes={recipes ?? []} />;
}
