import React from 'react';
import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';
import { TILE_H } from '../constants/config';

type Props = {
  Icon?: LucideIcon;
  source?: ImageSourcePropType;
  onPress: () => void;
  tint?: string;
  label: string;
};

/** 44x44 square + hitSlop 8 => comfortably past the 48px touch target. */
function IconTile({ Icon, source, onPress, tint = theme.colors.text, label }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      style={styles.hit}
      innerStyle={styles.shell}>
      {Icon ? <Icon size={20} color={tint} strokeWidth={2.2} /> : null}
      {source ? <Image source={source} style={styles.img} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: { width: TILE_H, height: TILE_H },
  shell: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.tile,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { width: 22, height: 22, resizeMode: 'contain' },
});

export default React.memo(IconTile);
