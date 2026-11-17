import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';
import { ICON_IN_BUTTON, SECONDARY_H } from '../constants/config';

type Props = {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  tint?: string;
  grow?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Same icon geometry as PrimaryButton (24 / lineHeight 24 / gap 10). */
function SecondaryButton({ label, Icon, onPress, tint = theme.colors.text, grow, style }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.hit, grow ? styles.grow : null, style]}
      innerStyle={styles.shell}>
      <View style={styles.row}>
        {Icon ? <Icon size={ICON_IN_BUTTON} color={tint} strokeWidth={2.2} /> : null}
        <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: { width: '100%', height: SECONDARY_H },
  grow: { flex: 1, width: undefined },
  shell: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(240,237,233,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: ICON_IN_BUTTON,
  },
});

export default React.memo(SecondaryButton);
