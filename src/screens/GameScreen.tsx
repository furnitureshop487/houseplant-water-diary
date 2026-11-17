import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Vibration, View } from 'react-native';
import { ArrowRight, ChevronLeft, Droplet, Leaf } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import ProgressRail from '../components/ProgressRail';
import PlantFocusCard from '../components/PlantFocusCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import CheckmarkBurst from '../components/CheckmarkBurst';
import EmptyState from '../components/EmptyState';
import theme from '../constants/theme';
import { ANIM, HAPTIC_MS, SCREEN_W } from '../constants/config';
import { useCareRound } from '../hooks/useCareRound';
import { daysLeft, statusOf, type Plant, type RoundResult } from '../game/careEngine';
import assets, { spriteFor } from '../assets';

type Props = {
  queue: Plant[];
  streak: number;
  haptics: boolean;
  onWater: (plantId: string) => void;
  onFeed: (plantId: string) => void;
  onMenu: () => void;
  onRoundFinished: (result: RoundResult) => void;
};

/** GameLayout G3 - split panel: one plant card above, control block below. */
export default function GameScreen({
  queue,
  streak,
  haptics,
  onWater,
  onFeed,
  onMenu,
  onRoundFinished,
}: Props) {
  const round = useCareRound(queue);
  const { current, total, done, left, counters, bump, advance, durationSec, finished } = round;

  const [burst, setBurst] = useState(false);
  const slide = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const finish = useRef(onRoundFinished);
  finish.current = onRoundFinished;

  // The round ends exactly once, after the cursor runs past the last card.
  useEffect(() => {
    if (total === 0 || current || finished.current) return;
    finished.current = true;
    finish.current({
      watered: counters.watered,
      fed: counters.fed,
      skipped: counters.skipped,
      durationSec: durationSec(),
      streak,
    });
  }, [current, total, counters, durationSec, streak, finished]);

  const swapCard = useCallback(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: -SCREEN_W,
        duration: ANIM.cardSwap,
        useNativeDriver: true,
      }),
      Animated.timing(fade, { toValue: 0, duration: ANIM.cardSwap, useNativeDriver: true }),
    ]).start(() => {
      advance();
      slide.setValue(SCREEN_W * 0.35);
      Animated.parallel([
        Animated.timing(slide, { toValue: 0, duration: ANIM.cardSwap, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: ANIM.cardSwap, useNativeDriver: true }),
      ]).start();
    });
  }, [slide, fade, advance]);

  const handleWater = useCallback(() => {
    if (!current) return;
    onWater(current.id);
    bump('watered');
    if (haptics) Vibration.vibrate(HAPTIC_MS);
    setBurst(true);
  }, [current, onWater, bump, haptics]);

  const handleFeed = useCallback(() => {
    if (!current) return;
    onFeed(current.id);
    bump('fed');
    if (haptics) Vibration.vibrate(HAPTIC_MS);
    setBurst(true);
  }, [current, onFeed, bump, haptics]);

  const handleSkip = useCallback(() => {
    if (!current) return;
    bump('skipped');
    swapCard();
  }, [current, bump, swapCard]);

  const handleBurstDone = useCallback(() => {
    setBurst(false);
    swapCard();
  }, [swapCard]);

  const progress = total > 0 ? done / total : 0;
  const position = total > 0 ? Math.min(done + 1, total) : 0;

  return (
    <AppShell variant="game">
      <ScreenHeader
        title="WATERING ROUND"
        subtitle={total > 0 ? `${position} OF ${total}` : 'NOTHING DUE'}
        leftSlot={
          <IconTile Icon={ChevronLeft} onPress={onMenu} label="back to my plants" />
        }
        rightSlot={<IconTile source={assets.iconPause} onPress={onMenu} label="pause round" />}
      />

      <ProgressRail progress={progress} />

      <View style={styles.area}>
        {current ? (
          <Animated.View
            pointerEvents="box-none"
            style={[styles.cardWrap, { opacity: fade, transform: [{ translateX: slide }] }]}>
            <PlantFocusCard
              name={current.name}
              spriteIndex={current.spriteIndex}
              lightSpot={current.lightSpot}
              waterInterval={current.waterInterval}
              status={statusOf(current)}
              days={daysLeft(current)}
            />
          </Animated.View>
        ) : (
          <EmptyState
            sprite={spriteFor(4)}
            title="NOTHING THIRSTY TODAY"
            subtitle="COME BACK TOMORROW"
          />
        )}
        <CheckmarkBurst visible={burst} onDone={handleBurstDone} />
      </View>

      <View style={styles.panel}>
        <StatRow
          variant="strip"
          items={[
            { value: done, label: 'DONE', valueColor: theme.colors.sage },
            { value: left, label: 'LEFT', valueColor: theme.colors.accent },
            { value: counters.skipped, label: 'SKIPPED', valueColor: theme.colors.textMuted },
          ]}
        />

        {current ? (
          <>
            <PrimaryButton
              label="MARK WATERED"
              Icon={Droplet}
              onPress={handleWater}
              style={styles.primary}
            />
            <View style={styles.secondaryRow}>
              <SecondaryButton
                label="FED TODAY"
                Icon={Leaf}
                tint={theme.colors.sage}
                onPress={handleFeed}
                grow
              />
              <SecondaryButton
                label="SKIP"
                Icon={ArrowRight}
                tint={theme.colors.textMuted}
                onPress={handleSkip}
                grow
              />
            </View>
          </>
        ) : (
          <PrimaryButton
            label="BACK TO MY PLANTS"
            Icon={ChevronLeft}
            onPress={onMenu}
            style={styles.primary}
          />
        )}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: { width: '100%', alignItems: 'center' },
  panel: {
    borderTopLeftRadius: theme.radius.panel,
    borderTopRightRadius: theme.radius.panel,
    backgroundColor: 'rgba(22,17,10,0.92)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  primary: { marginTop: 12 },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
