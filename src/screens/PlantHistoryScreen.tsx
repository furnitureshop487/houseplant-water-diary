import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Calendar, ChevronLeft, Droplet, Flower2, Leaf } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import StatRow from '../components/StatRow';
import LogRow from '../components/LogRow';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import theme from '../constants/theme';
import { countType, logsFor, type LogEntry, type Plant } from '../game/careEngine';
import { daysSince } from '../utils/date';
import { spriteFor } from '../assets';

type Props = {
  plant: Plant;
  log: LogEntry[];
  onRepot: (plantId: string) => void;
  onBack: () => void;
};

export default function PlantHistoryScreen({ plant, log, onRepot, onBack }: Props) {
  const entries = useMemo(() => logsFor(log, plant.id), [log, plant.id]);

  const waterings = countType(log, plant.id, 'water');
  const feedings = countType(log, plant.id, 'feed');
  const daysKept = Math.max(1, daysSince(plant.addedOn));

  const renderItem = useCallback(
    ({ item }: { item: LogEntry }) => <LogRow type={item.type} date={item.date} />,
    [],
  );
  const keyExtractor = useCallback((item: LogEntry) => item.id, []);
  const handleRepot = useCallback(() => onRepot(plant.id), [onRepot, plant.id]);

  return (
    <AppShell variant="plain">
      <ScreenHeader
        title={plant.name}
        subtitle="PLANT DIARY"
        leftSlot={<IconTile Icon={ChevronLeft} onPress={onBack} label="back" />}
        rightSlot={<Image source={spriteFor(plant.spriteIndex)} style={styles.headSprite} />}
      />

      <View style={styles.summary}>
        <StatRow
          items={[
            {
              Icon: Droplet,
              value: waterings,
              label: 'WATERINGS',
              valueColor: theme.colors.accent,
            },
            { Icon: Leaf, value: feedings, label: 'FEEDINGS', valueColor: theme.colors.sage },
            {
              Icon: Calendar,
              value: daysKept,
              label: 'DAYS KEPT',
              valueColor: theme.colors.primaryLight,
            },
          ]}
        />
      </View>

      <View style={styles.listWrap}>
        {entries.length > 0 ? (
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={8}
            windowSize={7}
          />
        ) : (
          <View style={styles.empty}>
            <EmptyState
              sprite={spriteFor(5)}
              title="NO ENTRIES YET"
              subtitle="WATER THIS PLANT TO START ITS DIARY"
              color={theme.colors.textSecondary}
              size={110}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>EVERY CARE EVENT IS KEPT ON THIS DEVICE</Text>
        <View style={styles.row}>
          <SecondaryButton
            label="REPOT TODAY"
            Icon={Flower2}
            tint={theme.colors.primaryLight}
            onPress={handleRepot}
            grow
          />
          <SecondaryButton
            label="BACK"
            Icon={ChevronLeft}
            tint={theme.colors.textSecondary}
            onPress={onBack}
            grow
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headSprite: { width: 36, height: 36, resizeMode: 'contain' },
  summary: { paddingHorizontal: 20, paddingTop: 16 },
  listWrap: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 26 },
  hint: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  row: { flexDirection: 'row', gap: 10 },
});
