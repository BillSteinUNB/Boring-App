/**
 * HomeScreen.tsx
 *
 * The single screen of The Boring App - the timer launcher.
 *
 * This screen will contain:
 * - A minimal, monochromatic interface
 * - Three timer duration options (5, 15, 30 minutes)
 * - A start button to begin the boring timer
 * - No animations, no gamification, no distractions
 *
 * Design Philosophy:
 * - Intentionally plain and unstimulating
 * - Maximum whitespace, minimum visual elements
 * - No progress indicators or rewards
 * - Just a simple way to commit to doing nothing
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  // TODO: Implement timer selection UI
  // TODO: Implement start button
  // TODO: Connect to useBoringTimer hook

  return (
    <View style={styles.container}>
      <Text>The Boring App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
