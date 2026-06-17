-- Rename primary key columns to match the current Prisma schema
ALTER TABLE "Series" RENAME COLUMN "id" TO "seriesID";
ALTER TABLE "Card" RENAME COLUMN "id" TO "cardID";
ALTER TABLE "Deck" RENAME COLUMN "id" TO "deckID";
ALTER TABLE "Deck" RENAME COLUMN "userId" TO "userID";
ALTER TABLE "DeckCard" RENAME COLUMN "deckId" TO "deckID";
ALTER TABLE "DeckCard" RENAME COLUMN "cardId" TO "cardID";
