import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { extractRecipeFromYouTube } from '@/lib/extract';

export const runtime = 'nodejs'; // youtube-transcript a besoin de Node, pas Edge
export const maxDuration = 30;

export async function POST(request: Request) {
  const { url } = await request.json().catch(() => ({ url: null }));
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  // Check subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_active')
    .eq('id', user.id)
    .single();

  if (!profile?.subscription_active) {
    return NextResponse.json({ error: 'Abonnement requis', code: 'paywall' }, { status: 402 });
  }

  // Only YouTube supported in V1
  if (!/youtube\.com|youtu\.be/.test(url)) {
    return NextResponse.json(
      { error: 'V1 supporte uniquement YouTube pour le moment. TikTok / Insta bientôt.' },
      { status: 400 }
    );
  }

  try {
    const recipe = await extractRecipeFromYouTube(url);

    // Persist in DB
    const { data: saved, error: saveErr } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        source_url: url,
        source_platform: 'youtube',
        source_author: recipe.source_author,
        title: recipe.title,
        subtitle: recipe.subtitle,
        tags: recipe.tags,
        prep_minutes: recipe.prep_minutes,
        cook_minutes: recipe.cook_minutes,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        tone: recipe.tone,
      })
      .select()
      .single();

    if (saveErr) throw saveErr;

    // Log event (best effort)
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'extract_success',
      metadata: { url, platform: 'youtube' },
    });

    return NextResponse.json({ recipe: saved });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Extraction failed';
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'extract_error',
      metadata: { url, error: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
