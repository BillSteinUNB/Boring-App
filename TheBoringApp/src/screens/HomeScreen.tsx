import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useBoringTimer } from '../hooks/useBoringTimer';
import { colors, typography, spacing, touchTarget } from '../constants/theme';
import { DURATIONS } from '../constants/durations';
import { CustomDurationInput } from '../components/CustomDurationInput';
import LogbookScreen from './LogbookScreen';

type DisplayState = 'idle' | 'idle-custom' | 'running-countdown' | 'running-countup' | 'complete';

const getDisplayState = (
  status: string,
  mode: string,
  showCustomInput: boolean
): DisplayState => {
  if (status === 'complete') return 'complete';
  if (status === 'running') return mode === 'countup' ? 'running-countup' : 'running-countdown';
  if (showCustomInput) return 'idle-custom';
  return 'idle';
};

const IdleButtons = ({ onSelect, onCustom, onCountUp }: {
  onSelect: (m: number) => void; onCustom: () => void; onCountUp: () => void;
}) => (
  <View style={styles.buttonRow}>
    {DURATIONS.map((d) => (
      <Pressable
        key={d}
        style={styles.button}
        onPress={() => onSelect(d)}
        accessibilityLabel={`${d} minute timer`}
        accessibilityRole="button"
        accessibilityHint={`Starts a ${d} minute timer`}
      >
        <Text style={styles.buttonText}>{d}</Text>
      </Pressable>
    ))}
    <Pressable
      style={[styles.button, styles.buttonBorder]}
      onPress={onCustom}
      accessibilityLabel="Custom duration"
      accessibilityRole="button"
      accessibilityHint="Enter a custom timer duration in minutes"
    >
      <Text style={styles.buttonText}>+</Text>
    </Pressable>
    <Pressable
      style={styles.button}
      onPress={onCountUp}
      accessibilityLabel="Count up timer"
      accessibilityRole="button"
      accessibilityHint="Starts a count up timer that runs until manually stopped"
    >
      <Text style={styles.buttonText}>∞</Text>
    </Pressable>
  </View>
);

const TimerDisplay = ({ time, label }: { time: string; label: string }) => (
  <>
    <Text
      style={styles.timerDisplay}
      accessibilityLabel={`Timer showing ${time}`}
      accessibilityRole="text"
    >
      {time}
    </Text>
    <Text
      style={styles.subText}
      accessibilityLabel={label}
      accessibilityRole="text"
    >
      {label}
    </Text>
  </>
);

const CountupDisplay = ({ time, onStop }: { time: string; onStop: () => void }) => (
  <Pressable
    style={styles.fullTouch}
    onPress={onStop}
    accessibilityLabel={`Count up timer showing ${time}. Tap to stop.`}
    accessibilityRole="button"
    accessibilityHint="Stops the count up timer"
  >
    <Text style={styles.timerDisplay}>{time}</Text>
    <Text style={styles.subText}>tap to stop</Text>
  </Pressable>
);

const CompleteDisplay = ({ mode, time }: { mode: string; time: string }) =>
  mode === 'countup' ? (
    <TimerDisplay time={time} label="done" />
  ) : (
    <Text style={styles.message}>Done.</Text>
  );

const FooterLink = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.footerLink}>
    <Text style={styles.footerLinkText}>log</Text>
  </Pressable>
);

export default function HomeScreen() {
  const { status, mode, start, startCountUp, stopCountUp, displayTime } = useBoringTimer();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showLogbook, setShowLogbook] = useState(false);
  const displayState = getDisplayState(status, mode, showCustomInput);

  if (showLogbook) {
    return <LogbookScreen onBack={() => setShowLogbook(false)} />;
  }

  return (
    <View style={styles.container}>
      {displayState === 'idle' && (
        <IdleButtons onSelect={start} onCustom={() => setShowCustomInput(true)} onCountUp={startCountUp} />
      )}
      {displayState === 'idle-custom' && (
        <CustomDurationInput
          onStart={(m) => { start(m); setShowCustomInput(false); }}
          onCancel={() => setShowCustomInput(false)}
        />
      )}
      {displayState === 'running-countdown' && <TimerDisplay time={displayTime} label="put it down" />}
      {displayState === 'running-countup' && <CountupDisplay time={displayTime} onStop={stopCountUp} />}
      {displayState === 'complete' && <CompleteDisplay mode={mode} time={displayTime} />}
      
      {displayState === 'idle' && (
        <View style={styles.footer}>
          <FooterLink onPress={() => setShowLogbook(true)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    minWidth: touchTarget.min,
    minHeight: touchTarget.min,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBorder: { borderWidth: 1, borderColor: colors.accent },
  buttonText: {
    color: colors.accent,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.button,
  },
  timerDisplay: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.timer,
  },
  subText: {
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.label,
    marginTop: spacing.lg,
  },
  message: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.timer,
  },
  fullTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerLink: {
    padding: spacing.sm,
  },
  footerLinkText: {
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.label,
  },
});
