# PRD-05: Visual Timer Display

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-05 |
| **Title** | Visual Timer Display |
| **Status** | Draft |
| **Author** | - |
| **Created** | 2024-12-24 |
| **Updated** | 2024-12-24 |
| **Related PRDs** | PRD-01 (timer-launcher) |

---

## Overview

### Problem Statement
When the timer is running, the user sees only "Put your phone down." There's no indication of time remaining, which feels broken rather than intentional.

### User Story
As a user, I want to glance at remaining time before I put my phone down.

### Success Metric
Timer displays countdown in correct format and updates every second until completion.

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: Display countdown in MM:SS format (or H:MM:SS if over 1 hour)
- [ ] **FR-02**: Timer text replaces "Put your phone down." message
- [ ] **FR-03**: Updates every second

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
- [ ] **UI-01**: Timer font is monospace, large but not dominant
- [ ] **UI-02**: Timer color uses theme.primaryText (#888888)
- [ ] **UI-03**: Below timer: small text "put it down" in secondaryText color

**UI Layout (Running State):**
```
         [blank space]
         
            47:23
         
          put it down
          
         [blank space]
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
| **AR-01** | No circular progress indicator | Visual stimulation undermines boring philosophy |
| **AR-02** | No percentage complete | Gamification element we explicitly avoid |
| **AR-03** | No pulsing or animation | Animations draw attention and engagement |
| **AR-04** | No color changes as time runs low | Urgency cues create stress and engagement |
| **AR-05** | No sound at intervals | Audio feedback is stimulating |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/hooks/useBoringTimer.ts` | Expose formatted timeRemaining |
| Modify | `src/screens/HomeScreen.tsx` | Display timer countdown |

### Dependencies

No new dependencies required.

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| timeRemaining | number | useBoringTimer | 0 |
| formattedTime | string | useBoringTimer | "00:00" |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| Timer drift | Use setInterval at 1000ms for display updates | None - display updates independently |

---

## Implementation Notes

### Estimated Complexity

**[X] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. Update useBoringTimer to expose formatted timeRemaining
2. Use setInterval at 1000ms for display updates
3. Update HomeScreen to display timer and "put it down" text
4. Don't conflate display updates with completion checks

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| Start timer under 1 hour | Displays MM:SS format | [ ] |
| Start timer over 1 hour | Displays H:MM:SS format | [ ] |
| Timer updates | Updates every second | [ ] |
| Timer reaches zero | Triggers completion flow | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| - | No open questions | - | - |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-12-24 | - | Initial draft |
