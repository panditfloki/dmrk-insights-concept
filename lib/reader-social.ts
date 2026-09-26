import 'server-only';

export type ReaderProvider = 'google' | 'apple';
export function isReaderProvider(value: string): value is ReaderProvider {
  return value === 'google' || value === 'apple';
}
export function readerNext(value: unknown): string {
  return typeof value === 'string' && /^\/insights(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(value) ? value : '/insights';
}
export function readerOrigin(): string {
  return process.env.DMRK_PUBLIC_SITE === 'true' ? 'https://dmrkinsights.com' : process.env.DMRK_SITE_ORIGIN || 'http://127.0.0.1:3210';
}
export function socialCookie(provider: ReaderProvider): string {
  return `dmrk_oauth_${provider}`;
}
export async function socialApi(path: string, body?: object): Promise<Response> {
  const base = process.env.DMRK_API_URL;
  if (!base) throw new Error('Reader service unavailable');
  return fetch(`${base.replace(/\/$/, '')}/readers/social/${path}`, {
    method: body ? 'POST' : 'GET', cache: 'no-store', signal: AbortSignal.timeout(path === 'providers' ? 5000 : path.endsWith('/complete') ? 45000 : 15000),
    headers: {Accept: 'application/json', ...(body ? {'Content-Type': 'application/json'} : {})},
    ...(body ? {body: JSON.stringify(body)} : {}),
  });
}
export async function readerProviders(): Promise<Record<ReaderProvider, boolean>> {
  try {
    const response = await socialApi('providers');
    if (!response.ok) return {google: false, apple: false};
    const data = await response.json();
    return {google: data.google === true, apple: data.apple === true && readerOrigin().startsWith('https://')};
  } catch {return {google: false, apple: false};}
}
