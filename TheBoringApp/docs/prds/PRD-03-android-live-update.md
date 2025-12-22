# PRD-03: Android Live Update

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-03 |
| **Title** | Android Live Update |
| **Status** | Draft |
| **Author** | BillSteinUNB |
| **Created** | 2025-12-22 |
| **Updated** | 2025-12-22 |
| **Related PRDs** | PRD-01 (triggers this), PRD-04 (completion state) |

---

## Overview

### Problem Statement
Android users need the same lock screen countdown functionality as iOS users, using Android's notification system.

### User Story
As a user, I want to see my remaining time on the Android lock screen so that I can glance at it without unlocking my phone.

### Success Metric
Lock screen notification displays countdown timer. Timer updates. Timer reaches zero and shows completion state.

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: Start foreground notification when timer begins (triggered by PRD-01)
- [ ] **FR-02**: Display remaining time in MM:SS format
- [ ] **FR-03**: Update countdown every 60 seconds (battery optimization)
- [ ] **FR-04**: For API 36.1+: Use `expo-live-updates` for rich lock screen display
- [ ] **FR-05**: For older APIs: Use standard ongoing notification
- [ ] **FR-06**: Notification appears on lock screen with high priority
- [ ] **FR-07**: Handle timer completion (transition to PRD-04 completion state)
- [ ] **FR-08**: Auto-dismiss notification after completion message shown
- [ ] **FR-09**: Run as foreground service to prevent system killing timer

### UI/UX Requirements

All UI must adhere to the monochrome palette:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text (time) | Gray | `#888888` |
| Secondary text | Dark gray | `#444444` |

**No other colors are permitted.**

Typography:
- Font: System default (Android enforces notification fonts)
- Time display: notification content text size
- No labels beyond what's required for notification

Specific UI requirements:
- [ ] **UI-01**: Notification title: empty or minimal (e.g., just the time)
- [ ] **UI-02**: Notification content: "MM:SS" only
- [ ] **UI-03**: No large icon
- [ ] **UI-04**: Small icon: minimal, monochrome, or system default
- [ ] **UI-05**: No action buttons on notification
- [ ] **UI-06**: No progress bar in notification
- [ ] **UI-07**: No sound on notification updates
- [ ] **UI-08**: No vibration on notification updates
- [ ] **UI-09**: Match iOS aesthetic as closely as Android allows

### Platform-Specific Notes

**iOS:**
- Not applicable (see PRD-02)

**Android:**
- Requires notification channel setup
- Foreground service required for reliable timer continuation
- API 36.1+ (Android 16+): Use Live Updates API via `expo-live-updates`
- API 26-36: Use standard foreground notification
- API < 26: Basic notification (no channel required)
- Battery optimization: update every 60 seconds, not every second
- When user views lock screen, consider updating to current time

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | No progress bar in notification | Visual progress is engaging. Just show time. |
| **AR-02** | No action buttons (pause, cancel) | No escape. Commitment is the point. |
| **AR-03** | No notification sound | Sounds are stimulating. Silence only. |
| **AR-04** | No vibration on updates | Haptics draw attention. Stay invisible. |
| **AR-05** | No custom notification icon with branding | Minimal system icon only. |
| **AR-06** | No expanded notification view with details | Nothing more to see. |
| **AR-07** | No heads-up notification | Don't interrupt. Be passive. |
| **AR-08** | No notification LED color | No visual beacon. |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/services/android/liveUpdates.ts` | Implement notification logic |
| Create | `android/app/src/main/java/.../TimerService.java` | Foreground service for timer |
| Modify | `android/app/src/main/AndroidManifest.xml` | Add service and permissions |
| Modify | `app.json` | Configure Android notification settings |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| expo-notifications | ^0.x.x | Notification display | Yes (included in Expo) |
| expo-live-updates | ^1.x.x | API 36.1+ Live Updates | Yes |
| expo-task-manager | ^11.x.x | Background task handling | Yes |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| notificationId | `string \| null` | liveUpdates service | `null` |
| serviceRunning | `boolean` | liveUpdates service | `false` |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Notification permission denied | Log error, timer runs without notification | No lock screen timer |
| Foreground service fails to start | Fall back to basic notification | May lose timer on app kill |
| API < 26 | Use basic notification without channel | Slightly different appearance |
| expo-live-updates unavailable | Fall back to standard notification | Works, less polished |

---

## Implementation Notes

### Estimated Complexity

**[ ] Small** (< 1 day) | **[x] Medium** (1-3 days) | **[ ] Large** (3+ days)

*Medium complexity due to foreground service setup and API version handling.*

### Suggested Implementation Order

1. Set up notification channel in `liveUpdates.ts`
2. Implement basic notification display
3. Create foreground service for timer reliability
4. Add notification update logic (every 60 seconds)
5. Implement API 36.1+ Live Updates path
6. Handle completion state (coordinate with PRD-04)
7. Test on multiple Android versions

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Start timer | Notification appears | [ ] |
| Lock phone | Notification visible on lock screen | [ ] |
| Wait 60 seconds | Time updates in notification | [ ] |
| Timer completes | Shows "Done" message (PRD-04) | [ ] |
| Force quit app | Timer continues via foreground service | [ ] |
| Notification tap | Does nothing (no action) | [ ] |
| Swipe notification | Cannot dismiss (ongoing) | [ ] |
| No notification sound | Silent | [ ] |
| API 26 device | Works with basic notification | [ ] |
| API 36+ device | Works with Live Updates | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | Is expo-live-updates available and stable for API 36.1? | Need to verify package exists | - |
| Q2 | What's the minimum acceptable update frequency for UX? | 60 seconds proposed, may need testing | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | BillSteinUNB | Initial draft |
