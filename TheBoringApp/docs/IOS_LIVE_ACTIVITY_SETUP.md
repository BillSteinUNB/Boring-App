# iOS Live Activity Setup

## Configuration Files

### app.json

```json
{
  "ios": {
    "bundleIdentifier": "com.theboringapp.app",
    "infoPlist": {
      "NSSupportsLiveActivities": true  // Required: Enables Live Activities capability
    }
  },
  "plugins": [
    ["expo-live-activity", {
      "widgetName": "BoringWidget",           // Name of the widget extension target
      "widgetDisplayName": "Boring Timer"     // Display name in iOS settings
    }]
  ]
}
```

### eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,    // Enables dev client for debugging
      "distribution": "internal",    // For TestFlight/internal testing
      "ios": {
        "simulator": false          // Live Activities don't work in simulator
      }
    }
  }
}
```

## Manual Xcode Steps After Prebuild

After running `npm run prebuild` or `expo prebuild`, you may need to:

### 1. Verify Widget Extension Target

Open `ios/TheBoringApp.xcworkspace` in Xcode and check:

- [ ] Widget Extension target exists (BoringWidget)
- [ ] Target has correct bundle identifier: `com.theboringapp.app.BoringWidget`
- [ ] Target deployment target is iOS 16.2+

### 2. Configure App Groups (if sharing data between app and widget)

In Xcode, for both main app and widget targets:

1. Select target → Signing & Capabilities
2. Click "+ Capability"
3. Add "App Groups"
4. Create group: `group.com.theboringapp.app`

### 3. Verify Entitlements

Check `ios/TheBoringApp/TheBoringApp.entitlements`:

```xml
<key>com.apple.developer.live-activity</key>
<true/>
```

### 4. Widget Extension Files

The expo-live-activity plugin should generate:

```
ios/BoringWidget/
├── BoringWidget.swift           # Widget entry point
├── BoringWidgetLiveActivity.swift   # Live Activity UI
├── BoringWidgetBundle.swift     # Widget bundle
└── Info.plist                   # Widget config
```

If not generated, you'll need to create these manually.

### 5. Customize Live Activity UI

Edit `BoringWidgetLiveActivity.swift` to match our minimal design:

```swift
// Target appearance:
// - Black background (#0a0a0a)
// - Gray text (#888888)
// - Monospace font
// - Just the countdown, nothing else
```

## Build Commands

```bash
# Generate native projects
npm run prebuild

# Clean rebuild (if having issues)
npm run prebuild:clean

# Build for physical device
npm run ios:build

# Start dev client
npm run ios:dev
```

## Testing

Live Activities CANNOT be tested in the iOS Simulator. You must:

1. Build with `npm run ios:build`
2. Install on physical device (iOS 16.2+)
3. Start timer in app
4. Lock phone to see Live Activity on lock screen

## Troubleshooting

### Live Activity doesn't appear

- Verify device is iOS 16.2+
- Check Settings → [App Name] → Live Activities is enabled
- Check console for "iOS Live Activity: Failed to start" warnings

### Widget extension build fails

- Verify bundle identifiers match
- Check signing certificates are valid for both targets
- Ensure deployment target is 16.2+

### Data not updating

- Verify App Groups are configured correctly
- Check that endTime is being passed correctly to widget
