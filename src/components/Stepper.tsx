import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  accent: string;
  onChange: (next: number) => void;
};

/** Large steppers instead of tiny fields - both tiles are 56x56. */
function Stepper({ label, value, min, max, step, unit, accent, onChange }: Props) {
  const dec = useCallback(() => onChange(Math.max(min, value - step)), [onChange, min, value, step]);
  const inc = useCallback(() => onChange(Math.min(max, value + step)), [onChange, max, value, step]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <PressableScale
          onPress={dec}
          accessibilityLabel={`decrease ${label}`}
          style={styles.tileHit}
          innerStyle={styles.tile}>
          <Minus size={22} color={theme.colors.text} strokeWidth={2.6} />
        </PressableScale>

        <View style={styles.center}>
          <Text style={[styles.value, { color: accent }]}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>

        <PressableScale
          onPress={inc}
          accessibilityLabel={`increase ${label}`}
          style={styles.tileHit}
          innerStyle={styles.tile}>
          <Plus size={22} color={theme.colors.text} strokeWidth={2.6} />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tileHit: { width: 56, height: 56 },
  tile: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 32, fontWeight: '900', fontVariant: ['tabular-nums'], lineHeight: 36 },
  unit: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
});

export default React.memo(Stepper);
