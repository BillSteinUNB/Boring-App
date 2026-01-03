# iOS Widget Extension Requirements

> **Note**: Widget Extensions are native iOS code that must be created through Xcode. This document provides the requirements and code templates needed to set up the `BoringWidget` extension.

---

## Overview

The Widget Extension renders the Live Activity UI on the Lock Screen and Dynamic Island. It uses SwiftUI and the ActivityKit framework.

### Required Files

| File | Path | Purpose |
|------|------|---------|
| `BoringWidget.swift` | `ios/BoringWidget/BoringWidget.swift` | Widget extension entry point |
| `BoringWidgetLiveActivity.swift` | `ios/BoringWidget/BoringWidgetLiveActivity.swift` | Live Activity UI definition |
| `BoringWidgetBundle.swift` | `ios/BoringWidget/BoringWidgetBundle.swift` | Widget bundle configuration |
| `Info.plist` | `ios/BoringWidget/Info.plist` | Extension configuration |
| `Assets.xcassets` | `ios/BoringWidget/Assets.xcassets/` | Image assets |

---

## Step 1: Create Widget Extension in Xcode

1. Open `TheBoringApp.xcworkspace` in Xcode
2. File → New → Target...
3. Search for "Widget Extension"
4. Select "Widget Extension" (not App Intents Extension)
5. Configure:
   - Product Name: `BoringWidget`
   - Language: `Swift`
   - Embed in Application: `TheBoringApp`

---

## Step 2: Configure Target Settings

### Build Settings

| Setting | Value |
|---------|-------|
| Deployment Target | iOS 16.1+ |
| SKIP_INSTALL | YES |
| APPLICATION_EXTENSION_API_ONLY | YES |

### General Target Properties

| Property | Value |
|----------|-------|
| Display Name | Boring Timer |
| Bundle Identifier | `com.theboringapp.app.BoringWidget` |

---

## Step 3: Swift Files

### BoringWidgetBundle.swift

```swift
import WidgetKit
import SwiftUI

@main
struct BoringWidgetBundle: WidgetBundle {
    var body: some Widget {
        BoringWidgetLiveActivity()
    }
}
```

### BoringWidget.swift

```swift
import WidgetKit
import SwiftUI
import ActivityKit

struct BoringWidget: Widget {
    let kind: String = "BoringWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                BoringWidgetLiveActivityView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                BoringWidgetLiveActivityView(entry: entry)
            }
        }
        .configurationDisplayName("Boring Timer")
        .description("Shows remaining time on Lock Screen")
        .supportedFamilies([.accessoryCircular, .accessoryRectangular, .accessoryInline])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), endTime: Date().addingTimeInterval(300), configuration: .default)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(date: Date(), endTime: Date().addingTimeInterval(300), configuration: .default)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let currentDate = Date()
        let endTime = currentDate.addingTimeInterval(300)
        
        let entry = SimpleEntry(date: currentDate, endTime: endTime, configuration: .default)
        
        let timeline = Timeline(entries: [entry], policy: .after(endTime))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let endTime: Date
    let configuration: ConfigurationAppIntent
}
```

### BoringWidgetLiveActivity.swift

```swift
import ActivityKit
import WidgetKit
import SwiftUI

struct BoringWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BoringTimerAttributes.self) { context in
            // Lock Screen UI
            VStack {
                Text(context.attributes.mode == .countdown ? "Remaining" : "Elapsed")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                
                TimerView(endTime: context.state.endTime, mode: context.attributes.mode)
                    .font(.system(size: 48, weight: .regular, design: .monospaced))
            }
            .activityBackground(Color(hex: "#0a0a0a"))
            .activitySystemActionForegroundColor(Color(hex: "#888888"))
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandLeadingRegion {
                    Text(formatTime(context.state.endTime - Date()))
                        .font(.system(size: 14, weight: .regular, design: .monospaced))
                        .foregroundStyle(Color(hex: "#888888"))
                }
            } compactLeading: {
                Text(formatTime(context.state.endTime - Date()))
                    .font(.system(size: 14, weight: .regular, design: .monospaced))
            } compactTrailing: {
                EmptyView()
            } maximal: {
                VStack {
                    Text("Boring Timer")
                        .font(.headline)
                    Text(formatTime(context.state.endTime - Date()))
                        .font(.system(size: 36, weight: .regular, design: .monospaced))
                }
            }
            .widgetURL(URL(string: "theboringapp://"))
            .keylineTint(Color(hex: "#444444"))
        }
    }
}

// MARK: - Supporting Types

struct BoringTimerAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var endTime: Date
        var mode: TimerMode
    }
    
    var mode: TimerMode
}

enum TimerMode: String, Codable {
    case countdown
    case countup
}

// MARK: - Timer View

struct TimerView: View {
    let endTime: Date
    let mode: TimerMode
    
    var body: some View {
        Text(remainingTime)
            .monospacedDigit()
    }
    
    private var remainingTime: String {
        let now = Date()
        let interval: TimeInterval
        
        if mode == .countdown {
            interval = max(0, endTime.timeIntervalSince(now))
        } else {
            interval = now.timeIntervalSince(endTime)
        }
        
        return formatTime(interval)
    }
    
    private func formatTime(_ seconds: TimeInterval) -> String {
        let totalSeconds = Int(seconds)
        let minutes = totalSeconds / 60
        let secs = totalSeconds % 60
        
        if minutes >= 60 {
            let hours = minutes / 60
            let remainingMinutes = minutes % 60
            return String(format: "%d:%02d:%02d", hours, remainingMinutes, secs)
        }
        
        return String(format: "%d:%02d", minutes, secs)
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - App Intent Configuration

@available(iOS 17.0, *)
struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Configuration"
    static var description: IntentDescription = "Configure the Boring Timer widget."
}
```

---

## Step 4: Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.widgetkit-extension</string>
    </dict>
</dict>
</plist>
```

---

## Step 5: Assets.xcassets Setup

Create `Assets.xcassets` folder with:

```
Assets.xcassets/
├── AppIcon.appiconset/
│   └── Contents.json
├── AccentColor.colorset/
│   └── Contents.json
└── LiveActivityBackground.colorset/
    └── Contents.json
```

### AccentColor.colorset/Contents.json

```json
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.533",
          "green" : "0.533",
          "red" : "0.533"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
```

### LiveActivityBackground.colorset/Contents.json

```json
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.039",
          "green" : "0.039",
          "red" : "0.039"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
```

---

## Step 6: Update App Target

1. In Xcode, select the main app target
2. Go to "Build Phases"
3. Under "Embed App Extensions", add `BoringWidget`
4. Ensure "Copy Only When Installing" is unchecked

---

## Step 7: Run Expo Prebuild

After creating the Widget Extension in Xcode:

```bash
cd TheBoringApp
npx expo prebuild --platform ios
```

---

## Verification Checklist

- [ ] Widget Extension target created in Xcode
- [ ] Bundle identifier: `com.theboringapp.app.BoringWidget`
- [ ] Minimum deployment target: iOS 16.1+
- [ ] SwiftUI files compile without errors
- [ ] Widget appears in simulator's widget gallery
- [ ] Lock Screen shows timer when Live Activity is active
- [ ] Dynamic Island displays compact timer
- [ ] Timer updates in real-time
- [ ] Timer completion state displays correctly

---

## Troubleshooting

### "Widget extension not embedding"

1. Check app target's "General" tab → "Frameworks, Libraries, and Embedded Content"
2. Ensure `BoringWidget` is listed with "Embed & Sign"

### "Live Activity not appearing"

1. Verify `NSSupportsLiveActivities` is true in `Info.plist`
2. Ensure physical device (Live Activities don't work in Simulator)
3. Check device's Settings → Face ID/Touch ID → Live Activities

### "Widget shows 'Loading...'"

1. Ensure `Provider` returns valid `TimelineEntry`
2. Check for Swift compilation errors in widget extension
3. Clean build folder: Product → Clean Build Folder

---

## Weekly Quota Widget Integration

### Overview

The Widget Extension can display the "Weekly Debt" on the iOS Home Screen as a static, gray widget. This provides users with at-a-glance information about their weekly boring time quota without opening the app.

### Weekly Debt Widget Specifications

| Aspect | Specification |
|--------|---------------|
| **Widget Type** | Static, non-interactive |
| **Display Format** | Gray monochrome, monospace numbers |
| **Data Shown** | Weekly debt in minutes (e.g., "-120m" for 2 hours debt) |
| **Update Frequency** | Daily or when app is opened |
| **Widget Size** | Accessory Rectangular (recommended) |
| **Color Scheme** | Matches app monochrome: `#0a0a0a` background, `#888888` text |

### SwiftUI Implementation for Weekly Debt Widget

Add the following code to `BoringWidget.swift` to support the Weekly Debt display:

```swift
import WidgetKit
import SwiftUI
import ActivityKit

// MARK: - Weekly Debt Widget Configuration

struct WeeklyDebtWidget: Widget {
    let kind: String = "WeeklyDebtWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeeklyDebtProvider()) { entry in
            WeeklyDebtWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Weekly Debt")
        .description("Shows your remaining boring time quota for the week")
        .supportedFamilies([.accessoryRectangular, .accessoryInline])
    }
}

// MARK: - Timeline Provider

struct WeeklyDebtProvider: TimelineProvider {
    func placeholder(in context: Context) -> WeeklyDebtEntry {
        WeeklyDebtEntry(
            date: Date(),
            debtMinutes: -120, // Example: 2 hours debt
            weeklyGoalMinutes: 420
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (WeeklyDebtEntry) -> Void) {
        let entry = WeeklyDebtEntry(
            date: Date(),
            debtMinutes: -60, // Example data
            weeklyGoalMinutes: 420
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WeeklyDebtEntry>) -> Void) {
        let currentDate = Date()
        
        // Create entry with debt from app shared data
        // In production, this would read from App Groups shared UserDefaults
        let entry = WeeklyDebtEntry(
            date: currentDate,
            debtMinutes: -90, // Placeholder - would come from app
            weeklyGoalMinutes: 420
        )
        
        // Update daily
        let nextUpdate = Calendar.current.date(byAdding: .day, value: 1, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

// MARK: - Timeline Entry

struct WeeklyDebtEntry: TimelineEntry {
    let date: Date
    let debtMinutes: Int // Negative = surplus, Positive = debt
    let weeklyGoalMinutes: Int
}

// MARK: - Widget View

struct WeeklyDebtWidgetView: View {
    var entry: WeeklyDebtEntry
    
    var body: some View {
        HStack(spacing: 8) {
            // Debt indicator
            Text(formatDebt(debtMinutes: entry.debtMinutes))
                .font(.system(size: 16, weight: .regular, design: .monospaced))
                .foregroundStyle(Color(hex: "#888888"))
            
            // Label
            Text("weekly debt")
                .font(.caption2)
                .foregroundStyle(Color(hex: "#444444"))
        }
        .padding(8)
        .background(Color(hex: "#0a0a0a"))
    }
    
    private func formatDebt(debtMinutes: Int) -> String {
        if debtMinutes > 0 {
            return "-\(debtMinutes)m"
        } else if debtMinutes < 0 {
            let surplus = abs(debtMinutes)
            return "+\(surplus)m"
        } else {
            return "0m"
        }
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
```

### Updating BoringWidgetBundle

Add the WeeklyDebtWidget to the widget bundle:

```swift
@main
struct BoringWidgetBundle: WidgetBundle {
    var body: some Widget {
        BoringWidgetLiveActivity()
        WeeklyDebtWidget() // Add this line
    }
}
```

### App Groups Configuration (for sharing data)

To share Weekly Debt data between the main app and widget extension:

#### 1. Add App Groups capability in Xcode

1. Select both main app and widget extension targets
2. Go to "Signing & Capabilities"
3. Click "+ Capability"
4. Select "App Groups"
5. Create group: `group.com.theboringapp.app`

#### 2. Update Info.plist for App Group

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSUserActivityTypes</key>
    <array>
        <string>StartTimer</string>
    </array>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.widgetkit-extension</string>
    </dict>
</dict>
</plist>
```

#### 3. React Native code to share debt data

```typescript
import { useWeeklyQuota } from './hooks/useWeeklyQuota';

// When timer starts or quota changes, save to App Groups
const shareDebtWithWidget = async (debtMinutes: number) => {
  try {
    // Using react-native-shared-group-preferences or similar
    await SharedGroupPreferences.setItem('weeklyDebt', {
      debtMinutes,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Failed to share debt with widget:', error);
  }
};
```

### Dynamic Island with Weekly Debt

Update `BoringWidgetLiveActivity.swift` to show weekly debt in the Dynamic Island:

```swift
// In the DynamicIsland closure, update the maximal view:
.maximal: {
    VStack(spacing: 4) {
        Text("Boring Timer")
            .font(.headline)
            .foregroundStyle(Color(hex: "#888888"))
        
        Text(formatTime(context.state.endTime - Date()))
            .font(.system(size: 36, weight: .regular, design: .monospaced))
            .foregroundStyle(Color(hex: "#888888"))
        
        // Weekly Debt indicator (only show if debt exists)
        if let debtMinutes = context.attributes.weeklyDebtMinutes, debtMinutes > 0 {
            HStack(spacing: 4) {
                Text("Weekly Debt:")
                    .font(.caption)
                    .foregroundStyle(Color(hex: "#444444"))
                Text("-\(debtMinutes)m")
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(hex: "#888888"))
            }
            .padding(.top, 4)
        }
    }
    .padding(16)
    .activityBackground(Color(hex: "#0a0a0a"))
}
```

### Widget Bundle Update

Update `BoringWidgetBundle.swift` to include both widgets:

```swift
import WidgetKit
import SwiftUI

@main
struct BoringWidgetBundle: WidgetBundle {
    var body: some Widget {
        BoringWidgetLiveActivity()
        WeeklyDebtWidget()
    }
}
```

### Weekly Debt Display Examples

| Scenario | Display | Example |
|----------|---------|---------|
| **No debt** | 0m | "0m" |
| **Small debt** | -Xm | "-30m" (30 minutes debt) |
| **Large debt** | -XhYm | "-2h30m" (2.5 hours debt) |
| **Surplus** | +Xm | "+45m" (45 minutes ahead of goal) |

### Data Flow Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  useBoringTimer │────▶│  useWeeklyQuota  │────▶│  App Groups     │
│     (React)     │     │      (Hook)      │     │  (Shared Data)  │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Widget Extension│◀────│  WeeklyDebtWidget│◀────│  TimelineProvider│
│   (SwiftUI)     │     │    (iOS Home)    │     │  (Daily Update) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Testing Checklist

- [ ] Weekly Debt widget appears in widget gallery
- [ ] Widget displays correct debt/surplus value
- [ ] Debt updates when app is opened
- [ ] Dynamic Island shows debt when timer is running
- [ ] Color scheme matches app monochrome design
- [ ] Font is monospaced as required

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No real-time updates | Widget may show stale data | App opens refresh widget data |
| No user interaction | Widget is read-only | Open app to change settings |
| App Group setup required | Additional Xcode configuration | Document clearly in setup guide |
