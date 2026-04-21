// Share target endpoint · reçoit l'URL depuis le partage système PWA
// (share_target dans manifest.webmanifest) et redirige vers /add avec pré-rempli.
import { NextResponse } from 'next/server';

function extractUrl(raw: string | null): string | null {
  if (!raw) return null;
  const match = raw.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : raw;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = extractUrl(searchParams.get('url') ?? searchParams.get('text') ?? searchParams.get('title'));
  const target = new URL('/add', request.url);
  if (url) target.searchParams.set('url', url);
  return NextResponse.redirect(target);
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  let url: string | null = null;
  if (formData) {
    url =
      extractUrl((formData.get('url') as string) ?? null) ??
      extractUrl((formData.get('text') as string) ?? null) ??
      extractUrl((formData.get('title') as string) ?? null);
  }
  const target = new URL('/add', request.url);
  if (url) target.searchParams.set('url', url);
  return NextResponse.redirect(target, { status: 303 });
}
