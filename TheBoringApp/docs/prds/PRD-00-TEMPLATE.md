# PRD-[XX]: [Feature Title]

> **Philosophy Reminder**: TheBoringApp is intentionally unstimulating. Every feature should feel like it's barely there. If you're unsure whether to add something, don't. The app succeeds by doing less, not more.

---

## Header

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-XX |
| **Title** | [Feature Name] |
| **Status** | Draft / In Review / Approved / Implemented |
| **Author** | [Name] |
| **Created** | YYYY-MM-DD |
| **Updated** | YYYY-MM-DD |
| **Related PRDs** | PRD-XX (dependency), PRD-YY (related) |

---

## Overview

### Problem Statement
[1-2 sentences maximum. What problem does this solve? Why does it need to exist?]

### User Story
As a user, I want to [action] so that [outcome].

### Success Metric
[Binary success criteria only. Not analytics-based. Example: "Timer counts down and reaches zero" not "Users complete 80% of timers"]

---

## Detailed Requirements

### Functional Requirements

- [ ] **FR-01**: [Requirement description]
- [ ] **FR-02**: [Requirement description]
- [ ] **FR-03**: [Requirement description]

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
- [ ] **UI-01**: [Requirement description]
- [ ] **UI-02**: [Requirement description]

### Platform-Specific Notes

**iOS:**
- [Any iOS-specific considerations]

**Android:**
- [Any Android-specific considerations]

---

## Anti-Requirements

> **This section is critical.** These constraints keep the app boring. Each anti-requirement is a feature we deliberately refuse to build.

| ID | Anti-Requirement | Rationale |
|----|------------------|-----------|
| **AR-01** | [What we will NOT do] | [Why this keeps the app boring] |
| **AR-02** | [What we will NOT do] | [Why this keeps the app boring] |
| **AR-03** | [What we will NOT do] | [Why this keeps the app boring] |
| **AR-04** | [What we will NOT do] | [Why this keeps the app boring] |
| **AR-05** | [What we will NOT do] | [Why this keeps the app boring] |

---

## Technical Specification

### Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/path/to/file.ts` | [Description] |
| Modify | `src/path/to/existing.ts` | [What changes] |

### Dependencies

| Package | Version | Purpose | Native Module Required? |
|---------|---------|---------|------------------------|
| [package-name] | ^X.Y.Z | [Why needed] | Yes/No |

### State Management

| State | Type | Location | Initial Value |
|-------|------|----------|---------------|
| [stateName] | [type] | [hook/component] | [value] |

### Error Handling

| Error Scenario | Handling Strategy | User Impact |
|----------------|-------------------|-------------|
| [What can fail] | [How to handle silently] | [What user sees, if anything] |

---

## Implementation Notes

### Estimated Complexity

**[ ] Small** (< 1 day) | **[ ] Medium** (1-3 days) | **[ ] Large** (3+ days)

### Suggested Implementation Order

1. [First step]
2. [Second step]
3. [Third step]

### Testing Criteria

| Test | Expected Result | Pass/Fail |
|------|-----------------|-----------|
| [What to test] | [Expected behavior] | [ ] |

---

## Open Questions

> **All questions must be resolved before implementation begins.**

| ID | Question | Resolution | Resolved By |
|----|----------|------------|-------------|
| Q1 | [Unresolved question] | [Answer when resolved] | [Date] |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | [Name] | Initial draft |
