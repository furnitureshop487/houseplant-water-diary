import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { ANIM, SCREEN_W } from '../constants/config';

/** Width animation => useNativeDriver MUST be false (layout prop). */
function ProgressRail({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const w = useRef(new Animated.Value(clamped * SCREEN_W)).current;

  useEffect(() => {
    Animated.timing(w, {
      toValue: clamped * SCREEN_W,
      duration: ANIM.railUpdate,
      useNativeDriver: false,
    }).start();
  }, [clamped, w]);

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: w }]}>
        <LinearGradient
          colors={theme.gradients.rail as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', height: 4, backgroundColor: 'rgba(240,237,233,0.08)' },
  fill: { height: 4, overflow: 'hidden' },
});

export default React.memo(ProgressRail);
