import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Droplet, Home, Leaf, RotateCcw, SkipForward } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import StatRow from '../components/StatRow';
import theme from '../constants/theme';
import { ANIM, SCREEN_H } from '../constants/config';
import { spriteFor } from '../assets';
import type { RoundResult } from '../game/careEngine';

type Props = {
  result: RoundResult;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const SPRITE = SCREEN_H < 700 ? 124 : 150;

/** Round Summary - the discrete end-of-round screen (rule #12). */
export default function GameOverScreen({ result, onPlayAgain, onMenu }: Props) {
  const spriteIn = useRef(new Animated.Value(0.6)).current;
  const headIn = useRef(new Animated.Value(0)).current;
  const ctaIn = useRef(new Animated.Value(0)).current;

  const perfect = result.skipped === 0 && result.watered > 0;

  useEffect(() => {
    Animated.spring(spriteIn, {
      toValue: 1,
      tension: 52,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(140),
      Animated.timing(headIn, { toValue: 1, duration: ANIM.fadeSlow, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(320),
      Animated.timing(ctaIn, { toValue: 1, duration: ANIM.fade, useNativeDriver: true }),
    ]).start();
  }, [spriteIn, headIn, ctaIn]);

  const headY = headIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const handled = result.watered + result.fed;

  return (
    <AppShell variant="gameover">
      <ScreenHeader
        title="ROUND SUMMARY"
        subtitle={result.streak >= 2 ? `${result.streak}-DAY STREAK` : undefined}
        rightSlot={<IconTile Icon={Home} onPress={onMenu} label="back to my plants" />}
      />

      <View style={styles.body}>
        <Animated.Image
          source={spriteFor(3)}
          style={[styles.sprite, { transform: [{ scale: spriteIn }] }]}
        />

        <Animated.View
          pointerEvents="none"
          style={[styles.headBlock, { opacity: headIn, transform: [{ translateY: headY }] }]}>
          <Text style={styles.headline} numberOfLines={1} adjustsFontSizeToFit>
            ROUND COMPLETE
          </Text>
          <View style={styles.rule} />
          {perfect ? <View style={styles.ruleSage} /> : null}
          <Text style={styles.subline}>
            {result.watered} PLANTS WATERED
          </Text>
        </Animated.View>

        <View style={styles.statsWrap}>
          <StatRow
            items={[
              {
                Icon: Droplet,
                value: result.watered,
                label: 'WATERED',
                valueColor: theme.colors.accent,
                hideZero: true,
              },
              {
                Icon: Leaf,
                value: result.fed,
                label: 'FED',
                valueColor: theme.colors.sage,
                hideZero: true,
              },
              {
                Icon: SkipForward,
                value: result.skipped,
                label: 'SKIPPED',
                valueColor: theme.colors.terracotta,
                hideZero: true,
              },
            ]}
          />
          {handled + result.skipped > 0 &&
          [result.watered, result.fed, result.skipped].filter(v => v > 0).length < 2 ? (
            <StatCard
              Icon={Droplet}
              value={handled + result.skipped}
              label="PLANTS HANDLED"
              valueColor={theme.colors.accent}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.ctaBlock}>
        <Text style={styles.hint}>YOUR SILL IS HAPPY TODAY</Text>
        <Animated.View pointerEvents="box-none" style={{ opacity: ctaIn }}>
          <PrimaryButton label="START AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />
        </Animated.View>
        <SecondaryButton
          label="BACK TO MY PLANTS"
          Icon={Home}
          tint={theme.colors.textSecondary}
          onPress={onMenu}
          style={styles.secondary}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  sprite: { width: SPRITE, height: SPRITE, resizeMode: 'contain' },
  headBlock: { alignItems: 'center', marginTop: 10 },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.text,
    textAlign: 'center',
  },
  rule: {
    width: 56,
    height: 3,
    borderRadius: 2,
    marginTop: 12,
    backgroundColor: theme.colors.accent,
  },
  ruleSage: {
    width: 32,
    height: 3,
    borderRadius: 2,
    marginTop: 5,
    backgroundColor: theme.colors.sage,
  },
  subline: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.accent,
  },
  statsWrap: { width: '100%', marginTop: 22, gap: 10 },
  ctaBlock: { paddingHorizontal: 20, paddingBottom: 26 },
  hint: {
    marginBottom: 8,
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  secondary: { marginTop: 10 },
});
