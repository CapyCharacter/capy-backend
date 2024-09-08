-- CreateTable
CREATE TABLE `_users_like_characters` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_users_like_characters_AB_unique`(`A`, `B`),
    INDEX `_users_like_characters_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_users_like_characters` ADD CONSTRAINT `_users_like_characters_A_fkey` FOREIGN KEY (`A`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_users_like_characters` ADD CONSTRAINT `_users_like_characters_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
