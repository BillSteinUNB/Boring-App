# PRD-07: Count-Up Mode (Stopwatch)

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-07 |
| **Title** | Count-Up Mode (Stopwatch) |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2024-12-24 |
| **Updated** | 2024-12-24 |
| **Related PRDs** | PRD-01 (timer-launcher), PRD-05 (visual-timer-display), PRD-06 (duration-options-redesign) |

---

## Overview

### Problem Statement
Sometimes you want open-ended boredom with no pressure. A stopwatch lets you be bored without commitment.

### User Story
As a user, I want to start an open-ended timer that counts up until I stop it.

### Success Metric
User can start a count-up timer, see elapsed time, and stop it by tapping the screen.

---

## Detailed Requirements

### Functional Requirements

#### Activation
- [ ] **FR-01**: Fourth button added to row: "∞" (or just "up")
- [ ] **FR-02**: Tapping starts count-up immediately

#### Running State (Count-Up)
- [ ] **FR-03**: Display shows elapsed time: MM:SS (or H:MM:SS)
- [ ] **FR-04**: Same styling as countdown timer
- [ ] **FR-05**: Below timer: "tap to stop" in secondaryText
- [ ] **FR-06**: Tapping anywhere on screen stops the timer

#### Completion
- [ ] **FR-07**: No auto-complete (runs until stopped)
- [ ] **FR-08**: When stopped, briefly shows total time: "12:34"
- [ ] **FR-09**: Then returns to idle after 3 seconds

### UI/UX Requirements

All UI must adhere to the monochrome palette defined in `src/constants/theme.ts`:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text | Gray | `#888888` |
| Secondary text | Dark gray | `#444444` |
| Accent/Buttons | Medium gray | `#666666` |

**No other colors are permitted.**

Typography:
- Font: System monospace only
- No bold text
- No italic text
- No size variations except functional hierarchy

Specific UI requirements:
- [ ] **UI-01**: Timer display matches countdown styling exactly
- [ ] **UI-02**: "tap to stop" text in secondaryText color
- [ ] **UI-03**: "done" text in secondaryText color

**UI Layout:**

Idle:
```
         15      60      +      ∞
```

Running (count-up):
```
            03:47
         
          tap to stop
```

Stopped:
```
            12:34
            
             done
```

### Platform-Specific Notes

**iOS:**
- Tap handler should cover full screen area

**Android:**
- Tap handler should cover full screen area

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No lap times | Lap tracking is a fitness/productivity feature |
| **AR-02** | No pause/resume (stop is final) | Simplicity - one action, one outcome |
| **AR-03** | No saving the result | No data collection or history |
| **AR-04** | No "beat your record" comparison | Gamification undermines boredom |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/hooks/useBoringTimer.ts` | Add mode: 'countdown' \| 'countup' support |
| Modify | `src/screens/HomeScreen.tsx` | Add ∞ button, tap-to-stop handler, stopped state |
| Modify | `src/constants/durations.ts` | Add count-up option if needed |

### Dependencies

No new dependencies required.

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| mode | 'countdown' \| 'countup' | useBoringTimer | 'countdown' |
| startTime | number \| null | useBoringTimer | null |
| elapsedTime | number | useBoringTimer | 0 |
| isStopped | boolean | useBoringTimer | false |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Timer runs indefinitely | No cap needed, H:MM:SS handles long durations | None |
| Accidental tap | No undo - simplicity over safety | User restarts if needed |

---

## Implementation Notes

### Estimated Complexity

**[X] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Add mode: 'countdown' | 'countup' to timer state in useBoringTimer
2. Implement count-up logic (start from 0, increment each second)
3. Set endTime to null for count-up mode
4. Add "∞" button to HomeScreen idle state
5. Add tap handler on container view for stopping
6. Implement stopped state with 3-second display before returning to idle

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Tap "∞" button | Starts count-up from 00:00 | [ ] |
| Count-up running | Time increments every second | [ ] |
| Tap screen while running | Timer stops | [ ] |
| After stopping | Shows final time for 3 seconds | [ ] |
| After 3 seconds | Returns to idle state | [ ] |
| Run past 1 hour | Displays H:MM:SS format | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Button label: "∞" or "up"? | TBD | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-12-24 | - | Initial draft |
