/*
  Warnings:

  - You are about to drop the column `avatar_path` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `sample_audio_path` on the `voices` table. All the data in the column will be lost.
  - Added the required column `avatar_url` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sample_audio_url` to the `voices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `characters` DROP COLUMN `avatar_path`,
    ADD COLUMN `avatar_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `voices` DROP COLUMN `sample_audio_path`,
    ADD COLUMN `sample_audio_url` VARCHAR(191) NOT NULL;
