/*
  Warnings:

  - You are about to drop the `_GameToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brackets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournament_statistic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournaments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_Bracket_To_User` DROP FOREIGN KEY `_Bracket_To_User_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Bracket_To_User` DROP FOREIGN KEY `_Bracket_To_User_B_fkey`;

-- DropForeignKey
ALTER TABLE `_GameToPlayer` DROP FOREIGN KEY `_GameToPlayer_A_fkey`;

-- DropForeignKey
ALTER TABLE `_GameToPlayer` DROP FOREIGN KEY `_GameToPlayer_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PlayerToTournament` DROP FOREIGN KEY `_PlayerToTournament_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PlayerToTournament` DROP FOREIGN KEY `_PlayerToTournament_B_fkey`;

-- DropForeignKey
ALTER TABLE `brackets` DROP FOREIGN KEY `brackets_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `brackets` DROP FOREIGN KEY `brackets_winnerId_fkey`;

-- DropForeignKey
ALTER TABLE `games` DROP FOREIGN KEY `games_bracketId_fkey`;

-- DropForeignKey
ALTER TABLE `tournament_statistic` DROP FOREIGN KEY `tournament_statistic_playerId_fkey`;

-- DropForeignKey
ALTER TABLE `tournament_statistic` DROP FOREIGN KEY `tournament_statistic_tournamentId_fkey`;

-- DropTable
DROP TABLE `_GameToPlayer`;

-- DropTable
DROP TABLE `brackets`;

-- DropTable
DROP TABLE `games`;

-- DropTable
DROP TABLE `players`;

-- DropTable
DROP TABLE `tournament_statistic`;

-- DropTable
DROP TABLE `tournaments`;

-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `password` VARCHAR(191) NOT NULL,
    `gamesWon` INTEGER NOT NULL DEFAULT 0,
    `gamesPlayed` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Player_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `gameMode` ENUM('NORMAL', 'TOURNAMENT') NOT NULL DEFAULT 'NORMAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `bracketId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tournament` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Tournament_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bracket` (
    `id` VARCHAR(191) NOT NULL,
    `round` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'FINISHED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tournamentId` VARCHAR(191) NOT NULL,
    `winnerId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentStatistic` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `tournamentId` VARCHAR(191) NOT NULL,
    `gamesPlayed` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `winPercentage` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerToGame` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PlayerToGame_AB_unique`(`A`, `B`),
    INDEX `_PlayerToGame_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_bracketId_fkey` FOREIGN KEY (`bracketId`) REFERENCES `Bracket`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bracket` ADD CONSTRAINT `Bracket_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bracket` ADD CONSTRAINT `Bracket_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentStatistic` ADD CONSTRAINT `TournamentStatistic_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentStatistic` ADD CONSTRAINT `TournamentStatistic_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToTournament` ADD CONSTRAINT `_PlayerToTournament_A_fkey` FOREIGN KEY (`A`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToTournament` ADD CONSTRAINT `_PlayerToTournament_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToGame` ADD CONSTRAINT `_PlayerToGame_A_fkey` FOREIGN KEY (`A`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToGame` ADD CONSTRAINT `_PlayerToGame_B_fkey` FOREIGN KEY (`B`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Bracket_To_User` ADD CONSTRAINT `_Bracket_To_User_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bracket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Bracket_To_User` ADD CONSTRAINT `_Bracket_To_User_B_fkey` FOREIGN KEY (`B`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
