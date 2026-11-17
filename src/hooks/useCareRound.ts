import { useCallback, useRef, useState } from 'react';
import type { Plant } from '../game/careEngine';

export type RoundCounters = { watered: number; fed: number; skipped: number };

/**
 * Owns the per-round cursor. The queue is a snapshot taken when the round
 * starts, so mutating a plant mid-round never reshuffles the cards underfoot.
 */
export function useCareRound(queue: Plant[]) {
  const [index, setIndex] = useState(0);
  const [counters, setCounters] = useState<RoundCounters>({ watered: 0, fed: 0, skipped: 0 });
  const startedAt = useRef(Date.now());
  const finished = useRef(false);

  const total = queue.length;
  const current = index < total ? queue[index] : null;
  const done = counters.watered + counters.fed + counters.skipped;
  const left = Math.max(0, total - done);

  const bump = useCallback((key: keyof RoundCounters) => {
    setCounters(prev => ({ ...prev, [key]: prev[key] + 1 }));
  }, []);

  const advance = useCallback(() => {
    setIndex(prev => prev + 1);
  }, []);

  const durationSec = useCallback(
    () => Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
    [],
  );

  return { index, total, current, counters, done, left, bump, advance, durationSec, finished };
}
