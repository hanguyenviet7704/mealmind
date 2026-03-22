# Mobile Interactions — New Screens

Bổ sung interaction specs cho mobile (React Native) cho các màn mới.

---

## General Mobile Interaction Patterns

### Gestures
| Gesture | Library | Usage |
|---------|---------|-------|
| Swipe left/right | `react-native-gesture-handler` | Step nav, delete, dismiss |
| Long press | Native `Pressable` | Drag & drop items |
| Pull to refresh | `RefreshControl` | Lists |
| Shake | `react-native-shake` | Surprise trigger |
| Pinch zoom | `react-native-gesture-handler` | Recipe images |

### Haptics
| Action | Type | Library |
|--------|------|---------|
| Star rating tap | `impactLight` | `expo-haptics` |
| Timer alarm | `notificationError` | `expo-haptics` |
| Toggle switch | `impactLight` | `expo-haptics` |
| Check shopping item | `impactMedium` | `expo-haptics` |
| Delete swipe complete | `notificationWarning` | `expo-haptics` |
| Surprise reveal | `impactHeavy` | `expo-haptics` |

### Transitions
| Transition | Type | Duration |
|------------|------|----------|
| Push screen | `slide_from_right` | 300ms |
| Modal (bottom sheet) | `slide_from_bottom` | 250ms |
| Tab switch | `fade` | 150ms |
| Full screen modal | `full_screen_modal` | 300ms |

---

## S16 — Cooking Mode (Mobile)

### Gestures
| Gesture | Action |
|---------|--------|
| Swipe left | Next step |
| Swipe right | Previous step |
| Tap timer area | Start/Pause |
| Shake device | Optional: next step (accessibility) |
| Double tap timer | Reset timer |

### Notifications
```
// Local notification when timer completes
Notifications.scheduleNotificationAsync({
  content: {
    title: "⏱ Timer hoàn thành!",
    body: "Bước 3: Cho thịt vào chảo đã xong",
    sound: true,
    vibrate: [0, 250, 250, 250],
  },
  trigger: { seconds: remainingSeconds },
});
```

### Screen Wake
```
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
// Activate on mount, deactivate on unmount
```

---

## S12 — Surprise (Mobile)

### Shake to Surprise
```
import RNShake from 'react-native-shake';

RNShake.addListener(() => {
  if (canSurprise) triggerSurprise();
});
```

### Card Reveal Animation
```
// Using react-native-reanimated
withSequence(
  withTiming({ rotateY: '180deg' }, { duration: 500 }),
  withSpring({ scale: 1.05 }),
  withTiming({ scale: 1 }, { duration: 200 }),
)
```

---

## S24 — Shopping List (Mobile)

### Swipe Actions
```
// Using react-native-gesture-handler Swipeable
<Swipeable
  renderRightActions={() => <DeleteAction />}
  renderLeftActions={() => <CheckAction />}
  onSwipeableOpen={(direction) => {
    if (direction === 'left') toggleCheck(item);
    if (direction === 'right') removeItem(item);
  }}
/>
```

### Share
```
import { Share } from 'react-native';

Share.share({
  message: formatShoppingListAsText(items),
  title: `🛒 Danh sách đi chợ tuần ${weekLabel}`,
});
```

---

## S42 — Rate Recipe (Mobile)

### Bottom Sheet
```
// Using @gorhom/bottom-sheet
<BottomSheet
  snapPoints={['50%']}
  enableDynamicSizing
  backdropComponent={BottomSheetBackdrop}
>
  <RateContent />
</BottomSheet>
```

### Star Animation
```
// Each star: withSpring scale on press
const starScale = useSharedValue(1);

const onPress = (index) => {
  starScale.value = withSequence(
    withSpring(1.3),
    withSpring(1),
  );
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setRating(index);
};
```

---

## S39 — Notification Center (Mobile)

### Badge on Tab
```
// In BottomTabBar
<Tab
  icon={User}
  label="Cá nhân"
  badge={unreadCount > 0 ? unreadCount : undefined}
/>
```

### Swipe to Delete
```
<Swipeable
  renderRightActions={() => (
    <TouchableOpacity onPress={deleteNotification}>
      <View style={{ backgroundColor: 'red', padding: 20 }}>
        <Trash2 color="white" />
      </View>
    </TouchableOpacity>
  )}
/>
```

---

## S37 — Upgrade Pro (Mobile)

### In-App Purchase
```
// iOS
import * as InAppPurchases from 'expo-in-app-purchases';

// Android
import { useIAP } from 'react-native-iap';

// Products
const PRODUCTS = {
  ios: ['com.mealmind.pro.monthly', 'com.mealmind.pro.yearly'],
  android: ['mealmind_pro_monthly', 'mealmind_pro_yearly'],
};
```

### Restore Purchases
```
<Button
  variant="ghost"
  label="Khôi phục giao dịch"
  onPress={restorePurchases}
/>
```

---

## S36 — Delete Account (Mobile)

### Biometric Confirmation
```
import * as LocalAuthentication from 'expo-local-authentication';

const authenticateUser = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Xác nhận xóa tài khoản',
    cancelLabel: 'Hủy',
  });
  return result.success;
};
```
