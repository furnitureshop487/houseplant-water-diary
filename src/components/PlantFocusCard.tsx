import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Droplet, Sun } from 'lucide-react-native';
import StatusChip, { statusColor } from './StatusChip';
import theme from '../constants/theme';
import { CARD_W, PORTRAIT } from '../constants/config';
import { spriteFor } from '../assets';
import type { CareStatus } from '../game/careEngine';

type Props = {
  name: string;
  spriteIndex: number;
  lightSpot: string;
  waterInterval: number;
  status: CareStatus;
  days: number;
};

/**
 * The one plant the round is currently on. width:'100%' + intrinsic height -
 * never flex:1 inside the flex:1 game area (rule #19a).
 */
function PlantFocusCard({ name, spriteIndex, lightSpot, waterInterval, status, days }: Props) {
  const color = statusColor(status);
  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: color }]} />
      <Image source={spriteFor(spriteIndex)} style={styles.portrait} />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.metaRow}>
        <Sun size={14} color={theme.colors.primaryLight} strokeWidth={2.4} />
        <Text style={styles.meta}>{lightSpot}</Text>
        <Text style={styles.sep}>{'·'}</Text>
        <Droplet size={14} color={theme.colors.accentSoft} strokeWidth={2.4} />
        <Text style={styles.meta}>EVERY {waterInterval}D</Text>
      </View>
      <View style={styles.chipRow}>
        <StatusChip kind={status} days={days} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    alignSelf: 'center',
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  accentBar: { position: 'absolute', left: 0, top: 18, width: 4, height: 40, borderRadius: 2 },
  portrait: { width: PORTRAIT, height: PORTRAIT, resizeMode: 'contain', marginTop: 6 },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: theme.colors.text,
    textAlign: 'center',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  meta: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, color: theme.colors.textSecondary },
  sep: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted, marginHorizontal: 2 },
  chipRow: { marginTop: 12 },
});

export default React.memo(PlantFocusCard);
