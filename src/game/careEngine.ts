import { daysSince, today } from '../utils/date';
import type { LightSpot } from '../constants/config';

export type Plant = {
  id: string;
  name: string;
  spriteIndex: number;
  lightSpot: LightSpot;
  waterInterval: number;
  feedInterval: number;
  lastWatered: string;
  lastFed: string;
  addedOn: string;
};

export type LogType = 'water' | 'feed' | 'repot';

export type LogEntry = {
  id: string;
  plantId: string;
  type: LogType;
  date: string;
};

export type CareStatus = 'overdue' | 'due' | 'healthy' | 'watered';

export type RoundResult = {
  watered: number;
  fed: number;
  skipped: number;
  durationSec: number;
  streak: number;
};

/** Days remaining until the next watering. <= 0 means it is already due. */
export function daysLeft(plant: Plant): number {
  return plant.waterInterval - daysSince(plant.lastWatered);
}

export function statusOf(plant: Plant): CareStatus {
  if (plant.lastWatered === today()) return 'watered';
  const left = daysLeft(plant);
  if (left < 0) return 'overdue';
  if (left === 0) return 'due';
  return 'healthy';
}

export function isThirsty(plant: Plant): boolean {
  const s = statusOf(plant);
  return s === 'due' || s === 'overdue';
}

/** overdue first, then due today, then by days remaining ascending. */
export function sortPlants(plants: Plant[]): Plant[] {
  const rank: Record<CareStatus, number> = { overdue: 0, due: 1, healthy: 2, watered: 3 };
  return [...plants].sort((a, b) => {
    const ra = rank[statusOf(a)];
    const rb = rank[statusOf(b)];
    if (ra !== rb) return ra - rb;
    return daysLeft(a) - daysLeft(b);
  });
}

export function buildQueue(plants: Plant[]): Plant[] {
  return sortPlants(plants.filter(isThirsty));
}

export function countBy(plants: Plant[]) {
  let due = 0;
  let overdue = 0;
  let healthy = 0;
  let wateredToday = 0;
  for (const p of plants) {
    switch (statusOf(p)) {
      case 'overdue':
        overdue += 1;
        break;
      case 'due':
        due += 1;
        break;
      case 'watered':
        wateredToday += 1;
        healthy += 1;
        break;
      default:
        healthy += 1;
    }
  }
  return { due, overdue, healthy, wateredToday, dueCount: due + overdue, total: plants.length };
}

export function logsFor(log: LogEntry[], plantId: string): LogEntry[] {
  return log
    .filter(e => e.plantId === plantId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function countType(log: LogEntry[], plantId: string, type: LogType): number {
  return log.reduce((n, e) => (e.plantId === plantId && e.type === type ? n + 1 : n), 0);
}

/** Consecutive days (ending today or yesterday) with at least one watering. */
export function careStreak(log: LogEntry[]): number {
  const days = new Set(log.filter(e => e.type === 'water').map(e => e.date));
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(keyOf(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(keyOf(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(keyOf(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function keyOf(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
