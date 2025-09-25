-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "imgUrl" TEXT DEFAULT 'https://picsum.photos/400/200';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarUrl" TEXT DEFAULT 'https://picsum.photos/40';
