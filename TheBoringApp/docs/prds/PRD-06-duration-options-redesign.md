# PRD-06: Duration Options Redesign

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-06 |
| **Title** | Duration Options Redesign |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2024-12-24 |
| **Updated** | 2024-12-24 |
| **Related PRDs** | PRD-01 (timer-launcher), PRD-05 (visual-timer-display) |

---

## Overview

### Problem Statement
Current options (5, 15, 30) are arbitrary and limiting. Users want longer sessions and custom durations.

### User Story
As a user, I want to choose 15 minutes, 1 hour, or set my own duration.

### Success Metric
User can start a timer with 15 min, 60 min, or any custom duration between 1-180 minutes.

---

## Detailed Requirements

### Functional Requirements

#### Main Buttons (Idle State)
- [ ] **FR-01**: Three buttons in a row: "15" "60" "+"
- [ ] **FR-02**: "15" = 15 minutes
- [ ] **FR-03**: "60" = 60 minutes (1 hour)
- [ ] **FR-04**: "+" = opens custom duration input

#### Custom Duration Input
- [ ] **FR-05**: Tapping "+" reveals a simple input row
- [ ] **FR-06**: Input shows: "[ 30 ] min" with 30 as default
- [ ] **FR-07**: User can tap the number to edit
- [ ] **FR-08**: Minimal number input (no picker wheel, no slider)
- [ ] **FR-09**: "Start" button appears next to input
- [ ] **FR-10**: Tapping elsewhere cancels and returns to main buttons

#### Input Constraints
- [ ] **FR-11**: Minimum: 1 minute
- [ ] **FR-12**: Maximum: 180 minutes (3 hours)
- [ ] **FR-13**: Only whole numbers

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
- [ ] **UI-01**: Buttons styled consistently with existing theme
- [ ] **UI-02**: Custom input uses numeric keyboard only

**UI Layout:**

Idle (default):
```
         15      60      +
```

Idle (custom open):
```
         [ 30 ] min    Start
```

### Platform-Specific Notes

**iOS:**
- Use numeric keyboard type for TextInput

**Android:**
- Use numeric keyboard type for TextInput

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No slider | Sliders are interactive/playful UI elements |
| **AR-02** | No hour/minute picker wheels | Picker wheels are visually complex and engaging |
| **AR-03** | No presets beyond 15 and 60 | Minimalism - two options plus custom is sufficient |
| **AR-04** | No "favorites" or "recents" | Feature creep that adds complexity |
| **AR-05** | No explanation text | The UI should be self-evident |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/constants/durations.ts` | Update with new defaults (15, 60) |
| Modify | `src/screens/HomeScreen.tsx` | Implement new button layout and custom input |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| @react-native-async-storage/async-storage | existing | Store last custom value (optional) | No |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| showCustomInput | boolean | HomeScreen | false |
| customDuration | number | HomeScreen | 30 |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Input below 1 | Clamp to 1 | Input shows 1 |
| Input above 180 | Clamp to 180 | Input shows 180 |
| Non-numeric input | Ignore/filter | Only numbers accepted |

---

## Implementation Notes

### Estimated Complexity

**[X] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Update durations.ts with new defaults (15, 60)
2. Modify HomeScreen button layout to show "15", "60", "+"
3. Implement custom input toggle state
4. Add TextInput with numeric keyboard for custom duration
5. Add input validation (1-180, whole numbers only)
6. (Optional) Store last custom value in AsyncStorage

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Tap "15" button | Starts 15-minute timer | [ ] |
| Tap "60" button | Starts 60-minute timer | [ ] |
| Tap "+" button | Shows custom input with default 30 | [ ] |
| Enter valid custom duration | Can start timer with that duration | [ ] |
| Enter 0 | Clamps to 1 | [ ] |
| Enter 200 | Clamps to 180 | [ ] |
| Tap outside custom input | Returns to main buttons | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Should last custom value persist across sessions? | Optional, low priority | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-12-24 | - | Initial draft |
