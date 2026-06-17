-- AlterTable
ALTER TABLE "User" RENAME COLUMN "id" TO "userID";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "logtoSubject" TEXT;

UPDATE "User"
SET "logtoSubject" = "email"
WHERE "logtoSubject" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

CREATE UNIQUE INDEX "User_logtoSubject_key" ON "User"("logtoSubject");

ALTER TABLE "User" ALTER COLUMN "logtoSubject" SET NOT NULL;
