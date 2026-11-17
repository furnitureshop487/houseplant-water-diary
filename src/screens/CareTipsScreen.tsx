import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
  Droplet,
  Flower2,
  Home,
  Leaf,
  Scissors,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import IconTile from '../components/IconTile';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';

type Tip = {
  id: string;
  Icon: LucideIcon;
  color: string;
  title: string;
  body: string;
};

const TIPS: Tip[] = [
  {
    id: 't1',
    Icon: Droplet,
    color: theme.colors.accent,
    title: 'CHECK THE TOP 3 CM OF SOIL',
    body: 'Push a finger in. If it still feels damp, the plant is not thirsty yet - a schedule is a hint, soil is the truth.',
  },
  {
    id: 't2',
    Icon: Snowflake,
    color: theme.colors.accentSoft,
    title: 'WATER LESS IN WINTER',
    body: 'Growth slows down when the light does. Stretch the interval by a third from November to February.',
  },
  {
    id: 't3',
    Icon: Sun,
    color: theme.colors.primaryLight,
    title: 'BRIGHT IS NOT DIRECT SUN',
    body: 'Most houseplants want a bright room, not a sunbeam. A metre back from the glass is usually perfect.',
  },
  {
    id: 't4',
    Icon: Leaf,
    color: theme.colors.sage,
    title: 'FEED ONLY IN THE GROWING SEASON',
    body: 'Fertiliser on a dormant plant just builds up in the pot. Spring and summer only, at half strength.',
  },
  {
    id: 't5',
    Icon: Flower2,
    color: theme.colors.terracotta,
    title: 'REPOT WHEN ROOTS CIRCLE THE POT',
    body: 'Roots out of the drainage hole mean one size up - not three. Too much soil holds too much water.',
  },
  {
    id: 't6',
    Icon: Scissors,
    color: theme.colors.textSecondary,
    title: 'DUST THE LEAVES MONTHLY',
    body: 'A damp cloth over each leaf restores the light the plant actually receives. It is the cheapest fertiliser there is.',
  },
];

export default function CareTipsScreen({ onBack }: { onBack: () => void }) {
  const renderItem = useCallback(({ item }: { item: Tip }) => {
    const { Icon } = item;
    return (
      <View style={styles.card}>
        <View style={[styles.accentBar, { backgroundColor: item.color }]} />
        <View style={styles.cardHead}>
          <Icon size={22} color={item.color} strokeWidth={2.4} />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: Tip) => item.id, []);

  return (
    <AppShell variant="plain">
      <ScreenHeader
        title="CARE TIPS"
        subtitle="SIX QUIET HABITS"
        leftSlot={<IconTile Icon={Home} onPress={onBack} label="back to my plants" />}
      />

      <View style={styles.listWrap}>
        <FlatList
          data={TIPS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          windowSize={5}
        />
      </View>

      <View style={styles.footer}>
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
  listWrap: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 12 },
  card: {
    width: '100%',
    marginBottom: 12,
    padding: 16,
    paddingLeft: 18,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  accentBar: { position: 'absolute', left: 0, top: 16, width: 3, height: 28, borderRadius: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 19,
    color: theme.colors.text,
  },
  body: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 26, paddingTop: 6 },
});
