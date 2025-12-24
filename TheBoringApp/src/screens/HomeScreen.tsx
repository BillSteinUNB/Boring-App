import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useBoringTimer } from '../hooks/useBoringTimer';
import { colors, typography, spacing } from '../constants/theme';
import { DURATIONS } from '../constants/durations';

export default function HomeScreen() {
  const { status, start } = useBoringTimer();

  if (status === 'complete') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Done.</Text>
      </View>
    );
  }

  if (status === 'running') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Put your phone down.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {DURATIONS.map((duration) => (
          <Pressable
            key={duration}
            style={styles.button}
            onPress={() => start(duration)}
          >
            <Text style={styles.buttonText}>{duration}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accent,
    fontFamily: typography.fontFamily,
    fontSize: 16,
  },
  message: {
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
    fontSize: 16,
  },
});
