import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isReaderProvider, readerNext, readerOrigin, socialApi, socialCookie } from '@/lib/reader-social';

export async function POST(request: NextRequest, {params}: {params: Promise<{provider: string}>}) {
  const {provider} = await params;
  if (!isReaderProvider(provider)) return NextResponse.json({message: 'Not found'}, {status: 404});
  const origin = readerOrigin();
  if (request.headers.get('origin') !== origin) return NextResponse.json({message: 'Invalid origin'}, {status: 403});
  if (provider === 'apple' && !origin.startsWith('https://')) return NextResponse.json({message: 'Apple sign-in is not available in this preview. Please sign in with email.'}, {status: 503});
  try {
    const text = await request.text();
    if (text.length > 2048) return NextResponse.json({message: 'Request too large'}, {status: 413});
    const fields = JSON.parse(text);
    if (fields.terms !== true) return NextResponse.json({message: 'Please accept the terms to continue.'}, {status: 422});
    const binding = randomBytes(32).toString('hex');
    const upstream = await socialApi(`${provider}/start`, {binding, terms: true, next: readerNext(fields.next)});
    if (!upstream.ok) return NextResponse.json({message: 'This sign-in option is temporarily unavailable. Please use email.'}, {status: upstream.status === 429 ? 429 : 503});
    const data = await upstream.json();
    const destination = new URL(data.url);
    const trusted = provider === 'google' ? 'https://accounts.google.com/o/oauth2/v2/auth' : 'https://appleid.apple.com/auth/authorize';
    if (`${destination.origin}${destination.pathname}` !== trusted || destination.username || destination.password
      || destination.searchParams.get('redirect_uri') !== `${origin}/api/readers/social/${provider}/callback`) throw new Error('Invalid provider configuration');
    const response = NextResponse.json({url: destination.href}, {headers: {'Cache-Control': 'private, no-store'}});
    response.cookies.set(socialCookie(provider), binding, {
      httpOnly: true, secure: origin.startsWith('https://'), sameSite: provider === 'apple' ? 'none' : 'lax',
      path: '/api/readers/social', maxAge: 600,
    });
    return response;
  } catch {return NextResponse.json({message: 'Unable to start sign-in. Please try again.'}, {status: 503});}
}
