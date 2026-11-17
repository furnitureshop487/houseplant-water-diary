import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { CareStatus } from '../game/careEngine';

export function statusColor(kind: CareStatus): string {
  switch (kind) {
    case 'overdue':
      return theme.colors.terracotta;
    case 'due':
      return theme.colors.accent;
    case 'watered':
      return theme.colors.sage;
    default:
      return theme.colors.textMuted;
  }
}

export function statusLabel(kind: CareStatus, days: number): string {
  switch (kind) {
    case 'overdue':
      return `OVERDUE ${Math.abs(days)}D`;
    case 'due':
      return 'DUE TODAY';
    case 'watered':
      return 'WATERED';
    default:
      return `NEXT IN ${days}D`;
  }
}

function StatusChip({ kind, days }: { kind: CareStatus; days: number }) {
  const color = statusColor(kind);
  return (
    <View
      style={[styles.chip, { backgroundColor: `${color}1A`, borderColor: `${color}55` }]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {statusLabel(kind, days)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, lineHeight: 14 },
});

export default React.memo(StatusChip);
