-- Add login rate limiting fields to users
ALTER TABLE `users` ADD COLUMN `login_attempts` SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE `users` ADD COLUMN `login_locked_until` DATETIME(3) NULL;

-- Create password_reset_tokens table
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `used_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `password_reset_tokens_token_hash_idx`(`token_hash`),
    INDEX `password_reset_tokens_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create quiz_progress table
CREATE TABLE `quiz_progress` (
    `user_id` VARCHAR(255) NOT NULL,
    `completed_steps` JSON NOT NULL DEFAULT ('[]'),
    `partial_data` JSON NOT NULL DEFAULT ('{}'),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign keys
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_user_id_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `quiz_progress` ADD CONSTRAINT `quiz_progress_user_id_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
