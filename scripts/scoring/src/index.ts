import type { Competitor } from './types';
import { scoring } from './scoring';

export async function main(id: string, url: string) {
  const competitor: Competitor = {
    id,
    url,
  };

  const targetPaths = ['/'];

  const result = await scoring(competitor, targetPaths);

  return result;
}
