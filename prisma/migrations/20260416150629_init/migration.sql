/*
  Warnings:

  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Note" ("content", "id", "pinned") SELECT "content", "id", "pinned" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
