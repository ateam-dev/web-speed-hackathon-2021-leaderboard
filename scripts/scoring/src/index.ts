import type { Competitor } from './types';
import { scoring } from './scoring';

export async function main(id: string, url: string) {
  const competitor: Competitor = {
    id,
    url,
  };

  const targetPaths = [
    '/',
    '/posts/01EXH20KRBVP34RYHYDTSX8JS2',
    '/posts/01EQG3WDDBBTDKG1C5Y0A70EGB',
    '/posts/01EWPC3XWCMVR15D8KESF7ATR7',
    '/users/mexicandraggle',
    '/terms'
  ];

  const result = await scoring(competitor, targetPaths);

  return result;
}
