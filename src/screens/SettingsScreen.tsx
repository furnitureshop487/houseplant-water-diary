import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Trash2 } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import Stepper from '../components/Stepper';
import ToggleRow from '../components/ToggleRow';
import SecondaryButton from '../components/SecondaryButton';
import PressableScale from '../components/PressableScale';
import theme from '../constants/theme';

export type Settings = {
  hour: number;
  minute: number;
  waterReminders: boolean;
  feedReminders: boolean;
  haptics: boolean;
};

type Props = {
  settings: Settings;
  onChange: (next: Settings) => void;
  onReset: () => void;
  onBack: () => void;
};

export default function SettingsScreen({ settings, onChange, onReset, onBack }: Props) {
  const patch = useCallback(
    (part: Partial<Settings>) => onChange({ ...settings, ...part }),
    [onChange, settings],
  );

  return (
    <AppShell variant="plain">
      <ScreenHeader
        title="SETTINGS"
        subtitle="REMINDERS AND DIARY"
        leftSlot={<IconTile Icon={Home} onPress={onBack} label="back to my plants" />}
      />

      <View style={styles.body}>
        <View style={styles.timeRow}>
          <View style={styles.timeSlot}>
            <Stepper
              label="REMINDER HOUR"
              value={settings.hour}
              min={0}
              max={23}
              step={1}
              unit="HOUR"
              accent={theme.colors.accent}
              onChange={h => patch({ hour: h })}
            />
          </View>
          <View style={styles.timeSlot}>
            <Stepper
              label="MINUTE"
              value={settings.minute}
              min={0}
              max={45}
              step={15}
              unit="MIN"
              accent={theme.colors.primaryLight}
              onChange={m => patch({ minute: m })}
            />
          </View>
        </View>

        <View style={styles.toggles}>
          <ToggleRow
            label="WATERING REMINDERS"
            value={settings.waterReminders}
            onChange={v => patch({ waterReminders: v })}
          />
          <ToggleRow
            label="FEEDING REMINDERS"
            value={settings.feedReminders}
            onChange={v => patch({ feedReminders: v })}
          />
          <ToggleRow
            label="SOFT HAPTICS"
            value={settings.haptics}
            onChange={v => patch({ haptics: v })}
          />
        </View>

        <PressableScale
          onPress={onReset}
          accessibilityLabel="reset diary"
          style={styles.dangerHit}
          innerStyle={styles.danger}>
          <View style={styles.dangerRow}>
            <Trash2 size={24} color={theme.colors.terracotta} strokeWidth={2.2} />
            <Text style={styles.dangerText}>RESET DIARY</Text>
          </View>
        </PressableScale>
      </View>

      <View style={styles.footer}>
        <Text style={styles.note}>ALL DATA STAYS ON THIS DEVICE</Text>
        <SecondaryButton
          label="BACK TO MY PLANTS"
          Icon={Home}
          tint={theme.colors.textSecondary}
          onPress={onBack}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 18, gap: 16 },
  timeRow: { flexDirection: 'row', gap: 12 },
  timeSlot: { flex: 1 },
  toggles: { gap: 10 },
  dangerHit: { width: '100%', height: 50 },
  danger: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(196,90,59,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(196,90,59,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  dangerText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 24,
    color: theme.colors.terracotta,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 26, paddingTop: 6 },
  note: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
});
