import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

/** Editorial motif: an 11pt uppercase label over a short coloured rule. */
function SectionHeading({
  title,
  color = theme.colors.primary,
  rule = true,
}: {
  title: string;
  color?: string;
  rule?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{title}</Text>
      {rule ? <View style={[styles.rule, { backgroundColor: color }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start' },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.textMuted,
  },
  rule: { width: 48, height: 3, borderRadius: 2, marginTop: 8 },
});

export default React.memo(SectionHeading);
