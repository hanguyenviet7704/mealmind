# Interaction Map: Profile Flow (S21-S25)

---

## S21: Profile

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchProfile()` | `GET /auth/me` + `GET /taste-profiles` + `GET /users/{id}/dietary` + `GET /nutrition/goals` | Render full profile | Error state | Skeleton sections |
| 2 | ProfileSwitcher — profile chip | onClick | `setActiveProfile(profileId)` | `PATCH /family-profiles/active { profileId }` | Update active indicator + reload profile sections for selected profile | Toast error | Chip loading |
| 3 | ProfileSwitcher — "Cả gia đình" | onClick | `setActiveProfile(null)` | `PATCH /family-profiles/active { profileId: null }` | Show merged profile view | Toast error | — |
| 4 | Link "Quản lý →" (family) | onClick | `navigate('/profile/family')` | — | → S25 | — | — |
| 5 | Card "Khẩu vị" → [→] | onClick | `navigate('/profile/edit')` | — | → S22 | — | — |
| 6 | Card "Chế độ ăn" → [→] | onClick | `navigate('/profile/dietary')` | — | → S23 | — | — |
| 7 | Card "Mục tiêu dinh dưỡng" → [→] | onClick | `navigate('/profile/nutrition')` | — | → S24 | — | — |
| 8 | Card "Món yêu thích" → [→] | onClick | `navigate('/bookmarks')` | — | → S16 | — | — |
| 9 | Card "Nâng cấp Pro" → [→] | onClick | `openUpgradeModal()` | — | Show Pro upgrade modal/page | — | — |
| 10 | Button "🚪 Đăng xuất" | onClick | `openLogoutDialog()` | — | Show logout dialog | — | — |
| 11 | Logout dialog — "Thiết bị này" | onChange | `setLogoutMode('current')` | — | Select radio | — | — |
| 12 | Logout dialog — "Tất cả" | onChange | `setLogoutMode('all')` | — | Select radio | — | — |
| 13 | Logout dialog — "Đăng xuất" | onClick | `handleLogout()` | `POST /auth/logout { allDevices: logoutMode === 'all' }` | Clear tokens (Zustand) → navigate `/login` (S01) | Force clear tokens + navigate anyway | Button spinner |
| 14 | Logout dialog — "Hủy" | onClick | `closeDialog()` | — | Close | — | — |

---

## S22: Profile Edit (Taste Profile)

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchTasteProfile()` | `GET /taste-profiles/{activeProfileId}` | Pre-fill all fields | Error state | Skeleton form |
| 2 | Button [← Back] | onClick | `handleBack()` | — | If dirty: show "Lưu thay đổi?" dialog. Else: go back | — | — |
| 3 | Chip "Miền Bắc" | onClick | `toggleRegion('north')` | — (local state) | Toggle chip | — | — |
| 4 | Chip "Miền Trung" | onClick | `toggleRegion('central')` | — | Toggle | — | — |
| 5 | Chip "Miền Nam" | onClick | `toggleRegion('south')` | — | Toggle | — | — |
| 6 | Chip "Quốc tế" | onClick | `toggleRegion('international')` | — | Toggle | — | — |
| 7 | Slider "Cay" | onChange | `setSpiceLevel(value)` | — | Update value | — | — |
| 8 | Slider "Ngọt" | onChange | `setSweetLevel(value)` | — | Update value | — | — |
| 9 | Slider "Mặn" | onChange | `setSaltLevel(value)` | — | Update value | — | — |
| 10 | Select "Chế độ ăn" | onChange | `setDietType(value)` | — | Update value | — | — |
| 11 | Cook time chips | onClick | `setMaxCookTime(value)` | — | Select chip | — | — |
| 12 | Button "−" family size | onClick | `setFamilySize(n-1)` | — | Update number (min 1) | — | — |
| 13 | Button "+" family size | onClick | `setFamilySize(n+1)` | — | Update number (max 20) | — | — |
| 14 | Button "Lưu thay đổi" | onClick | `handleSave()` | `PATCH /taste-profiles/{profileId} { regions, spiceLevel, sweetLevel, saltLevel, dietType, maxCookTime, familySize }` | Toast "Đã cập nhật khẩu vị!" + invalidate `['suggestions']` + go back to S21 | Toast error | Button spinner |
| 15 | Header [Lưu] | onClick | Same as #14 | Same | Same | Same | Same |

### Unsaved Changes Guard
```typescript
const isDirty = useMemo(() => {
  return JSON.stringify(formData) !== JSON.stringify(originalData)
}, [formData, originalData])

// On back press with dirty state:
// Dialog: "Bạn có thay đổi chưa lưu. Lưu trước khi thoát?"
// [Bỏ qua] [Lưu]
```

### Post-Save Invalidation
```typescript
queryClient.invalidateQueries({ queryKey: ['suggestions'] })
queryClient.invalidateQueries({ queryKey: ['meal-plans'] })
// Gợi ý tiếp theo sẽ reflect thay đổi khẩu vị
```

---

## S23: Dietary Settings

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchDietary()` | `GET /users/{id}/dietary?profileId={active}` | Pre-fill allergens + blacklist + religious | Error state | Skeleton |
| 2 | Dropdown "Profile" | onChange | `switchProfile(profileId)` | `GET /users/{id}/dietary?profileId={selected}` | Reload dietary data for selected profile | — | Skeleton |
| 3 | Chip allergen (each) | onClick | `toggleAllergen(type)` | — (local state) | Toggle chip | — | — |
| 4 | Input "+ Thêm..." | onChange | `setBlacklistQuery(value)` | `GET /ingredients?q={value}&limit=5` (debounce 300ms) | Show autocomplete dropdown | — | — |
| 5 | Autocomplete item | onClick | `addToBlacklist(ingredientId, name)` | — (local state) | Add chip to blacklist | — | — |
| 6 | Blacklist chip [✕] | onClick | `removeFromBlacklist(id)` | — (local state) | Remove chip | — | — |
| 7 | Medical condition checkboxes | onClick | — (disabled, tooltip) | — | Show tooltip "Sắp ra mắt trong Phase 2" | — | — |
| 8 | Religious diet radio | onChange | `setReligiousDiet(value)` | — (local state) | Select radio | — | — |
| 9 | Button "Lưu thay đổi" | onClick | `handleSave()` | `PUT /users/{id}/dietary { profileId, allergens, blacklistedIngredients, customBlacklist, religiousDiet }` | Toast "Đã cập nhật! Mọi gợi ý sẽ áp dụng filter mới." + invalidate `['suggestions']`, `['recipes']`, `['meal-plans']` + go back S21 | Toast error | Button spinner |

### Warning Banner
```
⚠ "Thay đổi sẽ áp dụng ngay lập tức cho tất cả gợi ý, tìm kiếm, và thực đơn."
Display: always visible at bottom, color=warning (yellow bg)
```

---

## S24: Nutrition Goals

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchGoals()` | `GET /nutrition/goals?profileId={active}` | Pre-fill preset + values | Error state | Skeleton |
| 2 | Dropdown "Profile" | onChange | `switchProfile(profileId)` | `GET /nutrition/goals?profileId={selected}` | Reload goals for profile | — | Skeleton |
| 3 | Radio "Duy trì" | onClick | `setPreset('maintain')` | — | Auto-fill: 2000 kcal, 50g P, 275g C, 65g F, 25g Fiber + disable inputs | — | — |
| 4 | Radio "Tăng cơ" | onClick | `setPreset('muscle_gain')` | — | Auto-fill: 2500, 180, 300, 70, 30 + disable inputs | — | — |
| 5 | Radio "Giảm cân" | onClick | `setPreset('weight_loss')` | — | Auto-fill: 1500, 100, 150, 50, 20 + disable inputs | — | — |
| 6 | Radio "Tiểu đường" | onClick | `setPreset('diabetic')` | — | Auto-fill: 1800, 80, 130, 60, 25 + disable inputs | — | — |
| 7 | Radio "Tùy chỉnh" | onClick | `setPreset('custom')` | — | Enable all inputs for manual edit | — | — |
| 8 | Input "Calories" | onChange | `setCalories(value)` | — | Validate 800-5000 | Red: "Calories phải từ 800-5000" | — |
| 9 | Input "Protein" | onChange | `setProtein(value)` | — | Validate 10-500 | Red: "Protein phải từ 10-500g" | — |
| 10 | Input "Carbs" | onChange | `setCarbs(value)` | — | Validate 20-800 | Error | — |
| 11 | Input "Fat" | onChange | `setFat(value)` | — | Validate 10-300 | Error | — |
| 12 | Input "Fiber" | onChange | `setFiber(value)` | — | Validate 5-100 | Error | — |
| 13 | Button "Lưu mục tiêu" | onClick | `handleSave()` | `PUT /nutrition/goals { profileId, preset, dailyCalories, dailyProteinGrams, dailyCarbGrams, dailyFatGrams, dailyFiberGrams }` | Toast "Đã cập nhật mục tiêu!" + invalidate `['nutrition', 'daily']`, `['nutrition', 'weekly']` + go back S21 | Toast error with field details | Button spinner |

### Input State Based on Preset
```typescript
const inputsDisabled = preset !== 'custom'
// When preset selected → auto-fill + disable
// When 'custom' selected → enable + keep last values
```

---

## S25: Family Profiles

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchFamilyProfiles()` | `GET /family-profiles` | Render profile cards | Error state | Skeleton cards |
| 2 | Button [← Back] | onClick | `navigate('/profile')` | — | → S21 | — | — |
| 3 | Primary profile — "✏️ Sửa" | onClick | `navigate('/profile/edit')` | — | → S22 (edit primary profile taste) | — | — |
| 4 | Member profile — "✏️ Sửa" | onClick | `openEditModal(profileId)` | `GET /taste-profiles/{profileId}` | Open edit modal pre-filled | Error | Modal skeleton |
| 5 | Member profile — "🗑 Xóa" | onClick | `openDeleteDialog(profileId, name)` | — | Show confirm dialog | — | — |
| 6 | Delete confirm — "Xóa" | onClick | `handleDelete(profileId)` | `DELETE /family-profiles/{profileId}` | Remove card (optimistic) + Toast "Đã xóa {name}" + update count | Rollback + Toast error | — |
| 7 | Delete confirm — "Hủy" | onClick | `closeDialog()` | — | Close | — | — |
| 8 | Button "+ Thêm thành viên" | onClick | `openCreateModal()` | — | Open empty create modal | — | — |
| 9 | Create/Edit modal — Input "Tên" | onChange | `setName(value)` | — | Validate 2-50 chars | Error | — |
| 10 | Create/Edit modal — Avatar selector | onClick | `setAvatar(emoji)` | — | Highlight selected | — | — |
| 11 | Create/Edit modal — Age range chips | onClick | `setAgeRange(value)` | — | Select chip | — | — |
| 12 | Create/Edit modal — Sliders (cay/ngọt/mặn) | onChange | `setTasteLevel(type, value)` | — | Update slider | — | — |
| 13 | Create/Edit modal — Diet select | onChange | `setDietType(value)` | — | Update value | — | — |
| 14 | Create/Edit modal — Allergen chips | onClick | `toggleAllergen(type)` | — | Toggle chip | — | — |
| 15 | Create modal — "Lưu" | onClick | `handleCreate()` | `POST /family-profiles { name, ageRange, avatarUrl, tasteProfile: { regions, spiceLevel, ... } }` | Close modal + add card + Toast "Đã thêm {name}" + update count | Toast error (e.g., BIZ_MAX_PROFILES) | Button spinner |
| 16 | Edit modal — "Lưu" | onClick | `handleUpdate()` | `PATCH /family-profiles/{profileId} { name, ageRange, tasteProfile: { ... } }` | Close modal + update card + Toast "Đã cập nhật" | Toast error | Button spinner |
| 17 | Modal — "Hủy" | onClick | `closeModal()` | — | Close without saving | — | — |

### Profile Limit Check
```typescript
const canAddMore = profiles.length < (user.tier === 'pro' ? 10 : 6)

// If !canAddMore → Button disabled + tooltip:
// "Đã đạt giới hạn {max} thành viên. Nâng cấp Pro để thêm."
```

### Age-Based Auto Rules Display
```
When ageRange === 'child_under_6' || 'child_6_12':
  Show info box: "ℹ️ Profile trẻ em sẽ tự động lọc: không gia vị mạnh, không đồ sống, không caffeine"

When ageRange === 'senior':
  Show info box: "ℹ️ Ưu tiên gợi ý món dễ tiêu, ít dầu mỡ"
```
