import 'server-only';
import { cookies } from 'next/headers';
import type { ContentItem } from './content';
export const READER_COOKIE = 'dmrk_reader';
export async function getReaderContent(slug: string): Promise<ContentItem | null> {
  const base = process.env.DMRK_API_URL;
  if (!base) return null;
  const token = (await cookies()).get(READER_COOKIE)?.value;
  const response = await fetch(`${base.replace(/\/$/, '')}/content/${encodeURIComponent(slug)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: 'no-store', signal: AbortSignal.timeout(25000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load article');
  return response.json();
}
