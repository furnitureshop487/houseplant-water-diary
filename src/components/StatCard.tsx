import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { ANIM, STRIP_H } from '../constants/config';

export type StatCardProps = {
  Icon?: LucideIcon;
  value: number | string;
  label: string;
  valueColor: string;
  variant?: 'tile' | 'strip';
  hideZero?: boolean;
};

/**
 * The SAME stat card on every screen. Geometry is fixed and identical across a
 * row (rule #21): the icon is a vector so all three are pixel-identical, and
 * the card uses width:'100%' inside a flex:1 slot - never flex:1 itself
 * (rule #19a, the "icon floating, no value" collapse).
 */
function StatCard({
  Icon,
  value,
  label,
  valueColor,
  variant = 'tile',
  hideZero,
}: StatCardProps) {
  const numeric = typeof value === 'number' ? value : NaN;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulse.setValue(1.14);
    Animated.spring(pulse, {
      toValue: 1,
      tension: ANIM.celebrateSpring.tension,
      friction: ANIM.celebrateSpring.friction,
      useNativeDriver: true,
    }).start();
  }, [value, pulse]);

  if (hideZero && numeric === 0) return null;

  const strip = variant === 'strip';

  return (
    <View
      style={[
        strip ? styles.strip : styles.tile,
        { borderColor: `${valueColor}55` },
      ]}>
      <View style={[styles.accentBar, { backgroundColor: valueColor }]} />

      {!strip && Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: `${valueColor}1A` }]}>
          <Icon size={22} color={valueColor} strokeWidth={2.5} />
        </View>
      ) : null}

      <Animated.Text
        style={[
          strip ? styles.stripValue : styles.value,
          { color: valueColor, transform: [{ scale: pulse }] },
        ]}
        numberOfLines={1}>
        {value}
      </Animated.Text>

      <Text style={strip ? styles.stripLabel : styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const base = {
  width: '100%' as const,
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderRadius: theme.radius.md,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  overflow: 'hidden' as const,
};

const styles = StyleSheet.create({
  tile: { ...base, paddingVertical: 14, paddingHorizontal: 8 },
  strip: { ...base, height: STRIP_H, paddingHorizontal: 8 },
  accentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  stripValue: {
    fontSize: 20,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  stripLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export default React.memo(StatCard);
