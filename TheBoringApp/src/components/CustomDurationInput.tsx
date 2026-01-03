import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, touchTarget } from '../constants/theme';
import { DEFAULT_CUSTOM_DURATION, isValidDuration } from '../constants/durations';

interface Props {
  onStart: (minutes: number) => void;
  onCancel: () => void;
}

export const CustomDurationInput: React.FC<Props> = ({ onStart }) => {
  const [inputValue, setInputValue] = useState(String(DEFAULT_CUSTOM_DURATION));

  const handleChangeText = (text: string) => {
    setInputValue(text.replace(/[^0-9]/g, ''));
  };

  const handleSubmit = () => {
    const minutes = parseInt(inputValue, 10);
    if (isValidDuration(minutes)) {
      onStart(minutes);
    } else {
      setInputValue(String(DEFAULT_CUSTOM_DURATION));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        keyboardType="numeric"
        maxLength={3}
        selectTextOnFocus
        autoFocus
        accessibilityLabel="Custom duration in minutes"
        accessibilityRole="text"
      />
      <Text style={styles.label} accessibilityLabel="minutes">min</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        accessibilityLabel="Start custom timer"
        accessibilityRole="button"
        accessibilityHint="Starts timer with the entered duration"
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  input: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.input,
    color: colors.primaryText,
    textAlign: 'center',
    width: touchTarget.inputWidth,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.input,
    color: colors.secondaryText,
  },
  button: {
    minWidth: touchTarget.min,
    minHeight: touchTarget.min,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.input,
    color: colors.primaryText,
  },
});
