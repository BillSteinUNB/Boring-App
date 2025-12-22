# PRD-01: Timer Launcher

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-01 |
| **Title** | Timer Launcher |
| **Status** | Draft |
| **Author** | BillSteinUNB |
| **Created** | 2025-12-22 |
| **Updated** | 2025-12-22 |
| **Related PRDs** | None (this is the core feature) |

---

## Overview

### Problem Statement
The user needs a way to commit to doing nothing for a set period of time. The interface must be so minimal that there's nothing to engage with except starting the timer.

### User Story
As a user, I want to select a duration and start a timer so that I can commit to a period of intentional boredom.

### Success Metric
User can tap a duration, tap start, and see the message "Put your phone down." The timer begins counting.

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: Display exactly three duration options: 5, 15, and 30 minutes
- [ ] **FR-02**: Only one duration can be selected at a time
- [ ] **FR-03**: Tapping a duration selects it (no confirmation needed)
- [ ] **FR-04**: Display a single "start" button (no text, or minimal text)
- [ ] **FR-05**: Tapping start initiates the timer and shows "Put your phone down."
- [ ] **FR-06**: Once started, the UI shows only the message—no countdown visible in-app
- [ ] **FR-07**: Default selection is 5 minutes when app opens
- [ ] **FR-08**: Starting the timer triggers platform-specific lock screen display (PRD-02, PRD-03)

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
- "Put your phone down." message: same size as durations

Specific UI requirements:
- [ ] **UI-01**: Full screen background `#0a0a0a`, no safe area modifications
- [ ] **UI-02**: Duration buttons arranged horizontally, centered vertically
- [ ] **UI-03**: Buttons display only the number and "min" (e.g., "5 min")
- [ ] **UI-04**: Selected button has subtle border `#666666`, unselected have no border
- [ ] **UI-05**: Start button below duration buttons, minimal size
- [ ] **UI-06**: No app title, logo, or branding visible anywhere
- [ ] **UI-07**: No status bar styling beyond dark mode
- [ ] **UI-08**: "Put your phone down." centered on screen when timer active
- [ ] **UI-09**: No animations on any interaction
- [ ] **UI-10**: Tap targets minimum 44pt for accessibility, but visually minimal

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
| **AR-01** | No visible countdown timer in the app | Watching time pass is engaging. Put the phone down. |
| **AR-02** | No cancel or pause button | Commitment means no escape. Start it and you're done. |
| **AR-03** | No settings or preferences screen | Nothing to configure. Accept the constraints. |
| **AR-04** | No onboarding or tutorial | The app is self-evident. Three buttons. That's it. |
| **AR-05** | No custom duration input | Choice paralysis is engagement. Three options only. |
| **AR-06** | No sound effects or haptic feedback on tap | Feedback is reward. Taps should feel like nothing. |
| **AR-07** | No transition animations | Animations are delightful. We don't want delight. |
| **AR-08** | No app icon badge or home screen widgets | No reason to look at your phone. |
| **AR-09** | No "are you sure?" confirmation dialogs | Friction is engagement. One tap, done. |
| **AR-10** | No dark/light mode toggle | It's dark. That's it. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/screens/HomeScreen.tsx` | Implement the timer launcher UI |
| Modify | `src/hooks/useBoringTimer.ts` | Implement timer state and start logic |
| Modify | `src/constants/theme.ts` | Update colors to match PRD spec |
| Modify | `src/constants/durations.ts` | Verify durations match spec |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| react-native | (existing) | Core UI | No |
| expo-status-bar | (existing) | Status bar styling | No |

No additional dependencies required for this PRD.

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| selectedDuration | `5 \| 15 \| 30` | useBoringTimer | `5` |
| timerState | `'idle' \| 'running' \| 'completed'` | useBoringTimer | `'idle'` |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Platform service fails to start | Log error, continue with in-app timer only | None visible |
| Invalid duration somehow selected | Default to 5 minutes | None visible |

---

## Implementation Notes

### Estimated Complexity

**[x] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Update `theme.ts` with correct color values
2. Implement duration selection UI in `HomeScreen.tsx`
3. Implement `useBoringTimer` hook with state management
4. Connect UI to hook
5. Add "Put your phone down." active state
6. Test all three durations

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| App opens to timer launcher | Three duration buttons visible, 5 min selected | [ ] |
| Tap 15 min | 15 min becomes selected, others deselected | [ ] |
| Tap start with 5 min selected | Shows "Put your phone down." | [ ] |
| Timer state is 'running' after start | `useBoringTimer` returns running state | [ ] |
| No visible countdown in app | Only message visible, no numbers | [ ] |
| No cancel button visible | User cannot stop timer from within app | [ ] |

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
