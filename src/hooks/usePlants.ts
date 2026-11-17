import { useCallback, useMemo, useState } from 'react';
import {
  buildQueue,
  careStreak,
  countBy,
  makeId,
  sortPlants,
  type LogEntry,
  type LogType,
  type Plant,
} from '../game/careEngine';
import { seedLog, seedPlants } from '../game/seedPlants';
import { today } from '../utils/date';

export type NewPlantDraft = {
  name: string;
  spriteIndex: number;
  lightSpot: Plant['lightSpot'];
  waterInterval: number;
  feedInterval: number;
};

/**
 * Single owner of the diary state. Screens take only the individual slices
 * they need (react-state-minimize) instead of the whole object.
 */
export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>(() => seedPlants());
  const [log, setLog] = useState<LogEntry[]>(() => seedLog(seedPlants()));

  const appendLog = useCallback((plantId: string, type: LogType) => {
    setLog(prev => [{ id: makeId(type), plantId, type, date: today() }, ...prev]);
  }, []);

  const waterPlant = useCallback(
    (plantId: string) => {
      setPlants(prev =>
        prev.map(p => (p.id === plantId ? { ...p, lastWatered: today() } : p)),
      );
      appendLog(plantId, 'water');
    },
    [appendLog],
  );

  const feedPlant = useCallback(
    (plantId: string) => {
      setPlants(prev =>
        prev.map(p => (p.id === plantId ? { ...p, lastFed: today() } : p)),
      );
      appendLog(plantId, 'feed');
    },
    [appendLog],
  );

  const repotPlant = useCallback(
    (plantId: string) => {
      appendLog(plantId, 'repot');
    },
    [appendLog],
  );

  const addPlant = useCallback((draft: NewPlantDraft) => {
    const id = makeId('plant');
    const stamp = today();
    const plant: Plant = {
      id,
      name: (draft.name || 'NEW PLANT').toUpperCase().slice(0, 18),
      spriteIndex: draft.spriteIndex,
      lightSpot: draft.lightSpot,
      waterInterval: draft.waterInterval,
      feedInterval: draft.feedInterval,
      lastWatered: stamp,
      lastFed: stamp,
      addedOn: stamp,
    };
    setPlants(prev => [...prev, plant]);
    return id;
  }, []);

  const resetDiary = useCallback(() => {
    const fresh = seedPlants();
    setPlants(fresh);
    setLog(seedLog(fresh));
  }, []);

  const sorted = useMemo(() => sortPlants(plants), [plants]);
  const counts = useMemo(() => countBy(plants), [plants]);
  const queue = useMemo(() => buildQueue(plants), [plants]);
  const streak = useMemo(() => careStreak(log), [log]);

  return {
    plants,
    sorted,
    counts,
    queue,
    log,
    streak,
    waterPlant,
    feedPlant,
    repotPlant,
    addPlant,
    resetDiary,
  };
}
