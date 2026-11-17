/**
 * Fixed Codex asset contract. NEVER invent another file name - the file will
 * not exist and the bundler fails on it.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
} as const;

export const SPRITES = [
  require('../../assets/sprite_1.png'),
  require('../../assets/sprite_2.png'),
  require('../../assets/sprite_3.png'),
  require('../../assets/sprite_4.png'),
  require('../../assets/sprite_5.png'),
];

/** spriteIndex is 1-based; anything out of range wraps back into the pool. */
export function spriteFor(spriteIndex: number) {
  const i = ((Math.round(spriteIndex) - 1) % SPRITES.length + SPRITES.length) % SPRITES.length;
  return SPRITES[i];
}

export default assets;
