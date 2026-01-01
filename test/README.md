# Test Utilities for Vyoma Banking System

This directory contains utilities to help you quickly set up test users and perform fund transfers without going through the entire registration and login flow manually.

## Overview

The test utilities provide:
- **Direct user creation** - Bypass the registration API and create users directly in the database
- **JWT token generation** - Generate authentication tokens without going through the login API
- **Fund transfer helpers** - Perform transfers between test accounts
- **Cleanup utilities** - Remove test data when done

## Quick Start

### 1. Setup Test Users and Perform Transfer

Run the setup script to create two test users and perform a fund transfer:

```bash
npm run test:setup
```

This will:
- Create a sender user with 10,000 balance
- Create a receiver user with 5,000 balance
- Perform a 2,000 transfer from sender to receiver
- Display all credentials and tokens for later use

### 2. Use Test Utilities in Your Code

You can import and use the utilities in your own test scripts:

```typescript
import {
  createTestUser,
  createTestTransferSetup,
  performTestTransfer,
  generateTestToken,
  cleanupTestData,
} from "./test/test-utils";

// Create a single test user
const user = await createTestUser({
  name: "John Doe",
  email: "john@example.com",
  initialBalance: 10000,
});

// Create a complete transfer setup (two users)
const { sender, receiver } = await createTestTransferSetup({
  senderBalance: 10000,
  receiverBalance: 5000,
});

// Generate a JWT token for a user
const token = await generateTestToken(user.user.crn);

// Perform a fund transfer
const result = await performTestTransfer(
  sender.account.account_number,
  receiver.account.account_number,
  2000,
  "Test transfer"
);

// Clean up when done
await cleanupTestData([sender.user.crn, receiver.user.crn]);
```

## Available Functions

### `createTestUser(options?)`

Creates a test user directly in the database with:
- Blockchain wallet (Ethereum address)
- Encrypted private key
- Database account
- Initial token balance (default: 5000)
- Gas funding

**Options:**
- `crn` - Custom CRN (auto-generated if not provided)
- `name` - User name
- `email` - Email address
- `password` - Password (default: "test123456")
- `phone` - Phone number
- `accountType` - Account type (default: "Savings")
- `initialBalance` - Initial token balance (default: 5000)
- `isAdmin` - Admin flag (default: false)
- `kycStatus` - KYC status (default: "verified")

**Returns:**
```typescript
{
  user: User,
  account: Account,
  password: string, // Plain password for login
  onchainAddress: string
}
```

### `createTestTransferSetup(options?)`

Creates two test users ready for fund transfer.

**Options:**
- `senderBalance` - Sender's initial balance (default: 10000)
- `receiverBalance` - Receiver's initial balance (default: 5000)

**Returns:**
```typescript
{
  sender: { user, account, password, onchainAddress, token },
  receiver: { user, account, password, onchainAddress, token }
}
```

### `generateTestToken(crn, userId?)`

Generates a JWT token for a user without going through the login API.

**Parameters:**
- `crn` - User's CRN
- `userId` - Optional user ID (fetched if not provided)

**Returns:** JWT token string

### `performTestTransfer(fromAccountNumber, toAccountNumber, amount, remarks?)`

Performs a fund transfer between two accounts using the actual transfer logic.

**Parameters:**
- `fromAccountNumber` - Sender's account number
- `toAccountNumber` - Receiver's account number
- `amount` - Transfer amount
- `remarks` - Optional remarks

**Returns:**
```typescript
{
  transaction: Transaction,
  onchainTxHash: string,
  fromAccount: string,
  toAccount: string,
  amount: number
}
```

### `cleanupTestData(crns)`

Deletes test users and their associated accounts.

**Parameters:**
- `crns` - Array of CRNs to delete

## Example: Complete Test Flow

```typescript
import {
  createTestTransferSetup,
  performTestTransfer,
  cleanupTestData,
} from "./test/test-utils";

async function testFundTransfer() {
  // 1. Create test users
  const { sender, receiver } = await createTestTransferSetup({
    senderBalance: 10000,
    receiverBalance: 5000,
  });

  console.log("Sender:", sender.account.account_number);
  console.log("Receiver:", receiver.account.account_number);

  // 2. Perform transfer
  const result = await performTestTransfer(
    sender.account.account_number,
    receiver.account.account_number,
    2000,
    "Test payment"
  );

  console.log("Transfer successful:", result.onchainTxHash);

  // 3. Clean up (optional)
  // await cleanupTestData([sender.user.crn, receiver.user.crn]);
}
```

## Using Test Credentials in Your App

After running the setup script, you'll get credentials like:

```
Sender Login Credentials:
  CRN/Email: TEST1234567890 or sender1234567890@test.com
  Password: test123456
  JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

You can use these to:
1. **Login via UI** - Use the CRN/email and password in the login form
2. **API Testing** - Use the JWT token in API requests:
   ```bash
   curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/account?crn=TEST1234567890
   ```
3. **Postman/Insomnia** - Set the token as a cookie in your requests

## Important Notes

1. **Blockchain Requirements**: The test utilities require:
   - A running local blockchain (Hardhat node)
   - Deployed VyomaToken contract
   - Gas funding wallet configured

2. **Database**: Test users are created in your actual database. Make sure you're using a test database or clean up after testing.

3. **Supabase**: The registration API uploads documents to Supabase. The test utilities bypass this by using placeholder URLs. If you need actual document uploads, you'll need to modify the utilities.

4. **Environment Variables**: Ensure these are set:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `MASTER_WALLET_ENCRYPTION_KEY`
   - `LOCAL_RPC_URL`
   - `NEXT_PUBLIC_SUPABASE_URL` (optional for test utils)
   - `SUPABASE_SERVICE_ROLE_KEY` (optional for test utils)

## Troubleshooting

### "MASTER_WALLET_ENCRYPTION_KEY missing"
Make sure your `.env` file has the encryption key set.

### "Wallet not funded for gas"
The test utilities try to fund wallets automatically, but if this fails, you may need to manually fund the test wallets with ETH.

### "Failed to mint tokens"
Ensure your VyomaToken contract is deployed and the contract address is configured correctly.

## Next Steps

- Add more test scenarios (insufficient balance, minimum balance checks, etc.)
- Create integration tests using these utilities
- Add test data fixtures for common scenarios
- Set up automated cleanup after tests

