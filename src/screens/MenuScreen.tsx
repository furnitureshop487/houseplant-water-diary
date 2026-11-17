import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import {
  BookOpen,
  Droplet,
  Heart,
  Leaf,
  Plus,
  Settings as SettingsIcon,
  Clock,
} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import PlantCard from '../components/PlantCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import IconTile from '../components/IconTile';
import StatRow from '../components/StatRow';
import theme from '../constants/theme';
import { ANIM, HERO_ART, PLANT_ROW_H } from '../constants/config';
import { daysLeft, statusOf, type CareStatus, type Plant } from '../game/careEngine';
import { spriteFor } from '../assets';

type Counts = {
  due: number;
  overdue: number;
  healthy: number;
  wateredToday: number;
  dueCount: number;
  total: number;
};

type Props = {
  plants: Plant[];
  counts: Counts;
  onStart: () => void;
  onOpenPlant: (id: string) => void;
  onAddPlant: () => void;
  onTips: () => void;
  onSettings: () => void;
};

type Row = {
  id: string;
  name: string;
  spriteIndex: number;
  status: CareStatus;
  days: number;
  lightSpot: string;
};

const MIDDOT = '·';

/** MenuLayout M4 - asymmetric editorial: left-flush hero, art pinned right. */
export default function MenuScreen({
  plants,
  counts,
  onStart,
  onOpenPlant,
  onAddPlant,
  onTips,
  onSettings,
}: Props) {
  const heroIn = useRef(new Animated.Value(0)).current;
  const ctaIn = useRef(new Animated.Value(0.94)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(60),
      Animated.timing(heroIn, { toValue: 1, duration: ANIM.fadeSlow, useNativeDriver: true }),
    ]).start();

    Animated.spring(ctaIn, {
      toValue: 1,
      tension: ANIM.entrySpring.tension,
      friction: ANIM.entrySpring.friction,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: ANIM.floatLoop / 2,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: ANIM.floatLoop / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [heroIn, ctaIn, float]);

  const rows: Row[] = plants.map(p => ({
    id: p.id,
    name: p.name,
    spriteIndex: p.spriteIndex,
    status: statusOf(p),
    days: daysLeft(p),
    lightSpot: p.lightSpot,
  }));

  const renderItem = useCallback(
    ({ item, index }: { item: Row; index: number }) => (
      <PlantCard
        id={item.id}
        name={item.name}
        spriteIndex={item.spriteIndex}
        status={item.status}
        days={item.days}
        lightSpot={item.lightSpot}
        index={index}
        onPress={onOpenPlant}
      />
    ),
    [onOpenPlant],
  );

  const keyExtractor = useCallback((item: Row) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Row> | null | undefined, index: number) => ({
      length: PLANT_ROW_H + 12,
      offset: (PLANT_ROW_H + 12) * index,
      index,
    }),
    [],
  );

  const heroY = heroIn.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });
  const heroSprite = spriteFor(plants.length > 0 ? plants[0].spriteIndex : 1);

  return (
    <AppShell variant="menu">
      <ScreenHeader
        title="MY PLANTS"
        align="left"
        rightSlot={
          <View style={styles.countPill}>
            <Leaf size={16} color={theme.colors.sage} strokeWidth={2.4} />
            <Text style={styles.countText}>{counts.total} PLANTS</Text>
          </View>
        }
      />

      <View style={styles.heroWrap} pointerEvents="none">
        <Animated.Image
          source={heroSprite}
          style={[styles.heroArt, { transform: [{ translateY: floatY }] }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.heroText, { opacity: heroIn, transform: [{ translateY: heroY }] }]}>
          <Text style={styles.heroTop} numberOfLines={1}>
            TODAY
          </Text>
          {counts.dueCount > 0 ? (
            <Text style={styles.heroCount} numberOfLines={1} adjustsFontSizeToFit>
              {counts.dueCount} TO WATER
            </Text>
          ) : (
            <Text style={styles.heroCalm} numberOfLines={1} adjustsFontSizeToFit>
              ALL HYDRATED
            </Text>
          )}
          <View style={styles.heroRule} />
          <Text style={styles.tagline} numberOfLines={1}>
            {`WATERING ${MIDDOT} FEEDING ${MIDDOT} REPOTTING`}
          </Text>
        </Animated.View>
      </View>

      <StatRow
        style={styles.stats}
        items={[
          {
            Icon: Droplet,
            value: counts.wateredToday,
            label: 'WATERED',
            valueColor: theme.colors.accent,
            hideZero: true,
          },
          {
            Icon: Heart,
            value: counts.healthy,
            label: 'HEALTHY',
            valueColor: theme.colors.sage,
            hideZero: true,
          },
          {
            Icon: Clock,
            value: counts.overdue,
            label: 'OVERDUE',
            valueColor: theme.colors.terracotta,
            hideZero: true,
          },
        ]}
      />

      <View style={styles.listWrap}>
        <FlatList
          data={rows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews={false}
        />
      </View>

      <Text style={styles.hint}>TAP A PLANT FOR ITS DIARY</Text>

      <View style={styles.ctaBlock}>
        <Animated.View pointerEvents="box-none" style={{ transform: [{ scale: ctaIn }] }}>
          <PrimaryButton label="START WATERING" Icon={Droplet} onPress={onStart} />
        </Animated.View>

        <View style={styles.secondaryRow}>
          <SecondaryButton
            label="ADD PLANT"
            Icon={Plus}
            tint={theme.colors.primaryLight}
            onPress={onAddPlant}
            grow
          />
          <SecondaryButton
            label="CARE TIPS"
            Icon={BookOpen}
            tint={theme.colors.sage}
            onPress={onTips}
            grow
          />
          <IconTile
            Icon={SettingsIcon}
            onPress={onSettings}
            label="settings"
            tint={theme.colors.textSecondary}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  countPill: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  countText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, color: theme.colors.text },

  heroWrap: { height: 134, paddingHorizontal: 24, paddingTop: 8 },
  heroArt: {
    position: 'absolute',
    right: 10,
    top: 8,
    width: HERO_ART,
    height: HERO_ART,
    resizeMode: 'contain',
    opacity: 0.95,
  },
  heroText: { paddingRight: HERO_ART + 16 },
  heroTop: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 42,
    color: theme.colors.text,
  },
  heroCount: { fontSize: 26, fontWeight: '900', letterSpacing: 0.6, color: theme.colors.accent },
  heroCalm: { fontSize: 24, fontWeight: '900', letterSpacing: 0.6, color: theme.colors.sage },
  heroRule: {
    width: 48,
    height: 3,
    borderRadius: 2,
    marginTop: 12,
    backgroundColor: theme.colors.primary,
  },
  tagline: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },

  stats: { paddingHorizontal: 20, marginTop: 2 },

  listWrap: { flex: 1, marginTop: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 12 },

  hint: {
    paddingHorizontal: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: theme.colors.textMuted,
  },

  ctaBlock: { paddingHorizontal: 20, paddingBottom: 26 },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'center' },
});
