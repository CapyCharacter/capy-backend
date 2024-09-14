-- AlterTable
ALTER TABLE `characters` MODIFY `avatar_url` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar_url` TEXT NULL;

-- AlterTable
ALTER TABLE `voices` MODIFY `description` TEXT NOT NULL,
    MODIFY `sample_audio_url` TEXT NOT NULL;
