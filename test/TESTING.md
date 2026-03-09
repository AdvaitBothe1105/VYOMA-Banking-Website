# Vyoma Banking System - Test Suite Documentation

## Overview

Comprehensive integration tests covering all critical functionality:
- **Loan Submission Tests** - Validates loan creation and basic constraints
- **Voting Eligibility Tests** - Tests voting permission logic and restrictions
- **Risk Band Assignment Tests** - Validates risk scoring algorithm
- **Threshold Edge Cases** - Tests boundary conditions and score calculations
- **Reputation Update Tests** - Tests reputation system and settlement logic

## Test File Location

```
test/integration.test.ts
```

## Running Tests

### Prerequisites

Ensure your `.env` file is properly configured with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/vyoma
JWT_SECRET=your_jwt_secret
MASTER_WALLET_ENCRYPTION_KEY=hex_encoded_32_byte_key
```

### Run All Tests

```bash
npm run test:integration
```

### Run Specific Test Category

```bash
# Loan submission tests
npm run test:integration -- --testNamePattern="Loan Submission"

# Voting eligibility tests
npm run test:integration -- --testNamePattern="Voting"

# Risk band tests
npm run test:integration -- --testNamePattern="Risk Band"

# Edge case tests
npm run test:integration -- --testNamePattern="Edge Case"

# Reputation tests
npm run test:integration -- --testNamePattern="Reputation|Settlement"
```

### Using tsx directly

```bash
# Run with tsx (no Jest needed)
tsx test/integration.test.ts
```

## Test Categories

### 📝 Loan Submission Tests (3 tests)

Tests loan creation and validation:
- **Basic Loan Submission**: Verifies basic loan creation with correct defaults
- **Loan Submission Validation**: Tests invalid input rejection (negative amounts, zero tenure)
- **Multiple Loan Submission**: Validates multiple loans by same borrower

**Run:**
```bash
npm run test:integration -- --testNamePattern="Loan Submission"
```

### 🗳️ Voting Eligibility Tests (7 tests)

Tests voting permission logic:
- **Basic Voting Eligibility**: User meets all requirements
- **Insufficient Reputation**: User has reputation < 300
- **Unverified KYC**: User KYC status is not verified
- **Admin Cannot Vote**: Admin users are restricted
- **Borrower Cannot Vote**: Borrower cannot vote on own loan
- **No Transaction History**: User has no transaction history
- **Already Voted**: User attempts to vote twice

**Run:**
```bash
npm run test:integration -- --testNamePattern="Voting"
```

### ⚠️ Risk Band Assignment Tests (7 tests)

Tests risk scoring algorithm:
- **Low Amount** (≤50k): Score +2 for amount
- **Medium Amount** (50k-200k): Score +1 for amount
- **High Amount** (>200k): Score -1 for amount
- **Short Tenure** (≤12m): Score +2 for tenure
- **Long Tenure** (>24m): Score -1 for tenure
- **High Reputation** (≥600): Score +2 for reputation
- **Low Reputation** (<300): Score -2 for reputation

**Run:**
```bash
npm run test:integration -- --testNamePattern="Risk Band" --testNamePattern="!Edge"
```

### 🎯 Threshold Edge Cases (7 tests)

Tests boundary conditions:
- **Amount 50k Boundary**: Tests 49,999 | 50,000 | 50,001
- **Amount 200k Boundary**: Tests 199,999 | 200,000 | 200,001
- **Tenure 12m Boundary**: Tests 11 | 12 | 13 months
- **Tenure 24m Boundary**: Tests 23 | 24 | 25 months
- **Reputation 300 Boundary**: Tests 299 | 300 | 301 score
- **Reputation 600 Boundary**: Tests 599 | 600 | 601 score
- **Score Boundaries**: Tests score thresholds (4≥A, 2≥B, <2=C)

**Run:**
```bash
npm run test:integration -- --testNamePattern="Edge Case"
```

### ⭐ Reputation Update Tests (7 tests)

Tests reputation system:
- **Positive Adjustment**: +50 reputation
- **Negative Adjustment**: -30 reputation
- **Multiple Adjustments**: Cumulative adjustments (+50, +30, +20, -15)
- **Settlement - Approved Loan**: 
  - Borrower: +10
  - Correct voters (yes): +2
  - Incorrect voters (no): -1
- **Settlement - Rejected Loan**:
  - Borrower: -5
  - Correct voters (no): +2
  - Incorrect voters (yes): -1
- **Settlement - No Votes**: Works with zero voters
- **Settlement - Nonexistent Loan**: Handles gracefully

**Run:**
```bash
npm run test:integration -- --testNamePattern="Reputation|Settlement"
```

## Test Results Format

Tests output a detailed summary:

```
═══════════════════════════════════════════════════════════════
🧪 VYOMA BANKING SYSTEM - COMPREHENSIVE TEST SUITE
═══════════════════════════════════════════════════════════════

📦 LOAN SUBMISSION TESTS
───────────────────────────────────────────────────────────────
✅ PASS: Basic loan submission works
✅ PASS: Loan submission validation works
✅ PASS: Multiple loans can be submitted

📊 TEST RESULTS SUMMARY
═══════════════════════════════════════════════════════════════

📝 Loan Submission: 3/3
🗳️  Voting Eligibility: 7/7
⚠️  Risk Band Assignment: 7/7
🎯 Threshold Edge Cases: 7/7
⭐ Reputation Updates: 7/7

🎯 Overall: 31/31 tests passed (100%)

🎉 All tests passed!
═══════════════════════════════════════════════════════════════
```

## Test Data Management

### Automatic Cleanup

Tests use `generateTestCRN()` to create unique test users:
```
TEST{timestamp}{random}
```

All test data is automatically cleaned up after tests complete:
- Test users and accounts
- Test loans and votes
- Test reputation records
- Test transactions

### Manual Cleanup

If tests are interrupted, manually clean up test data:

```bash
# Connect to database and run:
DELETE FROM "LoanVote" WHERE "voterCrn" LIKE 'TEST%';
DELETE FROM "Loan" WHERE "borrowerCrn" LIKE 'TEST%';
DELETE FROM "Transaction" WHERE "fromAccount"."crn" LIKE 'TEST%' OR "toAccount"."crn" LIKE 'TEST%';
DELETE FROM "Reputation" WHERE "crn" LIKE 'TEST%';
DELETE FROM "Account" WHERE "crn" LIKE 'TEST%';
DELETE FROM "User" WHERE "crn" LIKE 'TEST%';
```

## Scoring Algorithm Reference

### Risk Band Calculation

```
Amount Factor:
  ≤ 50,000   → +2
  50k-200k   → +1
  > 200,000  → -1

Tenure Factor:
  ≤ 12 months → +2
  12-24 months → +1
  > 24 months → -1

Reputation Factor:
  ≥ 600 → +2
  300-599 → +1
  < 300 → -2

Score Result:
  ≥ 4 → Risk Band A (Low Risk)
  2-3 → Risk Band B (Medium Risk)
  < 2 → Risk Band C (High Risk)
```

### Reputation Settlement

**For Approved Loans:**
- Borrower: +10 points
- Correct voter (yes): +2 points
- Incorrect voter (no): -1 point

**For Rejected Loans:**
- Borrower: -5 points
- Correct voter (no): +2 points
- Incorrect voter (yes): -1 point

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running and `DATABASE_URL` is correct:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Missing Environment Variables

Verify all required variables in `.env`:
```bash
grep -E "DATABASE_URL|JWT_SECRET|MASTER_WALLET_ENCRYPTION_KEY" .env
```

### Tests Timeout

Increase timeout in jest config:
```javascript
testTimeout: 60000, // 60 seconds
```

### Test Data Not Cleaned Up

Manually check and clean test data:
```bash
# Count test records
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\" WHERE \"crn\" LIKE 'TEST%';"
```

## Integration with CI/CD

Add to package.json:

```json
{
  "scripts": {
    "test:integration": "tsx test/integration.test.ts",
    "test": "npm run test:integration"
  }
}
```

For GitHub Actions:

```yaml
- name: Run Tests
  run: npm run test:integration
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    MASTER_WALLET_ENCRYPTION_KEY: ${{ secrets.MASTER_WALLET_ENCRYPTION_KEY }}
```

## Performance Benchmarks

Expected execution times:
- Loan submission tests: ~2s
- Voting eligibility tests: ~5s
- Risk band tests: ~1s (no DB)
- Edge case tests: ~1s (no DB)
- Reputation tests: ~8s
- **Total: ~17 seconds**

## Contributing

When adding new tests:

1. Follow the naming convention: `test<Feature><Scenario>`
2. Include CRN/ID generation for test isolation
3. Clean up created resources
4. Add results to appropriate category
5. Update this documentation

## Notes

- Tests are designed for integration testing with real database
- Each test is isolated and independent
- No external service dependencies required
- Tests can run in parallel safely due to unique CRNs
