// Extraction de recette depuis une URL YouTube.
// 100 % gratuit · youtube-transcript (pas d'auth) + Groq Llama 3.1 70B (free tier).
//
// Groq free tier · 30 req/min · 6000 req/jour · Llama 3.1 70B Versatile · qualité
// proche de Claude Haiku · zéro coût permanent.
//
// Fine-tune path · remplacer le `groq` client par un HF Inference endpoint
// pointant sur ton modèle fine-tuné (ex. Phi-3 fine-tuné sur recipe dataset).
import { YoutubeTranscript } from 'youtube-transcript';
import Groq from 'groq-sdk';

function groqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY env var missing · créer clé gratuite sur console.groq.com');
  return new Groq({ apiKey });
}

// Lightweight zod-free schema
export type ExtractedRecipe = {
  title: string;
  subtitle: string;
  tags: string[];
  prep_minutes: number | null;
  cook_minutes: number | null;
  servings: number | null;
  ingredients: { q: string; u: string; name: string; cat: 'produce' | 'dairy' | 'meat' | 'pantry' }[];
  steps: { t: string; timer: number | null }[];
  source_author: string | null;
  tone: 'cream' | 'saffron' | 'tomato' | 'olive' | 'honey' | 'plum';
};

const SYSTEM_PROMPT = `Tu es Cooky, un chef cuisinier qui extrait des recettes depuis des transcripts de vidéos.
Tu reçois un transcript texte d'une vidéo YouTube de cuisine.
Tu extrais la recette au format JSON strict et uniquement JSON, rien d'autre.

Format attendu (exact) :
{
  "title": "string court en français",
  "subtitle": "string phrase d'accroche en français, 5-10 mots",
  "tags": ["tag1", "tag2", "tag3"],
  "prep_minutes": number ou null,
  "cook_minutes": number ou null,
  "servings": number ou null,
  "ingredients": [{"q": "200", "u": "g", "name": "spaghetti", "cat": "pantry"}],
  "steps": [{"t": "Étape descriptive en français", "timer": 10 ou null}],
  "source_author": "string ou null (ex: @chef_nom)",
  "tone": "cream | saffron | tomato | olive | honey | plum (choisir selon le type de plat)"
}

Règles :
- Quantités en unités métriques (g, ml, c.à.s, c.à.c, pièce)
- Catégories strictes : produce (fruits/légumes frais), dairy (œufs, lait, fromage), meat (viande/poisson), pantry (épicerie, secs, épices)
- Timer en minutes entier, null si pas de timer
- Titre court et évocateur en français, subtitle = pitch émotionnel
- Tags : 2-4 mots clés (type de plat, origine, durée totale)
- tone : "cream" pour dessert léger, "saffron" pour plats chauds, "tomato" pour sauce/bœuf, "olive" pour méditerranéen, "honey" pour pâtisserie, "plum" pour asiatique
- Si la transcript n'est pas une recette, renvoie {"error": "not_a_recipe"}
- Jamais de commentaire, jamais de markdown, JUSTE le JSON strict`;

async function fetchYouTubeTranscript(videoUrl: string): Promise<string> {
  const items = await YoutubeTranscript.fetchTranscript(videoUrl, { lang: 'fr' }).catch(async () => {
    // fallback sur anglais si pas de transcript français
    return YoutubeTranscript.fetchTranscript(videoUrl, { lang: 'en' });
  });
  return items.map((i) => i.text).join(' ').trim();
}

export async function extractRecipeFromYouTube(videoUrl: string): Promise<ExtractedRecipe> {
  const transcript = await fetchYouTubeTranscript(videoUrl);
  if (!transcript || transcript.length < 50) {
    throw new Error('Transcript trop court · la vidéo n\'a peut-être pas de sous-titres auto.');
  }

  const completion = await groqClient().chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Transcript vidéo YouTube:\n\n${transcript.slice(0, 12000)}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('LLM n\'a rien renvoyé');

  const parsed = JSON.parse(content);
  if (parsed.error === 'not_a_recipe') {
    throw new Error('Ce n\'est pas une recette. Essaie une autre vidéo de cuisine.');
  }

  return parsed as ExtractedRecipe;
}
