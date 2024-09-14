/*
  Warnings:

  - Added the required column `creator_user_id` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_user_id` to the `voices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `characters` ADD COLUMN `creator_user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `voices` ADD COLUMN `creator_user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_creator_user_id_fkey` FOREIGN KEY (`creator_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voices` ADD CONSTRAINT `voices_creator_user_id_fkey` FOREIGN KEY (`creator_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
