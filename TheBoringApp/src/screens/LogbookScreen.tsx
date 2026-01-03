import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

type WeekEntry = {
  id: string;
  weekLabel: string;
  totalMinutes: number;
  sessions: number;
};

const MOCK_WEEKS: WeekEntry[] = [
  { id: '1', weekLabel: '2025-W52', totalMinutes: 45, sessions: 3 },
  { id: '2', weekLabel: '2025-W51', totalMinutes: 30, sessions: 2 },
  { id: '3', weekLabel: '2025-W50', totalMinutes: 60, sessions: 4 },
  { id: '4', weekLabel: '2025-W49', totalMinutes: 15, sessions: 1 },
  { id: '5', weekLabel: '2025-W48', totalMinutes: 90, sessions: 6 },
  { id: '6', weekLabel: '2025-W47', totalMinutes: 45, sessions: 3 },
  { id: '7', weekLabel: '2025-W46', totalMinutes: 75, sessions: 5 },
  { id: '8', weekLabel: '2025-W45', totalMinutes: 30, sessions: 2 },
  { id: '9', weekLabel: '2025-W44', totalMinutes: 60, sessions: 4 },
  { id: '10', weekLabel: '2025-W43', totalMinutes: 45, sessions: 3 },
  { id: '11', weekLabel: '2025-W42', totalMinutes: 15, sessions: 1 },
  { id: '12', weekLabel: '2025-W41', totalMinutes: 30, sessions: 2 },
];

const WeekRow = ({ entry }: { entry: WeekEntry }) => (
  <View style={styles.row}>
    <Text style={styles.cellWeek}>{entry.weekLabel}</Text>
    <Text style={styles.cellSessions}>{entry.sessions}</Text>
    <Text style={styles.cellMinutes}>{entry.totalMinutes}m</Text>
  </View>
);

const TableHeader = () => (
  <View style={styles.row}>
    <Text style={[styles.cellWeek, styles.headerCell]}>WEEK</Text>
    <Text style={[styles.cellSessions, styles.headerCell]}>SESS</Text>
    <Text style={[styles.cellMinutes, styles.headerCell]}>TIME</Text>
  </View>
);

const TableSeparator = () => <View style={styles.separator} />;

export default function LogbookScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>&lt; back</Text>
        </Pressable>
        <Text style={styles.title}>logbook</Text>
      </View>
      
      <View style={styles.tableHeader}>
        <TableHeader />
        <TableSeparator />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TableSeparator />
        {MOCK_WEEKS.map((entry) => (
          <View key={entry.id}>
            <WeekRow entry={entry} />
            <TableSeparator />
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>{MOCK_WEEKS.length} weeks recorded</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.label,
  },
  title: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.timer,
    marginLeft: spacing.md,
    textTransform: 'lowercase',
  },
  tableHeader: {
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  headerCell: {
    color: colors.secondaryText,
  },
  cellWeek: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.button,
    flex: 2,
  },
  cellSessions: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.button,
    flex: 1,
    textAlign: 'center',
  },
  cellMinutes: {
    color: colors.primaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.button,
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: colors.accent,
    opacity: 0.3,
  },
  footer: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    marginTop: spacing.sm,
  },
  footerText: {
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.label,
    textAlign: 'center',
  },
});
