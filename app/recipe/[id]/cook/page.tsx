// Cook mode · dark, typo géante, step par step, timers
import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import CookClient from './CookClient';

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('id, title, steps')
    .eq('id', id)
    .single();

  if (!recipe) notFound();

  return <CookClient id={recipe.id} title={recipe.title} steps={(recipe.steps ?? []) as Array<{ t: string; timer: number | null }>} />;
}
