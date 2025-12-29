-- AlterTable
ALTER TABLE "User" ADD COLUMN     "encryptedPrivateKey" TEXT,
ADD COLUMN     "kycStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "onchainAddress" TEXT,
ADD COLUMN     "onchainBalance" DECIMAL(65,30),
ADD COLUMN     "walletStatus" TEXT DEFAULT 'created';
