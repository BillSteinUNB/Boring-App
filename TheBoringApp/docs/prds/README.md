# Product Requirements Documents

This folder contains the PRDs (Product Requirements Documents) for TheBoringApp.

---

## The Rule

> **No implementation without an approved PRD.**

Every feature, no matter how small, must be documented before code is written. This isn't bureaucracy—it's a forcing function to ask "should this exist?" before "how do we build it?"

---

## PRD Index

| PRD | Title | Status | Description |
|-----|-------|--------|-------------|
| [PRD-00](./PRD-00-TEMPLATE.md) | Template | Reference | Template for all new PRDs |
| [PRD-01](./PRD-01-timer-launcher.md) | Timer Launcher | Draft | Home screen with duration buttons |
| [PRD-02](./PRD-02-ios-live-activity.md) | iOS Live Activity | Draft | iOS lock screen timer display |
| [PRD-03](./PRD-03-android-live-update.md) | Android Live Update | Draft | Android lock screen timer display |
| [PRD-04](./PRD-04-timer-completion.md) | Timer Completion | Draft | End state and notification handling |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **Draft** | Initial writeup, open for feedback |
| **In Review** | Being actively discussed and refined |
| **Approved** | Ready for implementation |
| **Implemented** | Code complete and merged |

---

## How to Use This System

### Creating a New PRD

1. Copy `PRD-00-TEMPLATE.md`
2. Rename to `PRD-XX-feature-name.md` (use next available number)
3. Fill in all sections completely
4. **Especially complete the Anti-Requirements section**
5. Add to the index in this README
6. Submit for review

### Reviewing a PRD

Ask these questions:
- Does this feature need to exist?
- Does it make the app more engaging? (If yes, reject it)
- Are the anti-requirements comprehensive enough?
- Is the scope minimal?

### Approving a PRD

- All Open Questions must be resolved
- Anti-Requirements must have at least 5 items
- Implementation complexity must be assessed
- Status changed to "Approved"

---

## Philosophy Reminder

TheBoringApp exists to help people do nothing. Every PRD should be evaluated against this philosophy:

### What We Believe

- **Boredom is valuable.** It's not a problem to solve.
- **Less is more.** Every feature we don't build is a victory.
- **Constraints are the point.** Users don't need options.
- **Engagement is the enemy.** If it's interesting, it's wrong.

### What We Build

- A timer with three options
- A lock screen display
- Nothing else

### What We Never Build

- Analytics or tracking
- Social features
- Achievements or rewards
- Settings or preferences
- Custom anything
- Sound or haptics
- Animations
- Color

### The Test

Before approving any PRD, ask:

> "Would a user be disappointed that this feature exists?"

If no, the feature might be too interesting. Reconsider.

---

## Color Palette (Reference)

All PRDs must specify UI using only these colors:

| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | `#0a0a0a` |
| Primary text | Gray | `#888888` |
| Secondary text | Dark gray | `#444444` |
| Accent/Buttons | Medium gray | `#666666` |

**No other colors are permitted in any PRD.**

---

## Typography (Reference)

- **Font**: System monospace only
- **Styles**: No bold, no italic
- **Sizes**: Minimal hierarchy, only where functionally necessary

---

*Remember: The best feature is the one we didn't build.*
