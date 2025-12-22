# PRD-04: Timer Completion

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-04 |
| **Title** | Timer Completion |
| **Status** | Draft |
| **Author** | BillSteinUNB |
| **Created** | 2025-12-22 |
| **Updated** | 2025-12-22 |
| **Related PRDs** | PRD-01 (timer source), PRD-02 (iOS completion), PRD-03 (Android completion) |

---

## Overview

### Problem Statement
When the timer ends, the app needs to communicate completion without celebration, reward, or fanfare.

### User Story
As a user, I want to know when my timer is done so that I can resume my activities.

### Success Metric
Timer ends. User is informed. App returns to initial state. Nothing else happens.

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: Detect timer reaching zero
- [ ] **FR-02**: Update timer state to 'completed'
- [ ] **FR-03**: iOS: Live Activity shows "Done" for 5 seconds, then dismisses
- [ ] **FR-04**: Android: Notification updates to "Done. You did nothing." then auto-clears after 5 seconds
- [ ] **FR-05**: App (if open): Return to initial state silently
- [ ] **FR-06**: App (if backgrounded): No special handling, lock screen handles it
- [ ] **FR-07**: No sound plays on completion
- [ ] **FR-08**: No vibration on completion
- [ ] **FR-09**: After completion, app is ready to start a new timer immediately

### UI/UX Requirements

All UI must adhere to the monochrome palette:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text | Gray | `#888888` |
| Secondary text | Dark gray | `#444444` |

**No other colors are permitted.**

Specific UI requirements:
- [ ] **UI-01**: iOS Live Activity completion: "Done" centered, same font as timer
- [ ] **UI-02**: Android notification completion: "Done. You did nothing." as content
- [ ] **UI-03**: App completion: Silently return to duration selection screen
- [ ] **UI-04**: No animation on transition back to initial state
- [ ] **UI-05**: No "congratulations" or success messaging
- [ ] **UI-06**: No statistics shown ("You did 5 minutes of nothing")
- [ ] **UI-07**: No prompt to start another timer
- [ ] **UI-08**: No social sharing prompt

### Platform-Specific Notes

**iOS:**
- Live Activity must end via ActivityKit API
- "Done" displays in same position as countdown was
- Activity dismisses after 5 seconds automatically
- No lock screen alert or banner on completion

**Android:**
- Notification updates in place (same notification ID)
- "Done. You did nothing." replaces the time
- Notification auto-clears after 5 seconds
- Foreground service stops after cleanup
- No sound or vibration on final notification

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No celebration animation | Success should feel like nothing. |
| **AR-02** | No sound effect | Audio rewards are dopamine hits. |
| **AR-03** | No vibration | Haptic celebration is still celebration. |
| **AR-04** | No "streak" counter or statistics | Tracking progress is gamification. |
| **AR-05** | No "share your achievement" prompt | This isn't an achievement. |
| **AR-06** | No push notification after completion | You already know. Don't remind them. |
| **AR-07** | No "start another?" prompt | If they want to, they will. |
| **AR-08** | No confetti, particles, or visual effects | Obviously not. |
| **AR-09** | No motivational quotes | "Great job doing nothing" is still engagement. |
| **AR-10** | No history log of completed timers | The past is gone. No records. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/hooks/useBoringTimer.ts` | Handle completion state transition |
| Modify | `src/services/ios/liveActivity.ts` | Show "Done" and dismiss |
| Modify | `src/services/android/liveUpdates.ts` | Show completion message and clear |
| Modify | `src/screens/HomeScreen.tsx` | Reset to initial state on completion |

### Dependencies

No additional dependencies required. Uses existing platform service implementations.

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| (none new) | - | - | - |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| timerState | `'idle' \| 'running' \| 'completed'` | useBoringTimer | Transitions to 'completed' then 'idle' |

State transition flow:
1. `running` → timer reaches zero
2. `running` → `completed` (triggers platform completion UI)
3. Wait 5 seconds
4. `completed` → `idle` (triggers platform cleanup and app reset)

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Live Activity fails to end | Log error, continue with cleanup | Activity may linger |
| Notification fails to clear | Log error, user can swipe to dismiss | Minor inconvenience |
| State transition fails | Force reset to 'idle' | App returns to start |
| App killed before completion | Platform service handles on its own | Lock screen shows done |

---

## Implementation Notes

### Estimated Complexity

**[x] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

*Small because this mostly coordinates existing pieces from PRD-01, PRD-02, and PRD-03.*

### Suggested Implementation Order

1. Implement timer zero detection in `useBoringTimer`
2. Add state transition logic (running → completed → idle)
3. Implement iOS Live Activity completion in `liveActivity.ts`
4. Implement Android notification completion in `liveUpdates.ts`
5. Implement app UI reset in `HomeScreen.tsx`
6. Add 5-second delay before cleanup
7. Test full flow on both platforms

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Timer reaches zero | State becomes 'completed' | [ ] |
| iOS: Live Activity at zero | Shows "Done" | [ ] |
| iOS: After 5 seconds | Live Activity dismissed | [ ] |
| Android: Notification at zero | Shows "Done. You did nothing." | [ ] |
| Android: After 5 seconds | Notification cleared | [ ] |
| App open at zero | Returns to duration selection | [ ] |
| No sound plays | Silent completion | [ ] |
| No vibration | No haptic feedback | [ ] |
| Can start new timer after | App ready immediately | [ ] |
| App backgrounded at zero | Lock screen handles it correctly | [ ] |

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
