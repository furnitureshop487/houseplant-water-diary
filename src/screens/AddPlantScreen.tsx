import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, Vibration, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import PressableScale from '../components/PressableScale';
import LabeledInput from '../components/LabeledInput';
import ChipGroup from '../components/ChipGroup';
import Stepper from '../components/Stepper';
import PrimaryButton from '../components/PrimaryButton';
import CheckmarkBurst from '../components/CheckmarkBurst';
import theme from '../constants/theme';
import {
  DEFAULT_FEED_INTERVAL,
  DEFAULT_WATER_INTERVAL,
  FEED_MAX,
  FEED_MIN,
  FEED_STEP,
  HAPTIC_MS,
  LIGHT_SPOTS,
  SPRITE_COUNT,
  WATER_MAX,
  WATER_MIN,
  WATER_STEP,
  type LightSpot,
} from '../constants/config';
import { spriteFor } from '../assets';
import type { NewPlantDraft } from '../hooks/usePlants';

type Props = {
  haptics: boolean;
  onSave: (draft: NewPlantDraft) => void;
  onClose: () => void;
};

const SPRITE_IDS = Array.from({ length: SPRITE_COUNT }, (_, i) => i + 1);

export default function AddPlantScreen({ haptics, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [spriteIndex, setSpriteIndex] = useState(1);
  const [lightSpot, setLightSpot] = useState<LightSpot>('BRIGHT');
  const [water, setWater] = useState(DEFAULT_WATER_INTERVAL);
  const [feed, setFeed] = useState(DEFAULT_FEED_INTERVAL);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(() => {
    if (saving) return;
    if (haptics) Vibration.vibrate(HAPTIC_MS);
    setSaving(true);
  }, [saving, haptics]);

  const handleSaved = useCallback(() => {
    setSaving(false);
    onSave({
      name: name.trim(),
      spriteIndex,
      lightSpot,
      waterInterval: water,
      feedInterval: feed,
    });
  }, [onSave, name, spriteIndex, lightSpot, water, feed]);

  return (
    <AppShell variant="plain">
      <ScreenHeader
        title="ADD PLANT"
        rightSlot={<IconTile Icon={X} onPress={onClose} label="close" />}
      />

      <View style={styles.body}>
        <View style={styles.block}>
          <Text style={styles.label}>LEAF PORTRAIT</Text>
          <View style={styles.pickerRow}>
            {SPRITE_IDS.map(id => {
              const active = id === spriteIndex;
              return (
                <View key={id} style={styles.pickerSlot}>
                  <PressableScale
                    onPress={() => setSpriteIndex(id)}
                    accessibilityLabel={`portrait ${id}`}
                    style={styles.pickerHit}
                    innerStyle={[styles.pickerTile, active ? styles.pickerActive : null]}>
                    <Image source={spriteFor(id)} style={styles.pickerImg} />
                  </PressableScale>
                </View>
              );
            })}
          </View>
        </View>

        <LabeledInput
          label="PLANT NAME"
          value={name}
          placeholder="MONSTERA"
          onChangeText={setName}
        />

        <ChipGroup
          label="LIGHT SPOT"
          options={LIGHT_SPOTS}
          value={lightSpot}
          onChange={next => setLightSpot(next as LightSpot)}
        />

        <Stepper
          label="WATER EVERY"
          value={water}
          min={WATER_MIN}
          max={WATER_MAX}
          step={WATER_STEP}
          unit="DAYS"
          accent={theme.colors.accent}
          onChange={setWater}
        />

        <Stepper
          label="FEED EVERY"
          value={feed}
          min={FEED_MIN}
          max={FEED_MAX}
          step={FEED_STEP}
          unit="DAYS"
          accent={theme.colors.sage}
          onChange={setFeed}
        />

        <CheckmarkBurst visible={saving} onDone={handleSaved} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>ALL DATA STAYS ON THIS DEVICE</Text>
        <PrimaryButton
          label="SAVE PLANT"
          Icon={Check}
          onPress={handleSave}
          colors={theme.gradients.ochre}
          shadowColor="ochre"
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  block: { width: '100%' },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  pickerRow: { flexDirection: 'row', gap: 10 },
  pickerSlot: { flex: 1 },
  pickerHit: { width: '100%', height: 62 },
  pickerTile: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerActive: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(40,112,224,0.12)',
  },
  pickerImg: { width: 44, height: 44, resizeMode: 'contain' },
  footer: { paddingHorizontal: 20, paddingBottom: 26, paddingTop: 6 },
  hint: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
});
