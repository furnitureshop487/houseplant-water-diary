import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import theme from '../constants/theme';
import { ANIM } from '../constants/config';

type Props = {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

/** Custom switch: 52x30 track + 24x24 knob, translateX only (native driver). */
function ToggleRow({ label, value, onChange }: Props) {
  const knob = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(knob, {
      toValue: value ? 1 : 0,
      tension: ANIM.toggleSpring.tension,
      friction: ANIM.toggleSpring.friction,
      useNativeDriver: true,
    }).start();
  }, [value, knob]);

  const translateX = knob.interpolate({ inputRange: [0, 1], outputRange: [3, 25] });

  return (
    <PressableScale
      onPress={() => onChange(!value)}
      accessibilityLabel={label}
      style={styles.hit}
      innerStyle={styles.shell}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? theme.colors.accent : theme.colors.olive },
        ]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: { width: '100%', height: 58 },
  shell: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text,
  },
  track: { width: 52, height: 30, borderRadius: 15, justifyContent: 'center' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.text },
});

export default React.memo(ToggleRow);
