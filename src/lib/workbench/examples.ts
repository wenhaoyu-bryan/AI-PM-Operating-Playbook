import { EXAMPLES } from '@/data/examples';
import type { WorkbenchProject } from './schema';

export function getExampleByKey(key: string): WorkbenchProject | null {
  const entry = EXAMPLES.find(e => e.key === key);
  return entry?.project ?? null;
}
