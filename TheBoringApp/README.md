# The Boring App

A timer app designed to be intentionally boring.

## Philosophy

In a world of infinite scroll, dopamine hits, and engagement-optimized experiences, **The Boring App** offers something radical: nothing.

This app exists for one purpose only—to help you commit to doing nothing for a set period of time. No rewards. No streaks. No achievements. No social features. No animations. No sounds. Just a timer.

### Why Boredom?

Boredom is not a bug; it's a feature of the human experience we've engineered away. When was the last time you sat with nothing to do and didn't reach for your phone?

**The Boring App** doesn't solve boredom—it creates space for it.

### Design Principles

1. **No Gamification**
   - No points, badges, streaks, or rewards
   - No progress tracking beyond the current timer
   - Nothing to "achieve" or "unlock"

2. **No Engagement Optimization**
   - No push notifications asking you to return
   - No social features or sharing
   - No analytics on your "boring time"

3. **No Features**
   - Three timer options: 5, 15, or 30 minutes
   - One button to start
   - That's it

4. **Intentionally Plain**
   - Monochrome design only
   - No animations or visual flourishes
   - Maximum whitespace
   - Nothing to look at

### How It Works

1. Open the app
2. Select a duration (5, 15, or 30 minutes)
3. Press start
4. Do nothing until it ends
5. Close the app

There is no step 6.

### What This App Won't Do

- Track your history
- Give you statistics
- Celebrate your progress
- Send you reminders
- Connect with friends
- Offer premium features
- Show you ads
- Collect your data

### Technical Notes

- iOS: Uses Live Activities to show remaining time on Lock Screen and Dynamic Island
- Android: Uses a simple foreground notification for the countdown
- Both platforms: Timer continues when app is backgrounded

## Project Structure

```
/src
  /screens
    HomeScreen.tsx        # The single screen - timer launcher
  /services
    /ios
      liveActivity.ts     # iOS Live Activity integration
    /android
      liveUpdates.ts      # Android notification service
  /hooks
    useBoringTimer.ts     # Shared timer logic
  /constants
    theme.ts              # Monochrome colors and fonts
    durations.ts          # Timer duration options
```

## Development

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## License

This project is intentionally featureless. Feel free to use it as you wish.

---

*The most productive thing you can do is sometimes nothing at all.*
