# PRD-01: Timer Launcher

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-01 |
| **Title** | Timer Launcher |
| **Status** | Updated to match implementation |
| **Author** | BillSteinUNB |
| **Created** | 2025-12-22 |
| **Updated** | 2026-01-03 |
| **Related PRDs** | PRD-07 (Count-up Mode) |

---

## Overview

### Problem Statement
The user needs a way to commit to doing nothing for a set period of time—or indefinitely. The interface must be so minimal that there's nothing to engage with except starting the timer.

### User Story
As a user, I want to select a duration (or enter custom time) or start an indefinite count-up so that I can commit to a period of intentional boredom or reflection.

### Success Metric
User can tap a duration/custom input/count-up, and the timer begins. The in-app display shows only minimal feedback—no engaging elements.

---

## Detailed Requirements

### Functional Requirements

#### Duration Selection
- [x] **FR-01**: Display exactly two preset duration options: 15 and 60 minutes
- [x] **FR-02**: Only one duration can be selected at a time
- [x] **FR-03**: Tapping a duration selects it immediately (no confirmation needed)
- [x] **FR-04**: Custom duration option (+) allows input of 1-180 minutes
- [x] **FR-05**: Count-up mode option (∞) starts indefinite timer
- [x] **FR-06**: Default selection is 15 minutes when app opens

#### Timer Control
- [x] **FR-07**: Tapping a preset duration starts the countdown immediately
- [x] **FR-08**: Custom duration requires tap on "Start" to begin
- [x] **FR-09**: Count-up mode starts immediately on tap
- [x] **FR-10**: Count-up mode has full-screen tap area to stop (only way to end)
- [x] **FR-11**: Once started, the UI shows time elapsed/remaining—no buttons visible
- [x] **FR-12**: Timer auto-resets after completion (5s countdown, 3s countup)
- [x] **FR-13**: Starting the timer triggers platform-specific lock screen display (PRD-02, PRD-03)

#### Display States
| State | Display | Notes |
|-------|---------|-------|
| Idle | Duration buttons (15, 60, +, ∞) | No default selected |
| Idle-custom | Numeric input + Start button | Input 1-180 minutes |
| Running-countdown | Time remaining + "put it down" | No buttons visible |
| Running-countup | Time elapsed + "tap to stop" | Full touch area |
| Complete (countdown) | "Done." | Auto-resets after 5s |
| Complete (countup) | Time elapsed + "done" | Auto-resets after 3s |

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
- Duration buttons: same size
- Timer display: larger, prominent

Specific UI requirements:
- [x] **UI-01**: Full screen background `#0a0a0a`, no safe area modifications
- [x] **UI-02**: Duration buttons arranged horizontally, centered vertically
- [x] **UI-03**: Buttons display only the number and "min" (e.g., "15")
- [x] **UI-04**: Custom button shows "+" only
- [x] **UI-05**: Count-up button shows "∞" (infinity symbol)
- [x] **UI-06**: Selected state indicated by border, unselected have no border
- [x] **UI-07**: No app title, logo, or branding visible anywhere
- [x] **UI-08**: No status bar styling beyond dark mode
- [x] **UI-09**: "put it down" centered below timer when countdown active
- [x] **UI-10**: "tap to stop" centered below timer when count-up active
- [x] **UI-11**: No animations on any interaction
- [x] **UI-12**: Tap targets minimum 44pt for accessibility, but visually minimal
- [x] **UI-13**: Custom input has border, displays "min" label, numeric keyboard

### Platform-Specific Notes

**iOS:**
- StatusBar style: light content (for dark background)
- No special iOS UI considerations

**Android:**
- StatusBar and navigation bar should match background color
- No special Android UI considerations

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No visible countdown timer in the app (count-up mode exception) | Watching time pass is engaging. Put the phone down. Count-up shows elapsed for intentional stopping. |
| **AR-02** | No cancel or pause button (count-up exception) | Commitment means no escape. Start it and you're done. Count-up allows intentional stop when ready. |
| **AR-03** | No settings or preferences screen | Nothing to configure. Accept the constraints. |
| **AR-04** | No onboarding or tutorial | The app is self-evident. Four buttons. That's it. |
| **AR-05** | No sound effects or haptic feedback on tap | Feedback is reward. Taps should feel like nothing. |
| **AR-06** | No transition animations | Animations are delightful. We don't want delight. |
| **AR-07** | No app icon badge or home screen widgets | No reason to look at your phone. |
| **AR-08** | No "are you sure?" confirmation dialogs | Friction is engagement. One tap, done. |
| **AR-09** | No dark/light mode toggle | It's dark. That's it. |
| **AR-10** | No history or statistics tracking | Nothing to analyze. This moment only. |
| **AR-11** | No social features or sharing | Your boring time is yours alone. |
| **AR-12** | No notifications beyond timer completion | We won't remind you to be bored. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modified | `src/screens/HomeScreen.tsx` | Timer launcher UI with 4 buttons |
| Modified | `src/hooks/useBoringTimer.ts` | Timer state, countdown + count-up modes |
| Modified | `src/constants/theme.ts` | Colors matching spec |
| Modified | `src/constants/durations.ts` | 15/60 durations, custom input range |
| Created | `src/components/CustomDurationInput.tsx` | Numeric input for custom duration |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| react-native | (existing) | Core UI | No |
| expo-status-bar | (existing) | Status bar styling | No |

No additional dependencies required for this PRD.

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| status | `'idle' \| 'running' \| 'complete'` | useBoringTimer | `'idle'` |
| mode | `'countdown' \| 'countup'` | useBoringTimer | `'countdown'` |
| selectedDuration | `number \| null` | useBoringTimer | `null` |
| endTime | `number \| null` | useBoringTimer | `null` |
| startTime | `number \| null` | useBoringTimer | `null` |
| showCustomInput | `boolean` | HomeScreen | `false` |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Platform service fails to start | Log error, continue with in-app timer only | None visible |
| Invalid duration somehow selected | Default to 15 minutes | None visible |
| Custom input outside 1-180 range | Reset to default 30 minutes | None visible |

---

## Implementation Notes

### Estimated Complexity

**[x] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Implementation Order

1. Update `theme.ts` with correct color values
2. Implement duration selection UI (15, 60, +, ∞) in `HomeScreen.tsx`
3. Implement `useBoringTimer` hook with countdown mode
4. Add custom duration input component
5. Add count-up mode to timer hook
6. Connect all UI states to timer hook
7. Add "put it down" / "tap to stop" active states
8. Test all four timer options

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| App opens to timer launcher | Four buttons visible: 15, 60, +, ∞ | [x] |
| Tap 15 min | 15 min timer starts, shows time + "put it down" | [x] |
| Tap 60 min | 60 min timer starts, shows time + "put it down" | [x] |
| Tap + | Shows numeric input, "min" label, Start button | [x] |
| Enter 45, tap Start | 45 min timer starts | [x] |
| Tap ∞ | Count-up starts, shows 00:00 + "tap to stop" | [x] |
| Tap screen during count-up | Timer stops, shows elapsed + "done", auto-resets | [x] |
| Countdown completes | Shows "Done.", auto-resets after 5s | [x] |
| No visible buttons during countdown | Only time and "put it down" visible | [x] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| - | None | - | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | BillSteinUNB | Initial draft |
| 2026-01-03 | Sisyphus | Updated to match implementation: 15/60 buttons, custom input, count-up mode |
