-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `name` VARCHAR(100) NOT NULL,
    `avatar_url` VARCHAR(500) NULL,
    `subscription_tier` ENUM('free', 'pro') NOT NULL DEFAULT 'free',
    `active_profile_id` VARCHAR(255) NULL,
    `onboarding_completed` BOOLEAN NOT NULL DEFAULT false,
    `google_id` VARCHAR(255) NULL,
    `apple_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_google_id_key`(`google_id`),
    UNIQUE INDEX `users_apple_id_key`(`apple_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `device_info` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revoked_at` DATETIME(3) NULL,

    INDEX `refresh_tokens_user_id_idx`(`user_id`),
    INDEX `refresh_tokens_token_hash_idx`(`token_hash`),
    INDEX `refresh_tokens_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taste_profiles` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `profile_name` VARCHAR(50) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `age_range` ENUM('child_under_6', 'child_6_12', 'teen', 'adult', 'senior') NULL,
    `regions` JSON NOT NULL,
    `spice_level` SMALLINT NOT NULL DEFAULT 3,
    `sweet_level` SMALLINT NOT NULL DEFAULT 3,
    `salt_level` SMALLINT NOT NULL DEFAULT 3,
    `diet_type` ENUM('normal', 'lacto_ovo_vegetarian', 'vegan', 'keto', 'low_carb', 'paleo') NOT NULL DEFAULT 'normal',
    `max_cook_time` ENUM('under_15', 'fifteen_to_30', 'thirty_to_60', 'over_60') NOT NULL DEFAULT 'thirty_to_60',
    `family_size` SMALLINT NOT NULL DEFAULT 2,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `taste_profiles_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dietary_restrictions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `profile_id` VARCHAR(255) NOT NULL,
    `allergens` JSON NOT NULL,
    `medical_conditions` JSON NOT NULL,
    `religious_diet` ENUM('none', 'buddhist_lunar', 'halal', 'kosher') NOT NULL DEFAULT 'none',
    `blacklisted_ingredients` JSON NOT NULL,
    `custom_blacklist` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `dietary_restrictions_user_id_idx`(`user_id`),
    INDEX `dietary_restrictions_profile_id_idx`(`profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `name_ascii` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(250) NOT NULL,
    `description` TEXT NOT NULL,
    `cuisine` ENUM('north', 'central', 'south', 'international') NOT NULL,
    `meal_types` JSON NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
    `cook_time` SMALLINT NOT NULL,
    `prep_time` SMALLINT NOT NULL,
    `servings` SMALLINT NOT NULL DEFAULT 2,
    `image_url` VARCHAR(500) NULL,
    `video_url` VARCHAR(500) NULL,
    `tags` JSON NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `popularity_score` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recipes_slug_key`(`slug`),
    INDEX `recipes_cuisine_idx`(`cuisine`),
    INDEX `recipes_difficulty_idx`(`difficulty`),
    INDEX `recipes_cook_time_idx`(`cook_time`),
    INDEX `recipes_is_published_idx`(`is_published`),
    INDEX `recipes_popularity_score_idx`(`popularity_score` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredients` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `name_ascii` VARCHAR(100) NOT NULL,
    `category` ENUM('protein', 'vegetable', 'fruit', 'grain', 'dairy', 'seasoning', 'oil', 'other') NOT NULL,
    `season` JSON NOT NULL,
    `avg_price_per_kg` DECIMAL(10, 0) NULL,
    `allergen_tags` JSON NOT NULL,
    `is_common` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ingredients_name_key`(`name`),
    INDEX `ingredients_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient_nutrients` (
    `ingredient_id` VARCHAR(255) NOT NULL,
    `calories_per_100g` DECIMAL(8, 2) NULL,
    `protein_per_100g` DECIMAL(8, 2) NULL,
    `carbs_per_100g` DECIMAL(8, 2) NULL,
    `fat_per_100g` DECIMAL(8, 2) NULL,
    `fiber_per_100g` DECIMAL(8, 2) NULL,
    `sodium_per_100g` DECIMAL(8, 2) NULL,
    `sugar_per_100g` DECIMAL(8, 2) NULL,
    `glycemic_index` SMALLINT NULL,
    `purine_level` ENUM('low', 'medium', 'high') NULL,
    `source` VARCHAR(50) NULL,

    PRIMARY KEY (`ingredient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredients` (
    `id` VARCHAR(255) NOT NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `ingredient_id` VARCHAR(255) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(30) NOT NULL,
    `group_type` ENUM('main', 'seasoning', 'garnish') NOT NULL DEFAULT 'main',
    `is_optional` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` SMALLINT NOT NULL DEFAULT 0,

    INDEX `recipe_ingredients_recipe_id_idx`(`recipe_id`),
    INDEX `recipe_ingredients_ingredient_id_idx`(`ingredient_id`),
    UNIQUE INDEX `recipe_ingredients_recipe_id_ingredient_id_key`(`recipe_id`, `ingredient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_steps` (
    `id` VARCHAR(255) NOT NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `step_number` SMALLINT NOT NULL,
    `description` TEXT NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `duration_minutes` SMALLINT NULL,

    INDEX `recipe_steps_recipe_id_idx`(`recipe_id`),
    UNIQUE INDEX `recipe_steps_recipe_id_step_number_key`(`recipe_id`, `step_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nutrition_info` (
    `recipe_id` VARCHAR(255) NOT NULL,
    `calories` DECIMAL(8, 1) NOT NULL,
    `protein` DECIMAL(8, 1) NOT NULL,
    `carbs` DECIMAL(8, 1) NOT NULL,
    `fat` DECIMAL(8, 1) NOT NULL,
    `fiber` DECIMAL(8, 1) NULL,
    `sodium` DECIMAL(8, 1) NULL,
    `sugar` DECIMAL(8, 1) NULL,
    `is_manual` BOOLEAN NOT NULL DEFAULT false,
    `calculated_at` DATETIME(3) NULL,

    PRIMARY KEY (`recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_logs` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `profile_id` VARCHAR(255) NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    `date` DATE NOT NULL,
    `rating` SMALLINT NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `meal_logs_user_id_date_idx`(`user_id`, `date` DESC),
    INDEX `meal_logs_recipe_id_idx`(`recipe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_interactions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `action` ENUM('view', 'skip', 'save', 'cook') NOT NULL,
    `source` ENUM('home', 'search', 'combo', 'surprise', 'meal_plan') NULL,
    `context` JSON NULL,
    `dwell_time_ms` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_interactions_user_id_created_at_idx`(`user_id`, `created_at` DESC),
    INDEX `user_interactions_recipe_id_idx`(`recipe_id`),
    INDEX `user_interactions_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks` (
    `user_id` VARCHAR(255) NOT NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plans` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `week_start` DATE NOT NULL,
    `status` ENUM('draft', 'active', 'archived') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `meal_plans_user_id_status_idx`(`user_id`, `status`),
    INDEX `meal_plans_user_id_week_start_idx`(`user_id`, `week_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_items` (
    `id` VARCHAR(255) NOT NULL,
    `plan_id` VARCHAR(255) NOT NULL,
    `day` SMALLINT NOT NULL,
    `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    `recipe_id` VARCHAR(255) NOT NULL,
    `is_locked` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` SMALLINT NOT NULL DEFAULT 0,

    INDEX `meal_plan_items_plan_id_idx`(`plan_id`),
    UNIQUE INDEX `meal_plan_items_plan_id_day_meal_type_sort_order_key`(`plan_id`, `day`, `meal_type`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_shares` (
    `id` VARCHAR(255) NOT NULL,
    `plan_id` VARCHAR(255) NOT NULL,
    `owner_id` VARCHAR(255) NOT NULL,
    `shared_with_id` VARCHAR(255) NOT NULL,
    `permission` ENUM('viewer', 'editor') NOT NULL DEFAULT 'viewer',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meal_plan_shares_plan_id_shared_with_id_key`(`plan_id`, `shared_with_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nutrition_goals` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `profile_id` VARCHAR(255) NOT NULL,
    `preset` ENUM('maintain', 'weight_loss', 'muscle_gain', 'diabetic', 'custom') NOT NULL DEFAULT 'maintain',
    `daily_calories` INTEGER NOT NULL DEFAULT 2000,
    `daily_protein_grams` DECIMAL(8, 1) NOT NULL DEFAULT 50,
    `daily_carb_grams` DECIMAL(8, 1) NOT NULL DEFAULT 275,
    `daily_fat_grams` DECIMAL(8, 1) NOT NULL DEFAULT 65,
    `daily_fiber_grams` DECIMAL(8, 1) NOT NULL DEFAULT 25,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `nutrition_goals_user_id_idx`(`user_id`),
    UNIQUE INDEX `nutrition_goals_user_id_profile_id_key`(`user_id`, `profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopping_lists` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `plan_id` VARCHAR(255) NOT NULL,
    `week_label` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shopping_lists_user_id_idx`(`user_id`),
    INDEX `shopping_lists_plan_id_idx`(`plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopping_list_items` (
    `id` VARCHAR(255) NOT NULL,
    `list_id` VARCHAR(255) NOT NULL,
    `ingredient_name` VARCHAR(100) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(30) NOT NULL,
    `category` ENUM('protein', 'vegetable', 'fruit', 'grain', 'dairy', 'seasoning', 'oil', 'other') NOT NULL,
    `checked` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` SMALLINT NOT NULL DEFAULT 0,

    INDEX `shopping_list_items_list_id_idx`(`list_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `type` ENUM('meal_suggestion', 'plan_reminder', 'timer_done', 'weekly_report', 'feature_update', 'promo') NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `body` VARCHAR(500) NOT NULL,
    `link` VARCHAR(500) NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_read_at_idx`(`user_id`, `read_at`),
    INDEX `notifications_user_id_created_at_idx`(`user_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_settings` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `time` VARCHAR(5) NULL,

    UNIQUE INDEX `notification_settings_user_id_type_key`(`user_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_preferences` (
    `user_id` VARCHAR(255) NOT NULL,
    `language` VARCHAR(5) NOT NULL DEFAULT 'vi',
    `unit` VARCHAR(10) NOT NULL DEFAULT 'metric',
    `theme` VARCHAR(10) NOT NULL DEFAULT 'light',

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taste_profiles` ADD CONSTRAINT `taste_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dietary_restrictions` ADD CONSTRAINT `dietary_restrictions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dietary_restrictions` ADD CONSTRAINT `dietary_restrictions_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `taste_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient_nutrients` ADD CONSTRAINT `ingredient_nutrients_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_steps` ADD CONSTRAINT `recipe_steps_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_info` ADD CONSTRAINT `nutrition_info_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_logs` ADD CONSTRAINT `meal_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_logs` ADD CONSTRAINT `meal_logs_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interactions` ADD CONSTRAINT `user_interactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interactions` ADD CONSTRAINT `user_interactions_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_items` ADD CONSTRAINT `meal_plan_items_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `meal_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_items` ADD CONSTRAINT `meal_plan_items_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_shares` ADD CONSTRAINT `meal_plan_shares_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `meal_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_shares` ADD CONSTRAINT `meal_plan_shares_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_shares` ADD CONSTRAINT `meal_plan_shares_shared_with_id_fkey` FOREIGN KEY (`shared_with_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_goals` ADD CONSTRAINT `nutrition_goals_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_goals` ADD CONSTRAINT `nutrition_goals_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `taste_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_lists` ADD CONSTRAINT `shopping_lists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_list_items` ADD CONSTRAINT `shopping_list_items_list_id_fkey` FOREIGN KEY (`list_id`) REFERENCES `shopping_lists`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_settings` ADD CONSTRAINT `notification_settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_preferences` ADD CONSTRAINT `user_preferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
