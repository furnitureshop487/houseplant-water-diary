import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HEADER_HEIGHT, HEADER_PAD_TOP } from '../constants/config';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'center' | 'left';
};

/**
 * The ONE header used by every screen. Screens differ only by their slots -
 * inline per-screen header markup drifts and breaks cross-screen consistency.
 */
function ScreenHeader({ title, subtitle, leftSlot, rightSlot, align = 'center' }: Props) {
  const needLeftSpacer = !leftSlot && align === 'center';
  const needRightSpacer = !rightSlot && align === 'center';

  return (
    <View style={styles.header} pointerEvents="box-none">
      {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}
      {needLeftSpacer ? <View style={styles.spacer} /> : null}

      <View style={[styles.center, align === 'left' ? styles.centerLeft : null]}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightSlot ? <View style={styles.slotRight}>{rightSlot}</View> : null}
      {needRightSpacer ? <View style={styles.spacer} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PAD_TOP,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,12,7,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  slot: { height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  slotRight: { height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  spacer: { width: 44, height: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  centerLeft: { alignItems: 'flex-start', paddingHorizontal: 0, paddingLeft: 8 },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
});

export default React.memo(ScreenHeader);
