import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import { statusColor, statusLabel } from './StatusChip';
import theme from '../constants/theme';
import { ANIM, PLANT_ROW_H } from '../constants/config';
import { spriteFor } from '../assets';

type Props = {
  id: string;
  name: string;
  spriteIndex: number;
  status: 'overdue' | 'due' | 'healthy' | 'watered';
  days: number;
  lightSpot: string;
  index: number;
  onPress: (id: string) => void;
};

/**
 * List row. Primitives only (no plant object) so React.memo actually bites,
 * and an explicit height so the Pressable never relies on intrinsic sizing.
 */
function PlantCard({ id, name, spriteIndex, status, days, lightSpot, index, onPress }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const color = statusColor(status);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: ANIM.listItem,
      delay: Math.min(index, 8) * ANIM.listStagger,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.animWrap, { opacity: enter, transform: [{ translateY }] }]}>
      <PressableScale
        onPress={() => onPress(id)}
        accessibilityLabel={`${name} diary`}
        style={styles.hit}
        innerStyle={[styles.shell, { borderColor: `${color}44` }]}>
        <View style={[styles.accentBar, { backgroundColor: color }]} />
        <Image source={spriteFor(spriteIndex)} style={styles.sprite} />
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {lightSpot} {'·'} {statusLabel(status, days)}
          </Text>
        </View>
        <View style={[styles.dot, { backgroundColor: color }]} />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animWrap: { width: '100%', height: PLANT_ROW_H, marginBottom: 12 },
  hit: { width: '100%', height: PLANT_ROW_H },
  shell: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  sprite: { width: 54, height: 54, resizeMode: 'contain', marginRight: 12 },
  texts: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: 0.6, color: theme.colors.text },
  meta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10 },
});

export default React.memo(PlantCard);
