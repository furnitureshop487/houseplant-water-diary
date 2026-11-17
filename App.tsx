import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import AddPlantScreen from './src/screens/AddPlantScreen';
import PlantHistoryScreen from './src/screens/PlantHistoryScreen';
import CareTipsScreen from './src/screens/CareTipsScreen';
import SettingsScreen, { type Settings } from './src/screens/SettingsScreen';
import { usePlants, type NewPlantDraft } from './src/hooks/usePlants';
import type { Plant, RoundResult } from './src/game/careEngine';
import theme from './src/constants/theme';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'addplant'
  | 'history'
  | 'tips'
  | 'settings';

const EMPTY_RESULT: RoundResult = {
  watered: 0,
  fed: 0,
  skipped: 0,
  durationSec: 0,
  streak: 0,
};

const DEFAULT_SETTINGS: Settings = {
  hour: 9,
  minute: 0,
  waterReminders: true,
  feedReminders: true,
  haptics: true,
};

/** State machine only - no gameplay lives here (rule #2). */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<RoundResult>(EMPTY_RESULT);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const {
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
  } = usePlants();

  // The queue is snapshotted when the round starts, so watering a plant
  // mid-round never reshuffles the cards underfoot.
  const roundQueue = useRef<Plant[]>([]);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startRound = useCallback(() => {
    roundQueue.current = queue;
    setScreen('game');
  }, [queue]);

  const handleRoundFinished = useCallback((next: RoundResult) => {
    setResult(next);
    setScreen('gameover');
  }, []);

  const openPlant = useCallback((id: string) => {
    setActiveId(id);
    setScreen('history');
  }, []);

  const handleAddPlant = useCallback(
    (draft: NewPlantDraft) => {
      addPlant(draft);
      setScreen('menu');
    },
    [addPlant],
  );

  const handleReset = useCallback(() => {
    resetDiary();
    setScreen('menu');
  }, [resetDiary]);

  // A plant can disappear under us (RESET DIARY); never leave a blank screen.
  const activePlant = plants.find(p => p.id === activeId) ?? null;
  const resolved: Screen = screen === 'history' && !activePlant ? 'menu' : screen;

  return (
    <View style={styles.root}>
      {resolved === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {resolved === 'menu' ? (
        <MenuScreen
          plants={sorted}
          counts={counts}
          onStart={startRound}
          onOpenPlant={openPlant}
          onAddPlant={() => setScreen('addplant')}
          onTips={() => setScreen('tips')}
          onSettings={() => setScreen('settings')}
        />
      ) : null}

      {resolved === 'game' ? (
        <GameScreen
          queue={roundQueue.current}
          streak={streak}
          haptics={settings.haptics}
          onWater={waterPlant}
          onFeed={feedPlant}
          onMenu={goMenu}
          onRoundFinished={handleRoundFinished}
        />
      ) : null}

      {resolved === 'gameover' ? (
        <GameOverScreen result={result} onPlayAgain={startRound} onMenu={goMenu} />
      ) : null}

      {resolved === 'addplant' ? (
        <AddPlantScreen
          haptics={settings.haptics}
          onSave={handleAddPlant}
          onClose={goMenu}
        />
      ) : null}

      {resolved === 'history' && activePlant ? (
        <PlantHistoryScreen
          plant={activePlant}
          log={log}
          onRepot={repotPlant}
          onBack={goMenu}
        />
      ) : null}

      {resolved === 'tips' ? <CareTipsScreen onBack={goMenu} /> : null}

      {resolved === 'settings' ? (
        <SettingsScreen
          settings={settings}
          onChange={setSettings}
          onReset={handleReset}
          onBack={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
});
