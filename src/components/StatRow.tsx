import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import StatCard, { type StatCardProps } from './StatCard';

type Props = {
  items: StatCardProps[];
  variant?: 'tile' | 'strip';
  style?: StyleProp<ViewStyle>;
};

/**
 * A lone pill looks orphaned, so the whole row disappears below two visible
 * items (rule #21). Every slot is flex:1 so all pills share one width.
 */
function StatRow({ items, variant = 'tile', style }: Props) {
  const visible = items.filter(i => !(i.hideZero && i.value === 0));
  if (visible.length < 2) return null;

  return (
    <View style={[styles.row, style]}>
      {visible.map(item => (
        <View key={item.label} style={styles.slot}>
          <StatCard {...item} variant={variant} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  slot: { flex: 1 },
});

export default React.memo(StatRow);
