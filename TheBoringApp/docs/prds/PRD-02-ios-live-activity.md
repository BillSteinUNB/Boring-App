# PRD-02: iOS Live Activity

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-02 |
| **Title** | iOS Live Activity |
| **Status** | Draft |
| **Author** | BillSteinUNB |
| **Created** | 2025-12-22 |
| **Updated** | 2025-12-22 |
| **Related PRDs** | PRD-01 (triggers this), PRD-04 (completion state) |

---

## Overview

### Problem Statement
When the user puts their phone down, they need a way to glance at the lock screen to see remaining time without unlocking or opening the app.

### User Story
As a user, I want to see my remaining time on the lock screen so that I can glance at it without picking up my phone.

### Success Metric
Lock screen displays countdown timer. Timer updates. Timer reaches zero and shows completion state.

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: Start Live Activity when timer begins (triggered by PRD-01)
- [ ] **FR-02**: Display remaining time in MM:SS format
- [ ] **FR-03**: Update countdown every second
- [ ] **FR-04**: Show on Lock Screen widget area
- [ ] **FR-05**: Show on Dynamic Island (iPhone 14 Pro and later) in compact and expanded views
- [ ] **FR-06**: Handle timer completion (transition to PRD-04 completion state)
- [ ] **FR-07**: End Live Activity 5 seconds after completion
- [ ] **FR-08**: Handle app termination gracefully (Live Activity continues via push updates or local scheduling)

### UI/UX Requirements

All UI must adhere to the monochrome palette:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text (time) | Gray | `#888888` |
| Secondary text | Dark gray | `#444444` |

**No other colors are permitted.**

Typography:
- Font: System monospace only
- Time display: single size, no emphasis
- No labels (no "remaining" or "left" text—just the time)

Specific UI requirements:
- [ ] **UI-01**: Lock Screen widget shows only "MM:SS" centered
- [ ] **UI-02**: No app icon in the Live Activity
- [ ] **UI-03**: No progress bar or visual indicator
- [ ] **UI-04**: No app name text
- [ ] **UI-05**: Dynamic Island compact: just the time
- [ ] **UI-06**: Dynamic Island expanded: just the time, slightly larger
- [ ] **UI-07**: Background matches system dark, content is monochrome
- [ ] **UI-08**: No leading zeros on minutes for times under 10 minutes (e.g., "5:00" not "05:00")

### Platform-Specific Notes

**iOS:**
- Requires iOS 16.1+ for Live Activities
- Requires iOS 16.2+ for Live Activity push updates
- Uses ActivityKit framework
- Requires Widget Extension target in Xcode project
- Live Activity UI is built with SwiftUI in the widget extension
- `expo-live-activity` or custom native module required

**Android:**
- Not applicable (see PRD-03)

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No progress bar or ring | Visual progress is engaging. Just show time. |
| **AR-02** | No app icon or branding | No reminder of what app this is. Just time. |
| **AR-03** | No color changes as time decreases | Urgency colors are stimulating. Stay gray. |
| **AR-04** | No haptic or sound at milestones | No "halfway there" celebration. |
| **AR-05** | No interactive buttons on Live Activity | Nothing to tap. Nothing to do. |
| **AR-06** | No motivational text | No "keep going" or "almost there" messages. |
| **AR-07** | No expandable details section | Nothing more to see. Just time. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/services/ios/liveActivity.ts` | Implement native bridge calls |
| Create | `ios/BoringWidget/BoringWidget.swift` | Widget extension entry point |
| Create | `ios/BoringWidget/BoringWidgetLiveActivity.swift` | Live Activity UI definition |
| Create | `ios/BoringWidget/BoringWidgetBundle.swift` | Widget bundle configuration |
| Modify | `ios/TheBoringApp.xcodeproj` | Add widget extension target |
| Modify | `app.json` | Configure iOS entitlements for Live Activities |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| expo-live-activity | ^1.x.x | Bridge to ActivityKit | Yes |

*Note: If `expo-live-activity` is insufficient, a custom native module may be required.*

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| liveActivityId | `string \| null` | liveActivity service | `null` |
| isLiveActivitySupported | `boolean` | liveActivity service | `false` (checked at runtime) |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| iOS < 16.1 | Check version, skip Live Activity silently | No lock screen timer, app still works |
| Live Activity fails to start | Log error, continue without | No lock screen timer |
| Push update fails | Fall back to local timer updates | May see stale time briefly |
| Widget extension crash | System handles, Activity dismissed | Timer continues in app |

---

## Implementation Notes

### Estimated Complexity

**[ ] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[x] Large** (3+ days)

*Complexity is high due to native module requirements and Xcode widget extension setup.*

### Suggested Implementation Order

1. Research `expo-live-activity` capabilities and limitations
2. Create Xcode widget extension target
3. Implement minimal SwiftUI Live Activity UI
4. Create native bridge in `liveActivity.ts`
5. Connect to `useBoringTimer` hook
6. Test on physical device (Live Activities don't work in Simulator)
7. Handle completion state (coordinate with PRD-04)

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Start timer | Live Activity appears on Lock Screen | [ ] |
| Time updates | Countdown decreases every second | [ ] |
| Dynamic Island (if available) | Shows compact time | [ ] |
| Expand Dynamic Island | Shows time, nothing else | [ ] |
| Timer completes | Transitions to "Done" state (PRD-04) | [ ] |
| Lock phone during timer | Live Activity visible on Lock Screen | [ ] |
| Force quit app | Live Activity continues (if push configured) | [ ] |
| iOS 15 device | No crash, Live Activity just doesn't appear | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Does expo-live-activity support our minimal UI needs? | Need to evaluate library | - |
| Q2 | Do we need push updates for background survival? | Decide based on testing | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | BillSteinUNB | Initial draft |
