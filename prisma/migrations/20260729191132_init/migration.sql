-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Guest', 'User', 'Editor', 'Moderator', 'Admin');

-- CreateTable
CREATE TABLE "Product" (
    "UserId" TEXT NOT NULL,
    "UserName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "AccessToken" TEXT NOT NULL,
    "RefreshToken" TEXT NOT NULL,
    "UserRoles" "Role"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("UserId")
);
