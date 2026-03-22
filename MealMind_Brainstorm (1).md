# 🍽️ BRAINSTORM: AI Meal Recommendation App

> **Project codename:** MealMind  
> **Ngày brainstorm:** 2026-03-20  
> **Vai trò:** Senior Business Analyst  
> **Trạng thái:** Draft v1.0

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Problem Statement

Hàng ngày, hàng triệu cá nhân và gia đình Việt Nam đối mặt với câu hỏi lặp đi lặp lại: **"Hôm nay ăn gì?"**. Vấn đề này tưởng đơn giản nhưng thực tế gây ra:

- **Decision fatigue:** Mệt mỏi vì phải quyết định 3 bữa/ngày × 365 ngày/năm = ~1,095 quyết định/năm
- **Lặp lại nhàm chán:** Xu hướng ăn đi ăn lại 5-10 món quen thuộc
- **Mất cân bằng dinh dưỡng:** Không kiểm soát được calo, macro khi ăn theo cảm hứng
- **Lãng phí thực phẩm:** Mua nguyên liệu không có kế hoạch → thừa → bỏ đi
- **Không phù hợp chế độ ăn:** Người có nhu cầu đặc biệt (chay, keto, dị ứng) khó tìm gợi ý phù hợp

### 1.2 Vision Statement

> Xây dựng ứng dụng AI đề xuất món ăn **cá nhân hóa** cho cá nhân/gia đình, học từ lịch sử ăn uống, sở thích và hành vi để gợi ý bữa ăn phù hợp — từ bữa sáng hàng ngày đến thực đơn tiệc đặc biệt.

### 1.3 Key Decisions (từ stakeholder)

| Hạng mục | Quyết định |
|----------|-----------|
| Đối tượng | Cá nhân / gia đình nấu tại nhà |
| Nền tảng | Mobile App (iOS + Android) + Web App |
| AI/ML | Nâng cao: ML model + NLP + Personalization |
| Core features | Gợi ý từng bữa, Meal planning, Dinh dưỡng, Filter chế độ ăn |
| Monetization | Freemium (Free + Pro subscription) |
| Database món ăn | Có sẵn, cần tích hợp |

---

## 2. USER PERSONAS

### 2.1 Persona 1: "Mẹ Bận Rộn" — Chị Lan, 35 tuổi

- **Bối cảnh:** Nhân viên văn phòng, 2 con nhỏ (3 tuổi & 7 tuổi), chồng đi công tác thường xuyên
- **Pain points:** Không có thời gian nghĩ menu, con kén ăn, muốn đảm bảo dinh dưỡng cho con
- **Nhu cầu chính:** Meal planning cả tuần, filter allergen cho con, công thức nấu nhanh < 30 phút
- **Hành vi:** Dùng app vào tối Chủ nhật để lên menu cả tuần, check lại mỗi sáng
- **Sẵn sàng trả phí:** Có, nếu tiết kiệm được thời gian

### 2.2 Persona 2: "Gym Boy" — Minh, 26 tuổi

- **Bối cảnh:** Developer, tập gym 5 buổi/tuần, đang trong giai đoạn bulk/cut
- **Pain points:** Cần kiểm soát macro chặt (protein/carb/fat), meal prep hàng tuần
- **Nhu cầu chính:** Tính toán dinh dưỡng chính xác, gợi ý theo target calo, meal prep recipes
- **Hành vi:** Dùng app hàng ngày, log bữa ăn, track progress
- **Sẵn sàng trả phí:** Có, đang trả cho MyFitnessPal rồi

### 2.3 Persona 3: "Foodie Explorer" — Hà, 28 tuổi

- **Bối cảnh:** Freelancer, sống một mình, thích thử món mới
- **Pain points:** Chán ăn lặp lại, muốn khám phá nhưng không biết bắt đầu từ đâu
- **Nhu cầu chính:** Gợi ý món mới dựa trên sở thích, seasonal ingredients, trending recipes
- **Hành vi:** Dùng app theo cảm hứng, thích scroll khám phá, share lên social media
- **Sẵn sàng trả phí:** Có thể, nếu content đủ hấp dẫn

### 2.4 Persona 4: "Người cao tuổi" — Bác Hương, 60 tuổi

- **Bối cảnh:** Về hưu, tiểu đường type 2, nấu ăn cho 2 vợ chồng
- **Pain points:** Cần kiêng đường/tinh bột, nhớ không hết món nào ăn được
- **Nhu cầu chính:** Filter bệnh lý (tiểu đường, huyết áp), gợi ý món đơn giản, UI dễ dùng
- **Hành vi:** Dùng qua con cái setup, giao diện cần font lớn, ít bước
- **Sẵn sàng trả phí:** Con cái trả

---

## 3. FEATURE MAP

### 3.1 Core Features (MVP)

#### F1: Onboarding & Taste Profile

- Khảo sát sở thích ban đầu (5-10 câu hỏi nhanh)
  - Vùng miền ẩm thực (Bắc/Trung/Nam/Quốc tế)
  - Mức độ cay/ngọt/mặn ưa thích
  - Nguyên liệu dị ứng / không ăn được
  - Chế độ ăn (bình thường, chay, keto, low-carb, ...)
  - Thời gian nấu trung bình chấp nhận được
  - Số người ăn trong gia đình
- Cập nhật profile bất kỳ lúc nào
- Hỗ trợ nhiều profile trong 1 gia đình (bố, mẹ, con)

#### F2: Smart Meal Suggestion ("Hôm nay ăn gì?")

- Gợi ý theo bữa: sáng / trưa / tối / bữa phụ
- Gợi ý theo ngữ cảnh:
  - Thời tiết (nóng → gợi ý món mát, lạnh → gợi ý canh nóng)
  - Ngày đặc biệt (cuối tuần → món cầu kỳ hơn, ngày thường → nhanh gọn)
  - Mùa (nguyên liệu theo mùa, giá rẻ hơn)
  - Lịch sử gần đây (không gợi ý món vừa ăn hôm qua)
- Mỗi lần gợi ý 3-5 món, user swipe chọn / bỏ qua
- "Surprise me" — random món mới chưa từng thử
- Gợi ý combo bữa ăn hoàn chỉnh (món chính + canh + rau + tráng miệng)

#### F3: Weekly/Monthly Meal Planning

- Tự động tạo thực đơn cả tuần (7 ngày × 3 bữa)
- Cân bằng dinh dưỡng tự động (không ăn thịt liên tục 3 ngày, đủ rau xanh, ...)
- Drag & drop thay đổi vị trí món
- Lock món yêu thích, regenerate phần còn lại
- Chia sẻ meal plan cho thành viên gia đình
- Xuất PDF / ảnh thực đơn tuần

#### F4: Nutrition Tracking

- Hiển thị calo, protein, carb, fat, fiber cho mỗi món
- Dashboard dinh dưỡng hàng ngày / tuần
- Đặt target dinh dưỡng cá nhân (VD: 2,000 kcal/ngày, 150g protein)
- Cảnh báo khi vượt / thiếu target
- Tích hợp data từ Apple Health / Google Fit (sync calo tiêu thụ từ exercise)

#### F5: Dietary Filter & Restrictions

- Chế độ ăn: Chay (lacto/ovo/vegan), Keto, Low-carb, Paleo, Mediterranean, DASH
- Dị ứng: Hải sản, đậu phộng, gluten, sữa, trứng, đậu nành, ...
- Bệnh lý: Tiểu đường, huyết áp cao, gout, thận, ...
- Tôn giáo: Ăn chay theo Phật giáo (ngày rằm/mùng 1), Halal, Kosher
- Nguyên liệu blacklist: User tự thêm nguyên liệu không muốn
- Apply filter cho toàn bộ gợi ý tự động

#### F6: Recipe Detail & Cooking Guide

- Thông tin món ăn: tên, ảnh, mô tả, vùng miền, độ khó, thời gian nấu
- Nguyên liệu: tên, số lượng, đơn vị (tự scale theo số người ăn)
- Hướng dẫn nấu step-by-step (có ảnh/video mỗi bước)
- Timer tích hợp (VD: "Hầm 45 phút" → bấm timer ngay)
- Tips & mẹo vặt từ community
- Lưu món yêu thích (bookmark)

### 3.2 Enhanced Features (Phase 2)

#### F7: Smart Shopping List

- Tự động tạo danh sách mua sắm từ meal plan
- Gộp nguyên liệu trùng (2 món cần hành → gộp tổng)
- Phân loại theo khu vực siêu thị (rau củ, thịt, gia vị, ...)
- Check-off khi mua xong
- Tích hợp đặt hàng online (GrabMart, Shopee Fresh, ...)
- Ước tính chi phí tổng bữa ăn / tuần

#### F8: Pantry Management ("Tủ lạnh thông minh")

- User nhập nguyên liệu đang có trong tủ lạnh
- Scan barcode / nhận diện ảnh nguyên liệu (AI Vision)
- Gợi ý món từ nguyên liệu đang có → giảm lãng phí
- Cảnh báo hết hạn sử dụng
- "Tôi chỉ có: trứng, cà chua, hành" → AI gợi ý món nấu được

#### F9: Special Occasion Planning

- Template tiệc: sinh nhật, Tết, Noel, tiệc BBQ, tiệc gia đình, ...
- Gợi ý menu tiệc hoàn chỉnh theo số khách, ngân sách
- Timeline chuẩn bị (món nào làm trước, món nào nấu sau)
- Chia task nấu nướng cho nhiều người

#### F10: Social & Community

- Chia sẻ món / meal plan lên feed cộng đồng
- Follow đầu bếp / food blogger
- User-generated recipes (đóng góp công thức)
- Rating & review món ăn
- Challenge hàng tuần ("Tuần này thử 3 món Hàn Quốc")

#### F11: Voice & Chat Assistant

- "Hey MealMind, hôm nay nấu gì?" → voice suggestion
- NLP chatbot: "Gợi ý món chay nấu nhanh dưới 20 phút cho 2 người"
- Hands-free cooking mode (đọc hướng dẫn nấu bằng giọng nói)

### 3.3 Premium Features (Pro Subscription)

| Feature | Free | Pro |
|---------|------|-----|
| Gợi ý bữa ăn hàng ngày | 3 gợi ý/bữa | Unlimited + AI personalized |
| Meal planning | 1 tuần | Tuần + Tháng + Custom |
| Nutrition tracking | Calo cơ bản | Full macro + micro + goals |
| Dietary filters | 1 chế độ | Unlimited + bệnh lý |
| Shopping list | Thủ công | Auto-generate + đặt hàng |
| Pantry management | ✗ | ✓ |
| Voice assistant | ✗ | ✓ |
| Ad-free | Có ads | Không ads |
| Export PDF | ✗ | ✓ |

---

## 4. AI RECOMMENDATION ARCHITECTURE

### 4.1 Data Signals (Input cho AI)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DATA SIGNALS                         │
├─────────────────┬───────────────────────────────────────────┤
│ Explicit        │ • Taste profile (onboarding)              │
│ (user tự khai)  │ • Dietary restrictions & allergies        │
│                 │ • Nutrition goals (calo, macro targets)    │
│                 │ • Cuisine preferences (Bắc/Trung/Nam/...)  │
│                 │ • Cooking skill level                      │
│                 │ • Time budget per meal                     │
├─────────────────┼───────────────────────────────────────────┤
│ Implicit        │ • Lịch sử chọn món (accepted/skipped)     │
│ (từ hành vi)    │ • Tần suất nấu lại món cũ                │
│                 │ • Thời điểm dùng app (sáng/trưa/tối)     │
│                 │ • Thời gian xem recipe (dwell time)       │
│                 │ • Bookmark & rating patterns              │
│                 │ • Shopping list completion rate            │
├─────────────────┼───────────────────────────────────────────┤
│ Contextual      │ • Thời tiết hiện tại (API)               │
│ (ngữ cảnh)      │ • Ngày trong tuần (weekday vs weekend)   │
│                 │ • Mùa (xuân/hạ/thu/đông)                 │
│                 │ • Ngày lễ / sự kiện đặc biệt             │
│                 │ • Nguyên liệu đang có (pantry)           │
│                 │ • Giá nguyên liệu theo mùa               │
└─────────────────┴───────────────────────────────────────────┘
```

### 4.2 AI Models Architecture

```
                    ┌─────────────────┐
                    │   User Request   │
                    │  "Hôm nay ăn gì?" │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Context Engine  │
                    │ (thời tiết, mùa, │
                    │  thời gian, lịch) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼────┐ ┌───────▼────────┐
     │ Collaborative  │ │Content │ │  Knowledge     │
     │  Filtering     │ │ Based  │ │  Graph         │
     │                │ │        │ │                │
     │ "Users giống   │ │"Món    │ │ "Phở → nước   │
     │  bạn thích     │ │ tương  │ │  dùng → xương │
     │  món này"      │ │ tự"    │ │  → cần thời   │
     │                │ │        │ │  gian hầm"     │
     └────────┬───────┘ └───┬────┘ └───────┬────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │  Ranking Engine  │
                    │  (score & sort)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Filter Layer   │
                    │ (dietary, allergy│
                    │  restrictions)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Diversity      │
                    │  Controller     │
                    │ (tránh lặp,     │
                    │  cân bằng)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Top 3-5 Meals  │
                    │  → User chọn    │
                    └─────────────────┘
```

### 4.3 ML Models cụ thể

| Model | Mục đích | Kỹ thuật |
|-------|----------|----------|
| **Taste Embedding** | Biểu diễn sở thích user dưới dạng vector | Matrix Factorization / Neural CF |
| **Recipe Embedding** | Biểu diễn món ăn dưới dạng vector (nguyên liệu, cooking method, cuisine) | Word2Vec trên ingredients + GNN |
| **Meal Sequence Model** | Dự đoán món tiếp theo dựa trên chuỗi bữa ăn gần đây | Transformer / LSTM |
| **Nutrition Optimizer** | Cân bằng macro trong meal plan tuần | Linear Programming / Constraint Satisfaction |
| **NLP Parser** | Hiểu query tự nhiên: "món chay nhanh dưới 20p" | Fine-tuned LLM (GPT/Gemini API) |
| **Image Classifier** | Nhận diện nguyên liệu từ ảnh chụp tủ lạnh | CNN (MobileNet / EfficientNet) |
| **Feedback Loop** | Cải thiện model từ hành vi user (accepted/skipped) | Online Learning / Bandit Algorithm |

### 4.4 Cold Start Strategy

Khi user mới, chưa có data hành vi:

1. **Onboarding quiz** → tạo taste profile ban đầu
2. **Popularity-based fallback** → gợi ý món phổ biến nhất theo vùng miền
3. **Demographic similarity** → user nữ, 30 tuổi, TP.HCM → gợi ý giống nhóm tương tự
4. **Explore/Exploit** → 70% món "safe" (phổ biến) + 30% món mới (khám phá) → học nhanh từ phản hồi

---

## 5. DATA MODEL (High-Level)

### 5.1 Core Entities

```
┌─────────┐     ┌──────────┐     ┌─────────────┐
│  User   │────▸│  Profile  │────▸│  Dietary    │
│         │     │  (taste)  │     │  Restriction│
└────┬────┘     └──────────┘     └─────────────┘
     │
     │ has many
     ▼
┌──────────┐     ┌──────────┐     ┌────────────┐
│ MealLog  │────▸│  Recipe  │────▸│ Ingredient │
│(lịch sử) │     │  (món)   │     │ (nguyên    │
└──────────┘     └────┬─────┘     │  liệu)     │
                      │           └────────────┘
                      │ has
                      ▼
                ┌──────────┐     ┌────────────┐
                │Nutrition │     │  Category  │
                │  Info    │     │ (cuisine,  │
                └──────────┘     │  meal type)│
                                 └────────────┘
┌──────────┐     ┌──────────┐
│ MealPlan │────▸│ PlanItem │
│  (tuần)  │     │ (slot)   │
└──────────┘     └──────────┘
```

### 5.2 Key Tables

| Entity | Mô tả | Key fields |
|--------|--------|------------|
| `users` | Thông tin user | id, name, email, subscription_tier |
| `taste_profiles` | Sở thích ẩm thực | user_id, spice_level, sweet_level, preferred_cuisines[], cooking_skill, max_cook_time |
| `dietary_restrictions` | Chế độ ăn & dị ứng | user_id, diet_type, allergens[], medical_conditions[], blacklisted_ingredients[] |
| `recipes` | Công thức món ăn | id, name, description, cuisine, meal_type, difficulty, cook_time, servings, image_url |
| `recipe_ingredients` | Nguyên liệu từng món | recipe_id, ingredient_id, quantity, unit |
| `ingredients` | Master data nguyên liệu | id, name, category, season, avg_price |
| `nutrition_info` | Thông tin dinh dưỡng | recipe_id, calories, protein, carbs, fat, fiber, sodium |
| `meal_logs` | Lịch sử ăn uống | user_id, recipe_id, meal_type, date, rating, feedback |
| `meal_plans` | Thực đơn tuần | user_id, week_start, status |
| `meal_plan_items` | Chi tiết từng slot | plan_id, day, meal_type, recipe_id |
| `user_interactions` | Hành vi implicit | user_id, recipe_id, action (view/skip/save/cook), timestamp |

---

## 6. USER JOURNEY & WIREFRAME CONCEPTS

### 6.1 First-Time User Journey

```
Download App
     │
     ▼
Sign Up (Email / Google / Apple)
     │
     ▼
Onboarding Quiz (5 screens, ~2 phút)
     │
     ├─ Screen 1: "Bạn ở vùng miền nào?" → Bắc / Trung / Nam
     ├─ Screen 2: "Khẩu vị của bạn?" → Slider: cay / ngọt / mặn
     ├─ Screen 3: "Dị ứng thực phẩm?" → Multi-select chips
     ├─ Screen 4: "Chế độ ăn đặc biệt?" → Single select
     └─ Screen 5: "Gia đình bạn có mấy người?" → Number picker
     │
     ▼
Home Screen → "Chào buổi sáng! Hôm nay nấu gì?"
     │
     ▼
3 Cards gợi ý → Swipe phải (thích) / trái (bỏ)
     │
     ▼
Chọn món → Recipe Detail → Bắt đầu nấu!
```

### 6.2 Daily User Journey (Returning User)

```
Mở App (7:00 AM)
     │
     ▼
Push notification: "Sáng nay thử Bánh mì trứng ốp la nhé!"
     │
     ▼
Home: 3 gợi ý bữa sáng (đã học từ hành vi)
     │
     ├─ Chọn món → Nấu → Đánh giá ⭐
     └─ Skip tất cả → "Surprise me!" → Món ngẫu nhiên
     │
     ▼
Trưa (11:30 AM): Notification gợi ý bữa trưa
     │
     ▼
Tối Chủ nhật: Lên Meal Plan tuần mới
     │
     ├─ Auto-generate 7 ngày × 3 bữa
     ├─ Swap các món không thích
     ├─ Confirm → Auto shopping list
     └─ Share cho vợ/chồng
```

---

## 7. COMPETITIVE ANALYSIS

| App | Điểm mạnh | Điểm yếu | MealMind khác biệt |
|-----|-----------|-----------|---------------------|
| **Cookpad** | Community lớn, UGC recipes | Không có AI recommendation, không tracking dinh dưỡng | AI personalization + nutrition |
| **Yummly** | AI suggestion tốt, video recipes | Thiên về thị trường Mỹ, ít món Việt | Localize cho ẩm thực Việt Nam |
| **MyFitnessPal** | Nutrition tracking mạnh | Không gợi ý món, không recipe detail | Kết hợp suggestion + tracking |
| **Mealime** | Meal planning + shopping list | Không có AI learning, ít personalized | AI học từ hành vi, context-aware |
| **Samsung Food** | Tích hợp thiết bị Samsung | Giới hạn ecosystem | Cross-platform, device-agnostic |

**Unique Value Proposition của MealMind:**

> "Ứng dụng duy nhất kết hợp AI cá nhân hóa sâu + ẩm thực Việt Nam phong phú + dinh dưỡng chính xác + meal planning thông minh — hiểu bạn hơn mỗi ngày."

---

## 8. TECH STACK (Đề xuất)

### 8.1 Frontend

| Layer | Technology | Lý do |
|-------|-----------|-------|
| Mobile | React Native / Flutter | Cross-platform iOS + Android |
| Web | Next.js (React) | SSR, SEO, shared component logic |
| State | Zustand + TanStack Query | Lightweight, server state caching |
| UI Kit | Tailwind + Custom Design System | Consistent across platforms |

### 8.2 Backend

| Layer | Technology | Lý do |
|-------|-----------|-------|
| API | NestJS (Node.js) hoặc FastAPI (Python) | Type-safe, scalable; Python nếu heavy ML |
| Database | MySQL | Relational, JSON support, full-text search |
| Cache | Redis | Session, frequently accessed recipes |
| Search | Elasticsearch / Meilisearch | Full-text search recipes, ingredients |
| File Storage | AWS S3 / CloudFlare R2 | Recipe images, user uploads |

### 8.3 AI/ML

| Component | Technology | Lý do |
|-----------|-----------|-------|
| Recommendation | Python + TensorFlow/PyTorch | Custom ML models |
| NLP | OpenAI API / Google Gemini | Query understanding, chatbot |
| Image Recognition | TensorFlow Lite / Core ML | On-device ingredient detection |
| ML Pipeline | MLflow + Airflow | Model training, versioning, scheduling |
| Feature Store | Feast / Redis | Real-time feature serving |

### 8.4 Infrastructure

| Component | Technology |
|-----------|-----------|
| Cloud | AWS / GCP |
| Container | Docker + Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Datadog / Grafana |
| Analytics | Mixpanel / Amplitude |

---

## 9. PHÂN PHA TRIỂN KHAI

### Phase 1: MVP (3 tháng)

**Mục tiêu:** Validate core value — "AI gợi ý món ăn hàng ngày có giá trị với user không?"

| Tuần | Deliverable |
|------|------------|
| W1-2 | Setup project, database schema, recipe data import |
| W3-4 | Auth + Onboarding + Taste Profile |
| W5-6 | Recipe browsing + detail + search |
| W7-8 | AI Suggestion v1 (content-based + popularity) |
| W9-10 | Basic Meal Planning (tuần) |
| W11 | Nutrition display (calo, macro per recipe) |
| W12 | Testing, bug fix, soft launch (closed beta 100 users) |

**MVP scope:** Gợi ý bữa ăn + Recipe detail + Basic meal plan + Nutrition info + 1 dietary filter

### Phase 2: Learning & Growth (3 tháng tiếp)

- Collaborative filtering (học từ hành vi)
- Full dietary filters (chay, keto, bệnh lý, dị ứng)
- Nutrition tracking dashboard + goals
- Smart Shopping List (auto-generate từ meal plan)
- Push notifications (contextual reminders)
- Feedback loop (rating, skip tracking → improve AI)
- Public launch (App Store + Google Play)

### Phase 3: Advanced AI & Monetization (3 tháng tiếp)

- NLP chatbot ("gợi ý món chay nhanh")
- Pantry management (nhập nguyên liệu → gợi ý)
- Special occasion planning (tiệc, Tết, ...)
- Voice assistant integration
- Freemium gating + Pro subscription launch
- Community features (share, follow, UGC)
- Partner integration (GrabMart, Shopee Fresh)

### Phase 4: Scale & Optimize (Ongoing)

- A/B testing recommendation algorithms
- Multi-language (Vietnamese, English, Japanese)
- Offline mode
- Wearable integration (Apple Watch quick suggestions)
- B2B extension (canteen, meal kit delivery)

---

## 10. KEY METRICS (KPIs)

### 10.1 Product Metrics

| Metric | Mục tiêu MVP | Mục tiêu 1 năm |
|--------|-------------|----------------|
| DAU (Daily Active Users) | 500 | 50,000 |
| Retention D7 | 30% | 45% |
| Retention D30 | 15% | 30% |
| Meals suggested/day/user | 3 | 5 |
| Suggestion acceptance rate | 20% | 40% |
| Meal plans created/week | 100 | 10,000 |
| Avg session duration | 3 min | 5 min |

### 10.2 Business Metrics

| Metric | Mục tiêu 1 năm |
|--------|----------------|
| Total registered users | 200,000 |
| Pro conversion rate | 5% |
| MRR (Monthly Recurring Revenue) | $10,000 |
| CAC (Customer Acquisition Cost) | < $2 |
| LTV (Lifetime Value) | > $20 |
| Churn rate (Pro) | < 8%/tháng |

### 10.3 AI Metrics

| Metric | Mục tiêu |
|--------|---------|
| Recommendation precision@5 | > 35% |
| Diversity score (unique cuisines/week) | > 4 |
| Cold start accuracy (new user, first 3 days) | > 15% acceptance |
| Nutrition goal adherence | > 70% meals within target ±10% |

---

## 11. RISKS & MITIGATIONS

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Dữ liệu món Việt không đủ phong phú | Cao | Trung bình | Kết hợp database có sẵn + crawl + UGC + partnership với food bloggers |
| Cold start kém → user bỏ app ngay | Cao | Cao | Onboarding quiz tốt + popularity fallback + fast feedback loop |
| AI gợi ý không chính xác | Cao | Trung bình | A/B testing, human curation backup, "Why this suggestion?" explainability |
| Nutrition data không chính xác | Trung bình | Trung bình | Dùng nguồn verified (USDA, Viện Dinh dưỡng VN), cho user report sai số |
| User không trả phí Pro | Trung bình | Cao | Free tier vẫn có giá trị, Pro phải "wow" (AI voice, pantry scan, unlimited plan) |
| Cạnh tranh từ app lớn (Samsung Food, Yummly) | Trung bình | Thấp | Tập trung niche Việt Nam, localize sâu, không cạnh tranh global |

---

## 12. OPEN QUESTIONS (Cần thảo luận tiếp)

1. **Database món ăn có sẵn** — format gì? Bao nhiêu món? Có nutrition info không? Có ảnh không?
2. **Recipe content** — Tự viết vs UGC vs crawl vs partnership? Copyright issues?
3. **AI budget** — Có thể dùng GPT/Gemini API (trả per-call) hay cần self-hosted models?
4. **Localization** — Chỉ tiếng Việt trước hay multi-language từ đầu?
5. **Team size** — Bao nhiêu developer, designer, ML engineer available?
6. **Timeline** — Deadline MVP cứng hay flexible?
7. **Competitor deep dive** — Cần phân tích sâu hơn app nào không?

---

## 13. NEXT STEPS

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Review & approve brainstorm document | Stakeholder | Week 1 |
| 2 | Audit database món ăn có sẵn (format, quality, coverage) | BA + Data team | Week 1-2 |
| 3 | Finalize MVP feature scope & priority | BA + Product Owner | Week 2 |
| 4 | UI/UX wireframe cho core flows | Designer | Week 2-3 |
| 5 | Technical architecture document | Tech Lead | Week 2-3 |
| 6 | Data model detail + API contract | Backend Lead | Week 3 |
| 7 | AI/ML research spike (model selection, data pipeline) | ML Engineer | Week 2-4 |
| 8 | Development kickoff | All | Week 4 |

---

> *Document này là brainstorm ban đầu, cần được review và iterate cùng team trước khi chuyển sang phase requirement specification.*
