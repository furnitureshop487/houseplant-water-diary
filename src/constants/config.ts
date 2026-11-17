import { Dimensions } from 'react-native';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Rule #13 - EXACTLY 8000ms, never less. Shorter races the screenshot window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;
export const LOADER_FADE_MS = 260;
export const LOADER_BAR_W = 212;

export const HEADER_HEIGHT = 96;
export const HEADER_PAD_TOP = 44;

/** Rule #5 - leave room for the parent padding + border. */
export const CARD_W = Math.min(SCREEN_W - 40, 380);
export const PORTRAIT = SCREEN_H < 700 ? 124 : 152;
export const HERO_ART = SCREEN_W < 360 ? 92 : 104;

export const PLANT_ROW_H = 84;
export const PRIMARY_H = 60;
export const SECONDARY_H = 50;
export const TILE_H = 44;
export const STRIP_H = 58;
export const ICON_IN_BUTTON = 24;

export const WATER_MIN = 1;
export const WATER_MAX = 30;
export const WATER_STEP = 1;
export const FEED_MIN = 7;
export const FEED_MAX = 90;
export const FEED_STEP = 7;

export const DEFAULT_WATER_INTERVAL = 7;
export const DEFAULT_FEED_INTERVAL = 28;

export const ANIM = {
  fade: 200,
  fadeSlow: 360,
  listItem: 180,
  listStagger: 55,
  cardSwap: 200,
  checkmark: 700,
  floatLoop: 3200,
  railUpdate: 220,
  pressSpring: { tension: 300, friction: 12 },
  entrySpring: { tension: 48, friction: 8 },
  celebrateSpring: { tension: 70, friction: 6 },
  toggleSpring: { tension: 70, friction: 9 },
} as const;

export const HAPTIC_MS = 12;

export const LIGHT_SPOTS = ['BRIGHT', 'PARTIAL', 'SHADE'] as const;
export type LightSpot = (typeof LIGHT_SPOTS)[number];

export const SPRITE_COUNT = 5;
