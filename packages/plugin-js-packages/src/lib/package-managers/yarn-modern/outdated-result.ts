import type { OutdatedResult } from '../../runner/outdated/types.js';
import type { Yarnv2OutdatedResultJson } from './types.js';

export function yarnv2ToOutdatedResult(output: string): OutdatedResult {
  const npmOutdated = JSON.parse(output) as Yarnv2OutdatedResultJson;

  return npmOutdated.map(({ name, current, latest, type }) => ({
    name,
    current,
    latest,
    type,
  }));
}
