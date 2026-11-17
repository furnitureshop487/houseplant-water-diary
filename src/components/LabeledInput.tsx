import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (next: string) => void;
};

function LabeledInput({ label, value, placeholder, onChangeText }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="characters"
        maxLength={18}
        style={styles.input}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(240,237,233,0.12)',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text,
  },
});

export default React.memo(LabeledInput);
