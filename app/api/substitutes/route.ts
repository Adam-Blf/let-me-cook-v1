// Génère des substitutions pour un ingrédient donné · via Groq Llama 3.1 70B (free).
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

function groqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY missing');
  return new Groq({ apiKey });
}

const SYSTEM_PROMPT = `Tu es Cooky, un chef français qui propose des substitutions d'ingrédients.
L'utilisateur te donne un ingrédient. Tu réponds en JSON strict uniquement ·
{
  "substitutes": [
    { "name": "nom ingrédient de remplacement", "ratio": "ratio d'équivalence ex. 1:1", "note": "courte note en français si besoin d'ajustement" }
  ],
  "tips": "1-2 phrases de conseil général en français sur l'ingrédient"
}
Donne 3-5 substituts pertinents, accessibles en supermarché français, du plus proche au plus exotique.`;

export async function POST(request: Request) {
  const { ingredient } = await request.json().catch(() => ({ ingredient: null }));
  if (!ingredient || typeof ingredient !== 'string') {
    return NextResponse.json({ error: 'Ingrédient manquant' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const completion = await groqClient().chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Ingrédient · ${ingredient}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 600,
    });
    const content = completion.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : { substitutes: [], tips: '' };
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Groq error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
