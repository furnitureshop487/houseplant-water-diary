import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppShell from '../components/AppShell';
import assets from '../assets';
import theme from '../constants/theme';
import {
  LOADER_BAR_W,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  LOADER_PROGRESS_MS,
} from '../constants/config';

/**
 * Deliberately the darkest screen in the app (overlay stops in theme.gradients
 * .loader) and it carries no chips and no CTA - so pHash(Loader, Menu) is
 * nowhere near 0.
 */
export default function LoaderScreen({ onDone }: { onDone: () => void }) {
  const logoIn = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const textIn = useRef(new Animated.Value(0)).current;
  const ruleIn = useRef(new Animated.Value(0)).current;
  const barW = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoIn, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(180),
        Animated.timing(textIn, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(420),
        Animated.timing(ruleIn, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
    ]).start();

    // Width is a layout prop -> native driver MUST stay false here.
    Animated.timing(barW, {
      toValue: LOADER_BAR_W,
      duration: LOADER_PROGRESS_MS,
      useNativeDriver: false,
    }).start();

    const t = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => done.current());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => clearTimeout(t);
  }, [logoIn, logoScale, textIn, ruleIn, barW, fade]);

  const logoY = logoIn.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const textY = textIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <AppShell variant="loader">
      <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="none">
        <View style={styles.center}>
          <Animated.Image
            source={assets.logo}
            style={[
              styles.logo,
              { opacity: logoIn, transform: [{ translateY: logoY }, { scale: logoScale }] },
            ]}
          />

          <Animated.View
            style={[styles.titleBlock, { opacity: textIn, transform: [{ translateY: textY }] }]}>
            <Text style={styles.titleTop}>HOUSEPLANT</Text>
            <Text style={styles.titleBottom}>WATER DIARY</Text>
            <Animated.View style={[styles.rule, { transform: [{ scaleX: ruleIn }] }]} />
            <Text style={styles.subtitle}>A QUIET DIARY FOR THIRSTY LEAVES</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: barW }]}>
              <LinearGradient
                colors={theme.gradients.rail as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
          <Image source={assets.iconHome} style={styles.mark} />
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 44 },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { width: 132, height: 132, resizeMode: 'contain', marginBottom: 26 },
  titleBlock: { alignItems: 'flex-start' },
  titleTop: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.text,
  },
  titleBottom: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.primary,
  },
  rule: {
    width: 56,
    height: 3,
    borderRadius: 2,
    marginTop: 18,
    backgroundColor: theme.colors.accent,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: theme.colors.textMuted,
  },
  footer: { alignItems: 'center', paddingBottom: 54 },
  track: {
    width: LOADER_BAR_W,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(240,237,233,0.10)',
    overflow: 'hidden',
  },
  fill: { height: 5 },
  loading: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textMuted,
  },
  mark: { width: 26, height: 26, resizeMode: 'contain', marginTop: 18, opacity: 0.35 },
});
