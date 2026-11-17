import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';

type Props = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
};

function ChipGroup({ label, options, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map(opt => {
          const active = opt === value;
          return (
            <View key={opt} style={styles.slot}>
              <PressableScale
                onPress={() => onChange(opt)}
                accessibilityLabel={opt}
                style={styles.hit}
                innerStyle={[styles.chip, active ? styles.chipActive : null]}>
                <Text style={[styles.text, active ? styles.textActive : null]} numberOfLines={1}>
                  {opt}
                </Text>
              </PressableScale>
            </View>
          );
        })}
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
  row: { flexDirection: 'row', gap: 10 },
  slot: { flex: 1 },
  hit: { width: '100%', height: 48 },
  chip: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(171,120,42,0.16)',
  },
  text: { fontSize: 12, fontWeight: '800', letterSpacing: 1.4, color: theme.colors.textMuted },
  textActive: { color: theme.colors.text },
});

export default React.memo(ChipGroup);
