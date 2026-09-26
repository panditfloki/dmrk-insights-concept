import { NextRequest, NextResponse } from 'next/server';
import { isReaderProvider, readerNext, readerOrigin, socialApi, socialCookie } from '@/lib/reader-social';
import { READER_COOKIE } from '@/lib/reader';

async function callback(request: NextRequest, {params}: {params: Promise<{provider: string}>}) {
  const {provider} = await params;
  if (!isReaderProvider(provider)) return new NextResponse('Not found', {status: 404});
  const origin = readerOrigin();
  const destination = new URL('/reader/login', origin);
  destination.searchParams.set('social_error', 'failed');
  let session: string | undefined;
  try {
    const body = request.method === 'POST' ? await request.text() : '';
    if (body.length > 16384) throw new Error('Invalid callback');
    const fields = request.method === 'POST' ? new URLSearchParams(body) : request.nextUrl.searchParams;
    const binding = request.cookies.get(socialCookie(provider))?.value;
    const state = fields.get('state');
    if (!binding || !/^[a-f0-9]{64}$/.test(binding) || !state || !/^[a-f0-9]{64}$/.test(state)) {
      destination.searchParams.set('social_error', 'expired');
    } else {
      const result = await socialApi(`${provider}/complete`, {binding, state, code: fields.get('code'), error: fields.get('error')});
      const data = await result.json();
      destination.searchParams.set('next', readerNext(data.next));
      if (result.ok && typeof data.token === 'string' && /^[a-f0-9]{64}$/.test(data.token)) {
        session = data.token;
        destination.pathname = readerNext(data.next);
        destination.search = '';
      } else {
        const allowed = ['cancelled', 'expired', 'existing_account', 'unavailable', 'retry'];
        destination.searchParams.set('social_error', allowed.includes(data.error) ? data.error : 'failed');
      }
    }
  } catch { /* Use a controlled message without exposing provider details. */ }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.cookies.set(socialCookie(provider), '', {path: '/api/readers/social', maxAge: 0, httpOnly: true, secure: origin.startsWith('https://'), sameSite: provider === 'apple' ? 'none' : 'lax'});
  if (session) response.cookies.set(READER_COOKIE, session, {httpOnly: true, secure: origin.startsWith('https://'), sameSite: 'lax', path: '/', maxAge: 14 * 86400});
  return response;
}
export const GET = callback;
export const POST = callback;
