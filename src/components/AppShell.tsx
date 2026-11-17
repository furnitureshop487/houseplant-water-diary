import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

type Variant = 'loader' | 'menu' | 'game' | 'gameover' | 'plain';

const STOPS: Record<Variant, readonly string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  gameover: theme.gradients.gameover,
  plain: theme.gradients.plain,
};

/**
 * bg_game is the ONLY background asset in the contract - every screen uses it
 * and is told apart by its gradient stops (loader is the darkest, rule #14).
 */
function AppShell({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  const diagonal = variant === 'loader';
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={STOPS[variant] as string[]}
          start={diagonal ? { x: 0.1, y: 0 } : { x: 0.5, y: 0 }}
          end={diagonal ? { x: 0.9, y: 1 } : { x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.decor} pointerEvents="none">
          <View style={[styles.blob, styles.blobOchre]} />
          <View style={[styles.blob, styles.blobBlue]} />
        </View>
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  bg: { flex: 1, width: '100%', height: '100%' },
  content: { flex: 1 },
  decor: { ...StyleSheet.absoluteFillObject },
  blob: { position: 'absolute', borderRadius: 999 },
  blobOchre: {
    width: 260,
    height: 260,
    top: -60,
    left: -70,
    backgroundColor: theme.colors.primary,
    opacity: 0.1,
  },
  blobBlue: {
    width: 200,
    height: 200,
    bottom: 40,
    right: -60,
    backgroundColor: theme.colors.accent,
    opacity: 0.07,
  },
});

export default React.memo(AppShell);
