import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ANIM } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  /** MUST carry an explicit height (and an explicit width or flex:1 in a row). */
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  children: React.ReactNode;
};

/**
 * Press feedback the only way that survives Android release builds:
 * Pressable is the PARENT, the Animated.View lives INSIDE it. An Animated.View
 * wrapped around a Pressable eats onPress (the dead-button bug).
 */
function PressableScale({
  onPress,
  disabled,
  style,
  innerStyle,
  accessibilityLabel,
  children,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: ANIM.pressSpring.tension,
      friction: ANIM.pressSpring.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handleOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: ANIM.pressSpring.tension,
      friction: ANIM.pressSpring.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handleIn}
      onPressOut={handleOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={style}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.inner, innerStyle, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: { width: '100%', height: '100%' },
});

export default React.memo(PressableScale);
