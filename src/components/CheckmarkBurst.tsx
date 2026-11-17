import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { ANIM } from '../constants/config';

/** Transform + opacity only - both are native-driver safe. */
function CheckmarkBurst({
  visible,
  color = theme.colors.sage,
  onDone,
}: {
  visible: boolean;
  color?: string;
  onDone?: () => void;
}) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!visible) return;
    scale.setValue(0.4);
    opacity.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.12,
          tension: ANIM.celebrateSpring.tension,
          friction: ANIM.celebrateSpring.friction,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: ANIM.celebrateSpring.tension,
          friction: ANIM.celebrateSpring.friction,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.delay(ANIM.checkmark - 420),
        Animated.timing(opacity, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished && done.current) done.current();
    });
  }, [visible, scale, opacity]);

  if (!visible) return null;

  return (
    <View style={styles.layer} pointerEvents="none">
      <Animated.View
        style={[
          styles.ring,
          { borderColor: `${color}66`, backgroundColor: `${color}1F`, opacity, transform: [{ scale }] },
        ]}>
        <Check size={56} color={color} strokeWidth={2.4} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(CheckmarkBurst);
