import React from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import theme from '../constants/theme';

function EmptyState({
  sprite,
  title,
  subtitle,
  color = theme.colors.sage,
  size = 140,
}: {
  sprite: ImageSourcePropType;
  title: string;
  subtitle: string;
  color?: string;
  size?: number;
}) {
  return (
    <View style={styles.wrap}>
      <Image source={sprite} style={[styles.sprite, { width: size, height: size }]} />
      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  sprite: { resizeMode: 'contain', opacity: 0.85 },
  title: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  sub: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default React.memo(EmptyState);
