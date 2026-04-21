import { createClient } from '@/lib/supabase-server';
import LibraryClient from './LibraryClient';

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, subtitle, tags, tone, cooked_count, created_at, prep_minutes, cook_minutes')
    .order('created_at', { ascending: false });

  return <LibraryClient recipes={recipes ?? []} />;
}
