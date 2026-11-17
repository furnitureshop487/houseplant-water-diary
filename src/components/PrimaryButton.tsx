import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';
import { ICON_IN_BUTTON, PRIMARY_H } from '../constants/config';

type Props = {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  colors?: readonly string[];
  shadowColor?: 'water' | 'ochre';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/**
 * Rule #20 - icon is ALWAYS 24x24, label lineHeight is ALWAYS 24, gap is
 * ALWAYS 10, and the row is centered. No absolute positioning, ever.
 */
function PrimaryButton({
  label,
  Icon,
  onPress,
  colors = theme.gradients.water,
  shadowColor = 'water',
  style,
  disabled,
}: Props) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[styles.hit, style]}
      innerStyle={[styles.shell, theme.shadows[shadowColor]]}>
      <LinearGradient
        colors={colors as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.grad}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_IN_BUTTON} color={theme.colors.text} strokeWidth={2.4} /> : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: { width: '100%', height: PRIMARY_H },
  shell: { width: '100%', height: PRIMARY_H, borderRadius: theme.radius.lg },
  grad: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: ICON_IN_BUTTON,
    color: theme.colors.text,
  },
});

export default React.memo(PrimaryButton);
