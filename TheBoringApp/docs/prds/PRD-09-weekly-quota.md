# PRD-09: Weekly Quota System

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-09 |
| **Title** | Weekly Quota System |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2026-01-03 |
| **Updated** | 2026-01-03 |
| **Related PRDs** | PRD-10 (Logbook), PRD-01 (Timer Launcher) |

---

## Overview

### Problem Statement

Users want to commit to regular periods of doing nothing, but lack a mechanism to track whether they're meeting their self-imposed commitments. This is a constraint tool, not a reward system.

### User Story

As a user who has committed to doing nothing for 60 minutes each week, I want to see whether I've met my quota so that I can hold myself accountable without gamification.

### Success Metric

User sees a simple weekly quota display that shows target vs. actual boring time. No celebrations, no streaks, no rewards.

---

## Detailed Requirements

### Functional Requirements

#### Quota Configuration
- [ ] **FR-01**: User can set a weekly quota in 15-minute increments (15, 30, 45, 60, 90, 120 minutes)
- [ ] **FR-02**: Quota defaults to 60 minutes if not set
- [ ] **FR-03**: Quota persists locally (no cloud sync, no accounts)

#### Quota Display
- [ ] **FR-04**: Home screen shows quota indicator as small text: "60/60 min" or "45/60 min"
- [ ] **FR-05**: Quota indicator uses same color as secondary text
- [ ] **FR-06**: Quota updates in real-time as timer sessions complete
- [ ] **FR-07**: Quota week resets on Sunday at 00:00 local time

#### Quota Completion
- [ ] **FR-08**: When quota is met, indicator shows "60/60 min" (exact match, no visual emphasis)
- [ ] **FR-09**: When quota is exceeded, indicator shows "75/60 min" (no celebration)
- [ ] **FR-10**: No notifications when quota is met or reset

#### Quota Logging
- [ ] **FR-11**: Each completed session contributes to weekly total (countdown only)
- [ ] **FR-12**: Count-up sessions do NOT contribute to quota (per PRD-10 philosophy)
- [ ] **FR-13**: Sessions under 1 minute do not count toward quota

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
- [ ] **UI-01**: Quota indicator is a single line of text, maximum 12 characters
- [ ] **UI-02**: Quota indicator appears below timer display, above button row
- [ ] **UI-03**: No progress bars, no circular indicators, no fills

**UI Layout:**

Idle state with quota:
```
          15      60      +      ∞

              45/60 min this week
```

Running state with quota:
```
             47:23

           put it down

              30/60 min this week
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
| **AR-01** | **No motivational notifications** | Notifications like "You're halfway there!" or "Great job!" transform the app into a gamification tool. Quota completion should feel as neutral as any other timer completion. |
| **AR-02** | **No progress sharing** | Sharing quota achievements defeats the purpose. This is a personal commitment tool, not a social flex. |
| **AR-03** | **No color-coded success indicators** | Green for "met quota" or red for "missed quota" introduces emotional valence. All indicators remain grayscale. |
| **AR-04** | **No streak tracking** | Streaks encourage addiction patterns. Users should meet their quota for the week, not build streaks across weeks. |
| **AR-05** | **No achievements or badges** | Achievements are the antithesis of boring. The quota is a constraint, not a reward to unlock. |
| **AR-06** | **No weekly summaries or statistics** | Statistics encourage optimization behavior. Users see their current week's total, nothing more. |
| **AR-07** | **No comparison to previous weeks** | "You did better this week!" is engagement manipulation. Weekly comparison is forbidden. |
| **AR-08** | **No quota celebrations or animations** | Confetti, animations, or special effects when quota is met are explicitly forbidden. |
| **AR-09** | **No reminders to complete quota** | The app does not notify users to finish their quota. It's a commitment tool, not a nag. |
| **AR-10** | **No leaderboards** | Leaderboards introduce social pressure and competition. Absolutely forbidden. |
| **AR-11** | **No "quota streak" tracking** | Even tracking consecutive weeks of meeting quota is forbidden. Each week stands alone. |
| **AR-12** | **No visual emphasis on quota completion** | The indicator doesn't change size, color, or animation when quota is met. It simply shows the updated number. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/constants/quota.ts` | Quota configuration constants |
| Create | `src/hooks/useWeeklyQuota.ts` | Quota state management hook |
| Modify | `src/hooks/useBoringTimer.ts` | Integrate quota tracking into timer completion |
| Modify | `src/screens/HomeScreen.tsx` | Display quota indicator |
| Modify | `src/services/timerService.interface.ts` | Add quota tracking to service interface |
| Create | `src/utils/quotaStorage.ts` | Local storage for quota persistence |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| No new dependencies | - | - | - |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| weeklyTargetMinutes | number | useWeeklyQuota | 60 |
| currentWeekMinutes | number | useWeeklyQuota | 0 |
| weekStartDate | Date | useWeeklyQuota | This week's Sunday |
| isQuotaMet | boolean | useWeeklyQuota | false |

### Storage Schema

```typescript
interface QuotaStorage {
  weeklyTargetMinutes: number;  // User's weekly quota in minutes
  currentWeekMinutes: number;   // Accumulated this week
  weekStartDate: string;        // ISO date of week's Sunday
  lastUpdated: string;          // ISO timestamp
}
```

**Storage Location:** `localStorage` key: `boring_quota`

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Storage read fails | Default to 60 minutes | Quota shows 0/60 |
| Week rollover calculation fails | Reset to 0, set new week | User sees 0/new target |
| Negative quota value | Clamp to minimum 15 | User sees 15 or corrected value |

---

## Implementation Notes

### Estimated Complexity

**[X] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Create `src/constants/quota.ts` with configuration values
2. Create `src/utils/quotaStorage.ts` for local storage operations
3. Create `src/hooks/useWeeklyQuota.ts` hook
4. Modify `useBoringTimer.ts` to call quota tracking on completion
5. Add quota indicator to `HomeScreen.tsx`
6. Test week rollover logic

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Default quota display | Shows "60/60 min" | [ ] |
| After 15 min session | Shows "15/60 min" | [ ] |
| After multiple sessions totaling 45 min | Shows "45/60 min" | [ ] |
| After reaching exactly 60 min | Shows "60/60 min" (no emphasis) | [ ] |
| After exceeding quota (75 min) | Shows "75/60 min" | [ ] |
| Week rollover (Sunday 00:00) | Resets to "0/60 min" | [ ] |
| Count-up session | Does NOT contribute to quota | [ ] |
| 30-second timer | Does NOT count toward quota | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Should custom duration input remember last-used duration? | TBD | - |
| Q2 | What happens if quota is set below accumulated time? | Clamp to current value | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | - | Initial draft |
