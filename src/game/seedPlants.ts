import { shiftDays, today } from '../utils/date';
import type { Plant } from './careEngine';

/**
 * Five demo plants so the diary is never an empty screen on first launch.
 * Offsets are chosen so the first round always has work to do: two overdue,
 * one due today, two still healthy.
 */
export function seedPlants(): Plant[] {
  const t = today();
  return [
    {
      id: 'p1',
      name: 'MONSTERA',
      spriteIndex: 1,
      lightSpot: 'BRIGHT',
      waterInterval: 7,
      feedInterval: 28,
      lastWatered: shiftDays(t, -10),
      lastFed: shiftDays(t, -21),
      addedOn: shiftDays(t, -96),
    },
    {
      id: 'p2',
      name: 'SNAKE PLANT',
      spriteIndex: 2,
      lightSpot: 'SHADE',
      waterInterval: 14,
      feedInterval: 56,
      lastWatered: shiftDays(t, -16),
      lastFed: shiftDays(t, -40),
      addedOn: shiftDays(t, -210),
    },
    {
      id: 'p3',
      name: 'ALOE VERA',
      spriteIndex: 3,
      lightSpot: 'BRIGHT',
      waterInterval: 12,
      feedInterval: 56,
      lastWatered: shiftDays(t, -12),
      lastFed: shiftDays(t, -30),
      addedOn: shiftDays(t, -150),
    },
    {
      id: 'p4',
      name: 'BOSTON FERN',
      spriteIndex: 4,
      lightSpot: 'PARTIAL',
      waterInterval: 4,
      feedInterval: 21,
      lastWatered: shiftDays(t, -2),
      lastFed: shiftDays(t, -9),
      addedOn: shiftDays(t, -64),
    },
    {
      id: 'p5',
      name: 'GOLDEN POTHOS',
      spriteIndex: 5,
      lightSpot: 'PARTIAL',
      waterInterval: 9,
      feedInterval: 35,
      lastWatered: shiftDays(t, -3),
      lastFed: shiftDays(t, -14),
      addedOn: shiftDays(t, -40),
    },
  ];
}

export function seedLog(plants: Plant[]) {
  return plants.flatMap(p => [
    { id: `${p.id}-w0`, plantId: p.id, type: 'water' as const, date: p.lastWatered },
    { id: `${p.id}-f0`, plantId: p.id, type: 'feed' as const, date: p.lastFed },
  ]);
}
