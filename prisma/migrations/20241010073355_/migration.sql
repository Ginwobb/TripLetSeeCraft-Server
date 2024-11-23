/*
  Warnings:

  - Added the required column `destination_id` to the `trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `trip` ADD COLUMN `destination_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_destination_id_fkey` FOREIGN KEY (`destination_id`) REFERENCES `destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
