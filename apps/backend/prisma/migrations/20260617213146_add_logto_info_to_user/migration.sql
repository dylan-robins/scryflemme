/*
  Warnings:

  - The `value` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userID,name]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `number` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cardClass` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardClass" AS ENUM ('Esbroufe', 'Magie', 'Agilité', 'Soutien', 'Force', 'Épique');

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL,
DROP COLUMN "cardClass",
ADD COLUMN     "cardClass" "CardClass" NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Deck_userID_name_key" ON "Deck"("userID", "name");

-- RenameForeignKey
ALTER TABLE "Deck" RENAME CONSTRAINT "Deck_userId_fkey" TO "Deck_userID_fkey";

-- RenameForeignKey
ALTER TABLE "DeckCard" RENAME CONSTRAINT "DeckCard_cardId_fkey" TO "DeckCard_cardID_fkey";

-- RenameForeignKey
ALTER TABLE "DeckCard" RENAME CONSTRAINT "DeckCard_deckId_fkey" TO "DeckCard_deckID_fkey";
