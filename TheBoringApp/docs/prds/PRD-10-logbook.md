# PRD-10: Logbook (The "Boring" Exception)

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

> **Exception Rationale**: The Logbook is a "philosophy exception" - it is the ONLY feature that stores historical data. This exception exists because some users need accountability tracking, but it must be designed to be so boring that it discourages checking it.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-10 |
| **Title** | Logbook (The "Boring" Exception) |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2026-01-03 |
| **Updated** | 2026-01-03 |
| **Related PRDs** | PRD-09 (Weekly Quota) |

---

## Overview

### Problem Statement

Users who have committed to regular "boring time" want a way to verify their history without the app becoming a tracking tool. The Logbook exists as an accountability mechanism, not a data playground.

### User Story

As a user who wants to verify I actually did nothing yesterday, I want a simple text list of my sessions so I can hold myself accountable without being incentivized.

### Success Metric

Logbook displays a plain text list of completed sessions. No charts, no trends, no analysis, no motivation.

---

## Detailed Requirements

### Functional Requirements

#### Entry Recording
- [ ] **FR-01**: Each completed countdown session (minimum 1 minute) creates a logbook entry
- [ ] **FR-02**: Entry contains: date, time, duration
- [ ] **FR-03**: Count-up sessions do NOT create logbook entries (they're open-ended)
- [ ] **FR-04**: Entries are stored locally only (no cloud sync, no accounts)
- [ ] **FR-05**: Maximum 100 entries stored; oldest entries deleted when exceeded

#### Logbook Display
- [ ] **FR-06**: Logbook is a separate screen accessible from home screen
- [ ] **FR-07**: Entries displayed in reverse chronological order (newest first)
- [ ] **FR-08**: Each entry is a single line of text: "2026-01-03, 15 min"
- [ ] **FR-09**: No grouping by day, week, or month
- [ ] **FR-10**: No entry count, no statistics displayed

#### Logbook Access
- [ ] **FR-11**: Logbook icon is a simple "book" or "list" symbol (1 character: "≡")
- [ ] **FR-12**: Logbook screen has a back button to return to home
- [ ] **FR-13**: No swipe gestures, no animations for navigation
- [ ] **FR-14**: Logbook loads instantly (all data local)

#### Logbook Deletion
- [ ] **FR-15**: Single option to clear all logbook entries
- [ ] **FR-16**: Confirmation required before deletion
- [ ] **FR-17**: No partial deletion, no individual entry deletion
- [ ] **FR-18**: Deletion is immediate, no "undo" option

### UI/UX Requirements

All UI must adhere to the monochrome palette defined in `src/constants/theme.ts`:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text | Gray | `#888888` |
| Secondary text | Dark gray | `#888888` |
| Accent/Buttons | Medium gray | `#888888` |

**No other colors are permitted.**

Typography:
- Font: System monospace only
- No bold text
- No italic text
- No size variations except functional hierarchy

Specific UI requirements:
- [ ] **UI-01**: Logbook entries are left-aligned, single line each
- [ ] **UI-02**: Entry format: "YYYY-MM-DD HH:MM, XX min" (14 characters max)
- [ ] **UI-03**: No timestamps in entries (only date), time is optional
- [ ] **UI-04**: No visual distinction between entries (no borders, no spacing variations)

**UI Layout:**

Home Screen with Logbook access:
```
          15      60      +      ∞

              45/60 min this week

                   ≡
              (logbook)
```

Logbook Screen:
```
← Back

2026-01-03, 15 min
2026-01-02, 60 min
2026-01-02, 15 min
2026-01-01, 30 min
...
[ Clear All ]
```

### Platform-Specific Notes

**iOS:**
- No platform-specific considerations

**Android:**
- No platform-specific considerations

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | **No sorting options** | Users see entries in one order: reverse chronological. No sorting by date, duration, or any other field. |
| **AR-02** | **No filtering** | No filters for "this week," "last month," or by duration. Users see what they see. |
| **AR-03** | **No search functionality** | Search implies users will look for specific entries. The logbook is for passive scanning, not active searching. |
| **AR-04** | **No statistics or totals** | "Total boring time: 12 hours" is gamification. Users cannot see aggregated data. |
| **AR-05** | **No charts, graphs, or visualizations** | Visualizations make data interesting. The logbook is text-only, always. |
| **AR-06** | **No trends or streaks** | "You've done 3 sessions this week!" is engagement manipulation. No trend indicators. |
| **AR-07** | **No averages** | Average session duration creates optimization behavior. Forbidden. |
| **AR-08** | **No "best day" or "best time" analysis** | Data analysis encourages optimization. Forbidden. |
| **AR-09** | **No export functionality** | Export implies sharing or external analysis. Data stays on device. |
| **AR-10** | **No date range selectors** | No pickers, no calendars, no date range filtering. |
| **AR-11** | **No session duration highlighting** | Longer sessions don't get bigger text, different colors, or any emphasis. |
| **AR-12** | **No "goals achieved" indicators** | No checkmarks, no special formatting for hitting quota. |
| **AR-13** | **No individual entry details** | Tapping an entry does not show more information. It's a flat list. |
| **AR-14** | **No "streak" indicators** | No visual representation of consecutive days. |
| **AR-15** | **No motivational copy** | No "Great job this week!" or "Keep it up!" Text is purely informational. |
| **AR-16** | **No color coding** | Entries are all the same color. No green for "good" sessions, no red for missed days. |
| **AR-17** | **No entry count badge** | Logbook icon does not show "3 new entries" or total count. |
| **AR-18** | **No "consistency score"** | Any numeric score or percentage is engagement manipulation. Forbidden. |
| **AR-19** | **No heatmaps** | Heatmaps are visually engaging and imply patterns to optimize. Forbidden. |
| **AR-20** | **No comparisons to self** | "You're improving!" or "Down from last week" is explicitly forbidden. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/screens/LogbookScreen.tsx` | Logbook display screen |
| Create | `src/hooks/useLogbook.ts` | Logbook data management hook |
| Create | `src/utils/logbookStorage.ts` | Local storage for logbook entries |
| Modify | `src/screens/HomeScreen.tsx` | Add logbook navigation |
| Modify | `src/navigation/index.tsx` | Add LogbookScreen to navigation (if exists) |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| No new dependencies | - | - | - |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| entries | LogbookEntry[] | useLogbook | [] |

### Storage Schema

```typescript
interface LogbookEntry {
  id: string;           // UUID
  date: string;         // ISO date (YYYY-MM-DD)
  time: string;         // HH:MM
  duration: number;     // Minutes
  timestamp: number;    // Unix timestamp for sorting
}

interface LogbookStorage {
  entries: LogbookEntry[];
  lastUpdated: string;  // ISO timestamp
}
```

**Storage Location:** `localStorage` key: `boring_logbook`

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Storage read fails | Return empty array | Logbook shows empty state |
| Storage write fails | Log error, entry lost | Session not recorded |
| Maximum entries exceeded | Delete oldest entries | User sees most recent 100 |
| Corrupted entry data | Skip invalid entries | Partial list displayed |

---

## Implementation Notes

### Estimated Complexity

**[X] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Create `src/utils/logbookStorage.ts` for local storage operations
2. Create `src/hooks/useLogbook.ts` hook with entry management
3. Create `src/screens/LogbookScreen.tsx` with flat list display
4. Add logbook navigation to `HomeScreen.tsx`
5. Integrate logbook entry creation into `useBoringTimer.ts` completion
6. Test entry limits and deletion

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Complete 15 min countdown | Logbook shows "2026-01-03, 15 min" | [ ] |
| Complete 60 min countdown | Logbook shows "2026-01-03, 60 min" | [ ] |
| Complete count-up session | Logbook shows no entry | [ ] |
| Complete 30-second timer | Logbook shows no entry | [ ] |
| View logbook | Shows reverse chronological list | [ ] |
| Logbook exceeds 100 entries | Oldest entries deleted | [ ] |
| Clear all entries | Confirmation dialog appears | [ ] |
| After clear | Logbook shows empty state | [ ] |
| Navigation | Back button returns to home | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Should empty logbook show explanatory text? | No - empty is empty | - |
| Q2 | Should logbook be accessible via swipe? | No - only explicit navigation | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | - | Initial draft |
