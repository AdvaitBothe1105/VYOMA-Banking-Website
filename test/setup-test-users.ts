/**
 * Test Script: Setup Test Users and Perform Fund Transfer
 * 
 * This script demonstrates how to quickly create test users and perform
 * fund transfers without going through the full registration/login flow.
 * 
 * Usage:
 *   npx ts-node test/setup-test-users.ts
 *   or
 *   npm run test:setup
 */

// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import {
  createTestTransferSetup,
  performTestTransfer,
  cleanupTestData,
  getAccountByCRN,
} from "./test-utils";

async function main() {
  console.log("🚀 Starting test setup...\n");

  // Check required environment variables
  const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "MASTER_WALLET_ENCRYPTION_KEY",
    "LOCAL_RPC_URL",
    "WALLET_PRIVATE_KEY",
    "VYO_TOKEN_ADDRESS",
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\nPlease set these in your .env file");
    console.error("\nNote: Make sure your .env file is in the project root");
    process.exit(1);
  }

  // Validate private key format
  const privateKey = process.env.WALLET_PRIVATE_KEY!;
  if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
    console.error("❌ Invalid WALLET_PRIVATE_KEY format");
    console.error("   Expected: 0x followed by 64 hex characters (66 total)");
    console.error(`   Got: ${privateKey.substring(0, 10)}... (length: ${privateKey.length})`);
    process.exit(1);
  }

  try {
    // Step 1: Create two test users with accounts
    console.log("📝 Creating test users...");
    const { sender, receiver } = await createTestTransferSetup({
      senderBalance: 10000,
      receiverBalance: 5000,
    });

    console.log("✅ Test users created!");
    console.log("\n📊 Sender Details:");
    console.log(`   CRN: ${sender.user.crn}`);
    console.log(`   Name: ${sender.user.name}`);
    console.log(`   Email: ${sender.user.email}`);
    console.log(`   Account Number: ${sender.account.account_number}`);
    console.log(`   Balance: ${sender.account.balance}`);
    console.log(`   On-chain Address: ${sender.onchainAddress}`);
    console.log(`   Token: ${sender.token.substring(0, 20)}...`);

    console.log("\n📊 Receiver Details:");
    console.log(`   CRN: ${receiver.user.crn}`);
    console.log(`   Name: ${receiver.user.name}`);
    console.log(`   Email: ${receiver.user.email}`);
    console.log(`   Account Number: ${receiver.account.account_number}`);
    console.log(`   Balance: ${receiver.account.balance}`);
    console.log(`   On-chain Address: ${receiver.onchainAddress}`);
    console.log(`   Token: ${receiver.token.substring(0, 20)}...`);

    // Step 2: Perform a fund transfer
    console.log("\n💸 Performing fund transfer...");
    const transferAmount = 2000;
    const transferResult = await performTestTransfer(
      sender.account.account_number,
      receiver.account.account_number,
      transferAmount,
      "Test transfer"
    );

    console.log("✅ Transfer successful!");
    console.log(`   Transaction ID: ${transferResult.transaction.id}`);
    console.log(`   Amount: ${transferAmount}`);
    console.log(`   Blockchain Hash: ${transferResult.onchainTxHash}`);

    // Step 3: Verify balances
    console.log("\n🔍 Verifying balances...");
    const senderAccount = await getAccountByCRN(sender.user.crn);
    const receiverAccount = await getAccountByCRN(receiver.user.crn);

    console.log(`   Sender Balance: ${senderAccount?.balance}`);
    console.log(`   Receiver Balance: ${receiverAccount?.balance}`);

    // Step 4: Save test data for later use
    console.log("\n💾 Test data saved. You can use these credentials:");
    console.log("\n📋 Sender Login Credentials:");
    console.log(`   CRN/Email: ${sender.user.crn} or ${sender.user.email}`);
    console.log(`   Password: test123456 (default)`);
    console.log(`   JWT Token: ${sender.token}`);

    console.log("\n📋 Receiver Login Credentials:");
    console.log(`   CRN/Email: ${receiver.user.crn} or ${receiver.user.email}`);
    console.log(`   Password: test123456 (default)`);
    console.log(`   JWT Token: ${receiver.token}`);

    console.log("\n✨ Test setup complete!");
    console.log("\n⚠️  Note: To clean up test data, run:");
    console.log(`   await cleanupTestData(['${sender.user.crn}', '${receiver.user.crn}'])`);

    // Uncomment the line below to automatically clean up after testing
    // await cleanupTestData([sender.user.crn, receiver.user.crn]);
  } catch (error) {
    console.error("❌ Error during test setup:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => {
      console.log("\n✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

export { main };

