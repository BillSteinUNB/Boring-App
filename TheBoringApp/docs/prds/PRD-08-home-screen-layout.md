# PRD-08: Home Screen Layout Update

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-08 |
| **Title** | Home Screen Layout Update |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2024-12-24 |
| **Updated** | 2024-12-24 |
| **Related PRDs** | PRD-05 (visual-timer-display), PRD-06 (duration-options-redesign), PRD-07 (countup-mode) |

---

## Overview

### Problem Statement
Adding custom input and count-up mode changes the home screen structure. Need to redesign without adding clutter.

### User Story
As a user, I want a clean home screen that accommodates all timer modes without feeling cluttered.

### Success Metric
Home screen displays correct UI for all five states with maximum 5 tappable elements visible at any time.

---

## Detailed Requirements

### Functional Requirements

#### Button Row
- [ ] **FR-01**: Four buttons: "15" "60" "+" "∞"
- [ ] **FR-02**: Equal spacing, same size as before
- [ ] **FR-03**: "+" is slightly different style (border?) to indicate it opens input

#### Custom Input Row (when active)
- [ ] **FR-04**: Replaces button row (doesn't stack below)
- [ ] **FR-05**: Simple layout: [input] "min" [Start]
- [ ] **FR-06**: Tap outside to cancel

#### Running State
- [ ] **FR-07**: Shows visual timer (from PRD-05)
- [ ] **FR-08**: For countdown: shows time remaining
- [ ] **FR-09**: For count-up: shows time elapsed + "tap to stop"

#### Complete State
- [ ] **FR-10**: Shows "Done." for countdown
- [ ] **FR-11**: Shows final time + "done" for count-up
- [ ] **FR-12**: Returns to idle after 3-5 seconds

### Screen States Summary

| State | Description |
|-------|-------------|
| 1. Idle | Buttons visible (15, 60, +, ∞) |
| 2. Idle + Custom Input | Input row visible, replaces buttons |
| 3. Running Countdown | Timer + "put it down" |
| 4. Running Count-up | Timer + "tap to stop" |
| 5. Complete | Final message, returns to idle |

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
- [ ] **UI-01**: Maximum 5 tappable elements on screen at any time
- [ ] **UI-02**: "+" button has subtle border to differentiate from preset buttons
- [ ] **UI-03**: All states use consistent vertical centering

**UI Layouts:**

State 1 - Idle (buttons visible):
```
         15      60      +      ∞
```

State 2 - Idle + Custom Input:
```
         [ 30 ] min    Start
```

State 3 - Running Countdown:
```
            47:23
         
          put it down
```

State 4 - Running Count-up:
```
            03:47
         
          tap to stop
```

State 5 - Complete (countdown):
```
            Done.
```

State 5 - Complete (count-up):
```
            12:34
            
             done
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
| **AR-01** | No tab bar or navigation | Single-screen app, no navigation needed |
| **AR-02** | No settings icon | Nothing to configure |
| **AR-03** | No hamburger menu | Hidden menus add complexity |
| **AR-04** | No onboarding overlay | App is self-explanatory |
| **AR-05** | Maximum 5 tappable elements on screen at any time | Constraint forces simplicity |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/screens/HomeScreen.tsx` | Implement all five screen states |
| Modify | `src/hooks/useBoringTimer.ts` | Support state management for all modes |
| Modify | `src/constants/durations.ts` | Update button configurations |

### Dependencies

No new dependencies required.

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| screenState | 'idle' \| 'customInput' \| 'runningCountdown' \| 'runningCountup' \| 'complete' | HomeScreen | 'idle' |
| mode | 'countdown' \| 'countup' | useBoringTimer | 'countdown' |
| showCustomInput | boolean | HomeScreen | false |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Invalid state transition | Reset to idle | User sees idle state |
| Timer completion during background | Handle on foreground return | Shows complete state |

---

## Implementation Notes

### Estimated Complexity

**[ ] Small** (< 1 day) | **[X] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

> **Important**: This PRD should be implemented LAST, after PRD-05, PRD-06, and PRD-07.

**Recommended overall order:**
1. PRD-05: Visual Timer Display → Quick win, immediately feels more complete
2. PRD-06: Duration Options Redesign → Changes the buttons, affects PRD-08
3. PRD-07: Count-Up Mode → New feature, builds on timer hook
4. PRD-08: Home Screen Layout Update → Ties it all together, do last

**Implementation steps for this PRD:**
1. Refactor HomeScreen to use explicit screen state machine
2. Implement state transitions between all five states
3. Ensure button row and custom input row swap correctly
4. Add "+" button border styling
5. Verify maximum 5 tappable elements constraint in all states
6. Test all state transitions

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Idle state | Shows 4 buttons (15, 60, +, ∞) | [ ] |
| Tap "+" | Switches to custom input row | [ ] |
| Tap outside custom input | Returns to idle buttons | [ ] |
| Start countdown | Shows running countdown state | [ ] |
| Start count-up | Shows running count-up state | [ ] |
| Countdown completes | Shows "Done." then returns to idle | [ ] |
| Count-up stopped | Shows final time + "done" then returns to idle | [ ] |
| Count tappable elements | Never more than 5 in any state | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Exact styling for "+" button border? | TBD | - |
| Q2 | Return to idle delay: 3 or 5 seconds? | TBD | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-12-24 | - | Initial draft |
