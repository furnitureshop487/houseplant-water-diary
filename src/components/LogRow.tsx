import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Droplet, Flower2, Leaf } from 'lucide-react-native';
import theme from '../constants/theme';
import { formatDate, relativeLabel } from '../utils/date';
import type { LogType } from '../game/careEngine';

const META: Record<LogType, { label: string; color: string; Icon: typeof Droplet }> = {
  water: { label: 'WATERED', color: theme.colors.accent, Icon: Droplet },
  feed: { label: 'FED', color: theme.colors.sage, Icon: Leaf },
  repot: { label: 'REPOTTED', color: theme.colors.primary, Icon: Flower2 },
};

function LogRow({ type, date }: { type: LogType; date: string }) {
  const { label, color, Icon } = META[type];
  return (
    <View style={styles.row}>
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={[styles.iconTile, { backgroundColor: `${color}1A` }]}>
        <Icon size={18} color={color} strokeWidth={2.4} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.rel} numberOfLines={1}>
          {relativeLabel(date)}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 64,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 16,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(240,237,233,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  bar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  texts: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', letterSpacing: 1.2 },
  rel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textMuted,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(LogRow);
