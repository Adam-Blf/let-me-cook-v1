// Edit existing recipe · prefill form from DB
import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import EditorClient from './EditorClient';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (!recipe) notFound();

  return <EditorClient recipe={recipe} />;
}
