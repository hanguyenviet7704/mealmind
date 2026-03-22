# 🍜 MealMind - App Guide

## ✅ Lỗi đã được sửa

Tất cả import `framer-motion` đã được đổi sang `motion/react` đúng theo yêu cầu.

## 🚀 Cách sử dụng App

### **Bước 1: Khởi động app**
App sẽ mở màn **Splash Screen** và tự động chuyển sang **Login** sau 2 giây.

### **Bước 2: Đăng nhập nhanh**
Nhấn nút **"🚀 Demo nhanh (Skip login)"** màu xanh để vào app ngay lập tức.

### **Bước 3: Khám phá tính năng**

#### **🏠 Home Screen (Màn chính)**
- ✅ Swipe cards: Nhấn **"Chọn"** hoặc **"Bỏ qua"** 
- ✅ Tabs bữa ăn: **Sáng / Trưa / Tối / Phụ**
- ✅ Quick Actions:
  - 🍱 **Combo** → Xem combo món ăn
  - 🎲 **Ngẫu nhiên** → Surprise me!
  - ⚡ **Nấu nhanh** → Món dưới 15 phút

#### **📖 Món ăn (Recipe List)**
- ✅ Tìm kiếm món ăn
- ✅ Filter theo vùng miền (Bắc/Trung/Nam)
- ✅ Tap vào món → Xem chi tiết

#### **📄 Recipe Detail**
- ✅ **Tab Nguyên liệu**: Checkbox, điều chỉnh số người ăn
- ✅ **Tab Cách nấu**: Step-by-step với timer
- ✅ **Tab Dinh dưỡng**: Calories, Protein, Carbs, Fat
- ✅ Bookmark món yêu thích (❤️)
- ✅ Share recipe (📤)

#### **👤 Cá nhân (Profile)**
- ✅ Xem thông tin cá nhân
- ✅ Quản lý thành viên gia đình
- ✅ Lịch sử nấu ăn (87 món, 45 ngày)
- ✅ Settings
- ✅ Nâng cấp Pro

#### **⚙️ Settings**
- ✅ Đổi mật khẩu
- ✅ Thông báo
- ✅ Ngôn ngữ
- ✅ Xuất dữ liệu

#### **⭐ Premium/Upgrade**
- ✅ So sánh Free vs Pro
- ✅ Bảng giá: 79k/tháng
- ✅ Testimonials

#### **📊 Lịch sử nấu ăn**
- ✅ Stats banner
- ✅ History theo ngày
- ✅ Toggle sang Stats view

## 🎯 Bottom Navigation

| Icon | Screen | Mô tả |
|------|--------|-------|
| 🏠 | Home | Gợi ý món ăn hàng ngày |
| 📖 | Món ăn | Danh sách recipe |
| 📅 | Thực đơn | (Coming soon) |
| 👤 | Cá nhân | Profile & Settings |

## 🎨 Tính năng đã implement

### ✅ **Hoàn chỉnh (23/45 screens)**

**Flow 0: System** (4/4)
- Splash Screen
- Offline Screen
- Error Screen
- Maintenance Screen

**Flow 1: Auth** (4/4)
- Login
- Register
- Forgot Password
- Reset Password

**Flow 2: Onboarding** (5/5)
- 5-step wizard hoàn chỉnh

**Flow 3: Home/Suggestion** (4/4)
- Home với swipeable cards
- Combo
- Surprise
- Quick Cook

**Flow 4: Recipe** (2/6)
- Recipe List
- Recipe Detail (3 tabs)

**Flow 6: Profile** (1/6)
- Profile Overview

**Flow 7: Settings** (1/5)
- Settings Screen

**Flow 8: Premium** (1/1)
- Upgrade Pro

**Flow 9: History** (1/1)
- Cooking History

## 🛠️ Tech Stack

- ✅ React 18.3.1
- ✅ React Router 7 (Data mode)
- ✅ Tailwind CSS v4
- ✅ Motion (Framer Motion) 12.23.24
- ✅ Radix UI components
- ✅ Lucide React icons
- ✅ Sonner toast
- ✅ 100% Tiếng Việt

## 🎉 Ready to use!

App đã sẵn sàng để demo và phát triển thêm!
