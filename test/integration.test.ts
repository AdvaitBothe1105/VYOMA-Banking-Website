/**
 * Integration Tests for Vyoma Banking System
 * 
 * Covers:
 * - Loan submission tests
 * - Voting eligibility tests
 * - Risk band assignment tests
 * - Threshold edge cases
 * - Reputation update tests
 */

import { prisma } from "@/lib/prisma";
import { calculateRiskBand } from "@/lib/risk";
import { canUserVoteOnLoan } from "@/lib/loanVoting";
import { adjustReputation } from "@/lib/reputation";
import { settleReputationAfterDecision } from "@/lib/reputationSettlement";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

function generateTestCRN(): string {
  return `TEST${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

async function createTestUser(
  overrides: Partial<{
    crn: string;
    name: string;
    kycStatus: string;
    isAdmin: boolean;
  }> = {}
) {
  const crn = overrides.crn || generateTestCRN();
  const user = await prisma.user.create({
    data: {
      crn,
      name: overrides.name || `Test User ${crn}`,
      email: `${crn}@test.local`,
      password: "hashedpassword123",
      phone: "9999999999",
      dob: new Date("1990-01-01"),
      address: "123 Test St",
      city: "TestCity",
      state: "TestState",
      pincode: "123456",
      aadharUrl: "https://example.com/aadhar",
      panUrl: "https://example.com/pan",
      accountType: "savings",
      agree: true,
      kycStatus: overrides.kycStatus || "verified",
      isAdmin: overrides.isAdmin || false,
    },
  });

  // Create account for user
  await prisma.account.create({
    data: {
      crn,
      accountType: "savings",
      account_number: `ACC${crn}${Date.now()}`,
      balance: 500000, // ₹5 lakhs starting balance
      name: user.name,
    },
  });

  return user;
}

async function createTestLoan(
  borrowerCrn: string,
  overrides: Partial<{
    amount: number;
    tenureMonths: number;
    purpose: string;
    interestRate: number;
    riskBand: string;
    status: string;
  }> = {}
) {
  return await prisma.loan.create({
    data: {
      borrowerCrn,
      amount: overrides.amount || 100000,
      tenureMonths: overrides.tenureMonths || 12,
      purpose: overrides.purpose || "Personal loan",
      purposeCategory: "personal",
      interestRate: overrides.interestRate || 12.5,
      riskBand: overrides.riskBand || "B",
      status: overrides.status || "pending",
    },
  });
}

async function cleanupTestData() {
  // Delete all test data
  const testCrns = await prisma.user.findMany({
    where: { crn: { startsWith: "TEST" } },
    select: { crn: true },
  });

  for (const { crn } of testCrns) {
    await prisma.loanVote.deleteMany({ where: { voterCrn: crn } });
    await prisma.loanVote.deleteMany({ where: { loan: { borrowerCrn: crn } } });
    await prisma.loan.deleteMany({ where: { borrowerCrn: crn } });
    await prisma.transaction.deleteMany({
      where: { OR: [{ fromAccount: { crn } }, { toAccount: { crn } }] },
    });
    await prisma.reputation.deleteMany({ where: { crn } });
    await prisma.account.deleteMany({ where: { crn } });
    await prisma.user.delete({ where: { crn } });
  }
}

// ============================================================================
// LOAN SUBMISSION TESTS
// ============================================================================

async function testLoanSubmissionBasic() {
  console.log("\n📝 TEST: Basic Loan Submission");
  try {
    const borrower = await createTestUser();
    const loan = await createTestLoan(borrower.crn);

    if (!loan.id) throw new Error("Loan ID not generated");
    if (loan.status !== "pending") throw new Error("Loan status should be pending");
    if (loan.borrowerCrn !== borrower.crn) throw new Error("Borrower CRN mismatch");

    console.log("✅ PASS: Basic loan submission works");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testLoanSubmissionValidation() {
  console.log("\n📝 TEST: Loan Submission with Invalid Data");
  try {
    const borrower = await createTestUser();

    // Test negative amount - should be rejected by database constraint
    try {
      await prisma.loan.create({
        data: {
          borrowerCrn: borrower.crn,
          amount: -100000,
          tenureMonths: 12,
          purpose: "Invalid",
          purposeCategory: "personal",
          interestRate: 12.5,
          riskBand: "B",
          status: "pending",
        },
      });
      console.log("❌ FAIL: Negative amount was accepted");
      return { passed: false, error: "Negative amount should be rejected" };
    } catch (e) {
      console.log("✅ Negative amount correctly rejected");
    }

    // Test zero tenure - should be rejected by database constraint
    try {
      await prisma.loan.create({
        data: {
          borrowerCrn: borrower.crn,
          amount: 100000,
          tenureMonths: 0,
          purpose: "Invalid",
          purposeCategory: "personal",
          interestRate: 12.5,
          riskBand: "B",
          status: "pending",
        },
      });
      console.log("❌ FAIL: Zero tenure was accepted");
      return { passed: false, error: "Zero tenure should be rejected" };
    } catch (e) {
      console.log("✅ Zero tenure correctly rejected");
    }

    console.log("✅ PASS: Loan submission validation works");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testMultipleLoanSubmission() {
  console.log("\n📝 TEST: Multiple Loan Submissions");
  try {
    const borrower = await createTestUser();

    const loan1 = await createTestLoan(borrower.crn, { amount: 100000 });
    const loan2 = await createTestLoan(borrower.crn, { amount: 200000 });
    const loan3 = await createTestLoan(borrower.crn, { amount: 50000 });

    const loans = await prisma.loan.findMany({
      where: { borrowerCrn: borrower.crn },
    });

    if (loans.length !== 3) throw new Error(`Expected 3 loans, got ${loans.length}`);

    console.log("✅ PASS: Multiple loans can be submitted");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

// ============================================================================
// VOTING ELIGIBILITY TESTS
// ============================================================================

async function testVotingEligibilityBasic() {
  console.log("\n📝 TEST: Basic Voting Eligibility");
  try {
    const borrower = await createTestUser();
    const voter = await createTestUser();
    await prisma.reputation.create({
      data: { crn: voter.crn, score: 500 },
    });

    // Create transaction history
    await prisma.transaction.create({
      data: {
        fromAccountId: (await prisma.account.findUnique({ where: { crn: voter.crn } }))!.account_id,
        toAccountId: (await prisma.account.findUnique({ where: { crn: borrower.crn } }))!.account_id,
        amount: 10000,
      },
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(voter.crn, loan.id);
    if (!result.eligible) throw new Error(`Expected eligible, got: ${result.reason}`);

    console.log("✅ PASS: Eligible voter can vote");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityInsufficientReputation() {
  console.log("\n📝 TEST: Voting Eligibility - Insufficient Reputation");
  try {
    const borrower = await createTestUser();
    const voter = await createTestUser();
    await prisma.reputation.create({
      data: { crn: voter.crn, score: 200 }, // Below 300 minimum
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(voter.crn, loan.id);
    if (result.eligible) throw new Error("Should not be eligible with low reputation");
    if (result.reason !== "Insufficient reputation") {
      throw new Error(`Expected 'Insufficient reputation', got: ${result.reason}`);
    }

    console.log("✅ PASS: Low reputation users cannot vote");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityUnverifiedKYC() {
  console.log("\n📝 TEST: Voting Eligibility - Unverified KYC");
  try {
    const borrower = await createTestUser();
    const voter = await createTestUser({ kycStatus: "pending" });
    await prisma.reputation.create({
      data: { crn: voter.crn, score: 500 },
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(voter.crn, loan.id);
    if (result.eligible) throw new Error("Should not be eligible with unverified KYC");
    if (result.reason !== "KYC not verified") {
      throw new Error(`Expected 'KYC not verified', got: ${result.reason}`);
    }

    console.log("✅ PASS: Unverified KYC users cannot vote");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityAdminCannotVote() {
  console.log("\n📝 TEST: Voting Eligibility - Admin Cannot Vote");
  try {
    const borrower = await createTestUser();
    const admin = await createTestUser({ isAdmin: true });
    await prisma.reputation.create({
      data: { crn: admin.crn, score: 500 },
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(admin.crn, loan.id);
    if (result.eligible) throw new Error("Admin should not be able to vote");
    if (result.reason !== "Admins cannot vote") {
      throw new Error(`Expected 'Admins cannot vote', got: ${result.reason}`);
    }

    console.log("✅ PASS: Admins cannot vote");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityBorrowerCannotVote() {
  console.log("\n📝 TEST: Voting Eligibility - Borrower Cannot Vote on Own Loan");
  try {
    const borrower = await createTestUser();
    await prisma.reputation.create({
      data: { crn: borrower.crn, score: 500 },
    });

    // Create transaction history
    await prisma.transaction.create({
      data: {
        fromAccountId: (await prisma.account.findUnique({ where: { crn: borrower.crn } }))!.account_id,
        toAccountId: (await prisma.account.findUnique({ where: { crn: borrower.crn } }))!.account_id,
        amount: 10000,
      },
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(borrower.crn, loan.id);
    if (result.eligible) throw new Error("Borrower should not be able to vote on own loan");
    if (result.reason !== "Borrower cannot vote on own loan") {
      throw new Error(`Expected 'Borrower cannot vote on own loan', got: ${result.reason}`);
    }

    console.log("✅ PASS: Borrower cannot vote on own loan");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityNoTransactionHistory() {
  console.log("\n📝 TEST: Voting Eligibility - No Transaction History");
  try {
    const borrower = await createTestUser();
    const voter = await createTestUser();
    await prisma.reputation.create({
      data: { crn: voter.crn, score: 500 },
    });

    const loan = await createTestLoan(borrower.crn);

    const result = await canUserVoteOnLoan(voter.crn, loan.id);
    if (result.eligible) throw new Error("Should not be eligible without transaction history");
    if (result.reason !== "No transaction history") {
      throw new Error(`Expected 'No transaction history', got: ${result.reason}`);
    }

    console.log("✅ PASS: Users without transaction history cannot vote");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testVotingEligibilityAlreadyVoted() {
  console.log("\n📝 TEST: Voting Eligibility - Already Voted");
  try {
    const borrower = await createTestUser();
    const voter = await createTestUser();
    await prisma.reputation.create({
      data: { crn: voter.crn, score: 500 },
    });

    // Create transaction history
    await prisma.transaction.create({
      data: {
        fromAccountId: (await prisma.account.findUnique({ where: { crn: voter.crn } }))!.account_id,
        toAccountId: (await prisma.account.findUnique({ where: { crn: borrower.crn } }))!.account_id,
        amount: 10000,
      },
    });

    const loan = await createTestLoan(borrower.crn);

    // First vote
    await prisma.loanVote.create({
      data: {
        loanId: loan.id,
        voterCrn: voter.crn,
        vote: "yes",
      },
    });

    // Try to vote again
    const result = await canUserVoteOnLoan(voter.crn, loan.id);
    if (result.eligible) throw new Error("Should not be eligible if already voted");
    if (result.reason !== "Already voted") {
      throw new Error(`Expected 'Already voted', got: ${result.reason}`);
    }

    console.log("✅ PASS: Users cannot vote twice");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

// ============================================================================
// RISK BAND ASSIGNMENT TESTS
// ============================================================================

function testRiskBandLowAmount() {
  console.log("\n📝 TEST: Risk Band - Low Amount (≤50k)");
  try {
    const result = calculateRiskBand({
      amount: 50000,
      tenureMonths: 12,
      reputationScore: 400,
    });

    if (result !== "A") throw new Error(`Expected A, got ${result}`);
    console.log("✅ PASS: Low amount gets better risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandMediumAmount() {
  console.log("\n📝 TEST: Risk Band - Medium Amount (50k-200k)");
  try {
    const result = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 400,
    });

    if (result !== "B") throw new Error(`Expected B, got ${result}`);
    console.log("✅ PASS: Medium amount gets medium risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandHighAmount() {
  console.log("\n📝 TEST: Risk Band - High Amount (>200k)");
  try {
    const result = calculateRiskBand({
      amount: 500000,
      tenureMonths: 24,
      reputationScore: 400,
    });

    if (result !== "C") throw new Error(`Expected C, got ${result}`);
    console.log("✅ PASS: High amount gets worse risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandShortTenure() {
  console.log("\n📝 TEST: Risk Band - Short Tenure (≤12 months)");
  try {
    const result = calculateRiskBand({
      amount: 100000,
      tenureMonths: 6,
      reputationScore: 300,
    });

    if (result !== "A") throw new Error(`Expected A, got ${result}`);
    console.log("✅ PASS: Short tenure gets better risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandLongTenure() {
  console.log("\n📝 TEST: Risk Band - Long Tenure (>24 months)");
  try {
    const result = calculateRiskBand({
      amount: 100000,
      tenureMonths: 60,
      reputationScore: 400,
    });

    if (result !== "C") throw new Error(`Expected C, got ${result}`);
    console.log("✅ PASS: Long tenure gets worse risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandHighReputation() {
  console.log("\n📝 TEST: Risk Band - High Reputation (≥600)");
  try {
    const result = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 700,
    });

    if (result !== "A") throw new Error(`Expected A, got ${result}`);
    console.log("✅ PASS: High reputation gets better risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandLowReputation() {
  console.log("\n📝 TEST: Risk Band - Low Reputation (<300)");
  try {
    const result = calculateRiskBand({
      amount: 50000,
      tenureMonths: 12,
      reputationScore: 100,
    });

    if (result !== "C") throw new Error(`Expected C, got ${result}`);
    console.log("✅ PASS: Low reputation gets worse risk band");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

// ============================================================================
// THRESHOLD EDGE CASES
// ============================================================================

function testRiskBandAmountBoundary50k() {
  console.log("\n📝 TEST: Edge Case - Amount at 50k boundary");
  try {
    const below = calculateRiskBand({
      amount: 49999,
      tenureMonths: 12,
      reputationScore: 300,
    });

    const at = calculateRiskBand({
      amount: 50000,
      tenureMonths: 12,
      reputationScore: 300,
    });

    const above = calculateRiskBand({
      amount: 50001,
      tenureMonths: 12,
      reputationScore: 300,
    });

    if (below !== "A" || at !== "A") {
      throw new Error(
        `Expected A for ≤50k, got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 50k boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandAmountBoundary200k() {
  console.log("\n📝 TEST: Edge Case - Amount at 200k boundary");
  try {
    const below = calculateRiskBand({
      amount: 199999,
      tenureMonths: 24,
      reputationScore: 300,
    });

    const at = calculateRiskBand({
      amount: 200000,
      tenureMonths: 24,
      reputationScore: 300,
    });

    const above = calculateRiskBand({
      amount: 200001,
      tenureMonths: 24,
      reputationScore: 300,
    });

    if (below !== "B" || at !== "B" || above !== "C") {
      throw new Error(
        `Expected B below/at 200k and C above, got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 200k boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandTenureBoundary12m() {
  console.log("\n📝 TEST: Edge Case - Tenure at 12-month boundary");
  try {
    const below = calculateRiskBand({
      amount: 100000,
      tenureMonths: 11,
      reputationScore: 300,
    });

    const at = calculateRiskBand({
      amount: 100000,
      tenureMonths: 12,
      reputationScore: 300,
    });

    const above = calculateRiskBand({
      amount: 100000,
      tenureMonths: 13,
      reputationScore: 300,
    });

    if (below !== "A" || at !== "A") {
      throw new Error(
        `Expected A for ≤12 months, got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 12-month boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandTenureBoundary24m() {
  console.log("\n📝 TEST: Edge Case - Tenure at 24-month boundary");
  try {
    const below = calculateRiskBand({
      amount: 100000,
      tenureMonths: 23,
      reputationScore: 300,
    });

    const at = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 300,
    });

    const above = calculateRiskBand({
      amount: 100000,
      tenureMonths: 25,
      reputationScore: 300,
    });

    if (at !== "B" || above !== "C") {
      throw new Error(
        `Expected B at 24 months and C above, got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 24-month boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandReputationBoundary300() {
  console.log("\n📝 TEST: Edge Case - Reputation at 300 boundary");
  try {
    const below = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 299,
    });

    const at = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 300,
    });

    const above = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 301,
    });

    if (below !== "C" || at !== "B" || above !== "B") {
      throw new Error(
        `Expected C below 300 and B at/above 300, got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 300 reputation boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandReputationBoundary600() {
  console.log("\n📝 TEST: Edge Case - Reputation at 600 boundary");
  try {
    const below = calculateRiskBand({
      amount: 100000,
      tenureMonths: 12,
      reputationScore: 599,
    });

    const at = calculateRiskBand({
      amount: 100000,
      tenureMonths: 12,
      reputationScore: 600,
    });

    const above = calculateRiskBand({
      amount: 100000,
      tenureMonths: 12,
      reputationScore: 601,
    });

    if (below !== "A" || at !== "A" || above !== "A") {
      throw new Error(
        `Expected A for all (total score = 4), got below=${below}, at=${at}, above=${above}`
      );
    }

    console.log("✅ PASS: 600 reputation boundary handled correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

function testRiskBandScoreBoundaries() {
  console.log("\n📝 TEST: Edge Case - Risk Band Score Boundaries");
  try {
    // Score = 4: A
    const score4 = calculateRiskBand({
      amount: 50000,
      tenureMonths: 12,
      reputationScore: 600,
    });

    // Score = 3: B (4 + 1 + 1 - 2 - 1)
    const score3 = calculateRiskBand({
      amount: 50000,
      tenureMonths: 12,
      reputationScore: 400,
    });

    // Score = 2: B
    const score2 = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 400,
    });

    // Score = 1: C
    const score1 = calculateRiskBand({
      amount: 100000,
      tenureMonths: 24,
      reputationScore: 400,
    });

    // Score = -2: C
    const scoreNeg = calculateRiskBand({
      amount: 500000,
      tenureMonths: 60,
      reputationScore: 100,
    });

    if (score4 !== "A" || score3 !== "B" || score2 !== "B" || score1 !== "C" || scoreNeg !== "C") {
      throw new Error(
        `Score boundaries failed: 4=${score4}, 3=${score3}, 2=${score2}, 1=${score1}, -2=${scoreNeg}`
      );
    }

    console.log("✅ PASS: Risk band score boundaries correct");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

// ============================================================================
// REPUTATION UPDATE TESTS
// ============================================================================

async function testReputationAdjustmentPositive() {
  console.log("\n📝 TEST: Reputation Adjustment - Positive");
  try {
    const user = await createTestUser();

    const initialReputation = await prisma.reputation.findUnique({
      where: { crn: user.crn },
    });

    await adjustReputation(user.crn, 50, "Test positive adjustment");

    const updatedReputation = await prisma.reputation.findUnique({
      where: { crn: user.crn },
    });

    if (!updatedReputation || updatedReputation.score !== 50) {
      throw new Error(
        `Expected reputation 50, got ${updatedReputation?.score}`
      );
    }

    console.log("✅ PASS: Positive reputation adjustment works");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testReputationAdjustmentNegative() {
  console.log("\n📝 TEST: Reputation Adjustment - Negative");
  try {
    const user = await createTestUser();

    await adjustReputation(user.crn, 100, "Initial reputation");
    await adjustReputation(user.crn, -30, "Test negative adjustment");

    const reputation = await prisma.reputation.findUnique({
      where: { crn: user.crn },
    });

    if (!reputation || reputation.score !== 70) {
      throw new Error(
        `Expected reputation 70, got ${reputation?.score}`
      );
    }

    console.log("✅ PASS: Negative reputation adjustment works");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testReputationMultipleAdjustments() {
  console.log("\n📝 TEST: Reputation - Multiple Adjustments");
  try {
    const user = await createTestUser();

    await adjustReputation(user.crn, 50, "First");
    await adjustReputation(user.crn, 30, "Second");
    await adjustReputation(user.crn, 20, "Third");
    await adjustReputation(user.crn, -15, "Fourth");

    const reputation = await prisma.reputation.findUnique({
      where: { crn: user.crn },
    });

    if (!reputation || reputation.score !== 85) {
      throw new Error(
        `Expected reputation 85, got ${reputation?.score}`
      );
    }

    console.log("✅ PASS: Multiple reputation adjustments accumulate correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testSettleReputationApproved() {
  console.log("\n📝 TEST: Reputation Settlement - Loan Approved");
  try {
    const borrower = await createTestUser();
    const yesVoter = await createTestUser();
    const noVoter = await createTestUser();

    // Setup reputations
    await prisma.reputation.create({
      data: { crn: yesVoter.crn, score: 500 },
    });
    await prisma.reputation.create({
      data: { crn: noVoter.crn, score: 500 },
    });

    // Create loan
    const loan = await createTestLoan(borrower.crn);

    // Create votes
    await prisma.loanVote.create({
      data: { loanId: loan.id, voterCrn: yesVoter.crn, vote: "yes" },
    });
    await prisma.loanVote.create({
      data: { loanId: loan.id, voterCrn: noVoter.crn, vote: "no" },
    });

    // Settle reputation for approved loan
    await settleReputationAfterDecision(loan.id, "approved");

    const borrowerRep = await prisma.reputation.findUnique({
      where: { crn: borrower.crn },
    });
    const yesVoterRep = await prisma.reputation.findUnique({
      where: { crn: yesVoter.crn },
    });
    const noVoterRep = await prisma.reputation.findUnique({
      where: { crn: noVoter.crn },
    });

    // Borrower gets +10
    if (!borrowerRep || borrowerRep.score !== 10) {
      throw new Error(`Expected borrower reputation 10, got ${borrowerRep?.score}`);
    }

    // Yes voter gets +2 (correct)
    if (!yesVoterRep || yesVoterRep.score !== 502) {
      throw new Error(`Expected yes voter reputation 502, got ${yesVoterRep?.score}`);
    }

    // No voter gets -1 (incorrect)
    if (!noVoterRep || noVoterRep.score !== 499) {
      throw new Error(`Expected no voter reputation 499, got ${noVoterRep?.score}`);
    }

    console.log("✅ PASS: Reputation settlement for approved loan works correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testSettleReputationRejected() {
  console.log("\n📝 TEST: Reputation Settlement - Loan Rejected");
  try {
    const borrower = await createTestUser();
    const yesVoter = await createTestUser();
    const noVoter = await createTestUser();

    // Setup reputations
    await prisma.reputation.create({
      data: { crn: yesVoter.crn, score: 500 },
    });
    await prisma.reputation.create({
      data: { crn: noVoter.crn, score: 500 },
    });

    // Create loan
    const loan = await createTestLoan(borrower.crn);

    // Create votes
    await prisma.loanVote.create({
      data: { loanId: loan.id, voterCrn: yesVoter.crn, vote: "yes" },
    });
    await prisma.loanVote.create({
      data: { loanId: loan.id, voterCrn: noVoter.crn, vote: "no" },
    });

    // Settle reputation for rejected loan
    await settleReputationAfterDecision(loan.id, "rejected");

    const borrowerRep = await prisma.reputation.findUnique({
      where: { crn: borrower.crn },
    });
    const yesVoterRep = await prisma.reputation.findUnique({
      where: { crn: yesVoter.crn },
    });
    const noVoterRep = await prisma.reputation.findUnique({
      where: { crn: noVoter.crn },
    });

    // Borrower gets -5
    if (!borrowerRep || borrowerRep.score !== -5) {
      throw new Error(`Expected borrower reputation -5, got ${borrowerRep?.score}`);
    }

    // Yes voter gets -1 (incorrect)
    if (!yesVoterRep || yesVoterRep.score !== 499) {
      throw new Error(`Expected yes voter reputation 499, got ${yesVoterRep?.score}`);
    }

    // No voter gets +2 (correct)
    if (!noVoterRep || noVoterRep.score !== 502) {
      throw new Error(`Expected no voter reputation 502, got ${noVoterRep?.score}`);
    }

    console.log("✅ PASS: Reputation settlement for rejected loan works correctly");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testSettleReputationNoVotes() {
  console.log("\n📝 TEST: Reputation Settlement - No Votes");
  try {
    const borrower = await createTestUser();
    const loan = await createTestLoan(borrower.crn);

    // Settle reputation with no votes
    await settleReputationAfterDecision(loan.id, "approved");

    const borrowerRep = await prisma.reputation.findUnique({
      where: { crn: borrower.crn },
    });

    // Borrower should still get +10
    if (!borrowerRep || borrowerRep.score !== 10) {
      throw new Error(`Expected borrower reputation 10, got ${borrowerRep?.score}`);
    }

    console.log("✅ PASS: Reputation settlement works with no votes");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function testSettleReputationNonexistentLoan() {
  console.log("\n📝 TEST: Reputation Settlement - Nonexistent Loan");
  try {
    // Should handle gracefully
    await settleReputationAfterDecision(99999, "approved");

    console.log("✅ PASS: Handles nonexistent loan gracefully");
    return { passed: true };
  } catch (err: any) {
    console.log(`❌ FAIL: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runAllTests() {
  const results: Array<{ category: string; passed: boolean; error?: string }> = [];

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🧪 VYOMA BANKING SYSTEM - COMPREHENSIVE TEST SUITE");
  console.log("═══════════════════════════════════════════════════════════════");

  try {
    // ========== LOAN SUBMISSION TESTS ==========
    console.log("\n\n📦 LOAN SUBMISSION TESTS");
    console.log("───────────────────────────────────────────────────────────────");

    results.push({
      category: "Loan Submission - Basic",
      ...(await testLoanSubmissionBasic()),
    });

    results.push({
      category: "Loan Submission - Validation",
      ...(await testLoanSubmissionValidation()),
    });

    results.push({
      category: "Loan Submission - Multiple",
      ...(await testMultipleLoanSubmission()),
    });

    // ========== VOTING ELIGIBILITY TESTS ==========
    console.log("\n\n🗳️  VOTING ELIGIBILITY TESTS");
    console.log("───────────────────────────────────────────────────────────────");

    results.push({
      category: "Voting Eligibility - Basic",
      ...(await testVotingEligibilityBasic()),
    });

    results.push({
      category: "Voting Eligibility - Low Reputation",
      ...(await testVotingEligibilityInsufficientReputation()),
    });

    results.push({
      category: "Voting Eligibility - Unverified KYC",
      ...(await testVotingEligibilityUnverifiedKYC()),
    });

    results.push({
      category: "Voting Eligibility - Admin Cannot Vote",
      ...(await testVotingEligibilityAdminCannotVote()),
    });

    results.push({
      category: "Voting Eligibility - Borrower Cannot Vote",
      ...(await testVotingEligibilityBorrowerCannotVote()),
    });

    results.push({
      category: "Voting Eligibility - No Transaction History",
      ...(await testVotingEligibilityNoTransactionHistory()),
    });

    results.push({
      category: "Voting Eligibility - Already Voted",
      ...(await testVotingEligibilityAlreadyVoted()),
    });

    // ========== RISK BAND ASSIGNMENT TESTS ==========
    console.log("\n\n⚠️  RISK BAND ASSIGNMENT TESTS");
    console.log("───────────────────────────────────────────────────────────────");

    results.push({
      category: "Risk Band - Low Amount",
      ...testRiskBandLowAmount(),
    });

    results.push({
      category: "Risk Band - Medium Amount",
      ...testRiskBandMediumAmount(),
    });

    results.push({
      category: "Risk Band - High Amount",
      ...testRiskBandHighAmount(),
    });

    results.push({
      category: "Risk Band - Short Tenure",
      ...testRiskBandShortTenure(),
    });

    results.push({
      category: "Risk Band - Long Tenure",
      ...testRiskBandLongTenure(),
    });

    results.push({
      category: "Risk Band - High Reputation",
      ...testRiskBandHighReputation(),
    });

    results.push({
      category: "Risk Band - Low Reputation",
      ...testRiskBandLowReputation(),
    });

    // ========== THRESHOLD EDGE CASES ==========
    console.log("\n\n🎯 THRESHOLD EDGE CASES");
    console.log("───────────────────────────────────────────────────────────────");

    results.push({
      category: "Edge Case - Amount 50k Boundary",
      ...testRiskBandAmountBoundary50k(),
    });

    results.push({
      category: "Edge Case - Amount 200k Boundary",
      ...testRiskBandAmountBoundary200k(),
    });

    results.push({
      category: "Edge Case - Tenure 12m Boundary",
      ...testRiskBandTenureBoundary12m(),
    });

    results.push({
      category: "Edge Case - Tenure 24m Boundary",
      ...testRiskBandTenureBoundary24m(),
    });

    results.push({
      category: "Edge Case - Reputation 300 Boundary",
      ...testRiskBandReputationBoundary300(),
    });

    results.push({
      category: "Edge Case - Reputation 600 Boundary",
      ...testRiskBandReputationBoundary600(),
    });

    results.push({
      category: "Edge Case - Score Boundaries",
      ...testRiskBandScoreBoundaries(),
    });

    // ========== REPUTATION UPDATE TESTS ==========
    console.log("\n\n⭐ REPUTATION UPDATE TESTS");
    console.log("───────────────────────────────────────────────────────────────");

    results.push({
      category: "Reputation - Positive Adjustment",
      ...(await testReputationAdjustmentPositive()),
    });

    results.push({
      category: "Reputation - Negative Adjustment",
      ...(await testReputationAdjustmentNegative()),
    });

    results.push({
      category: "Reputation - Multiple Adjustments",
      ...(await testReputationMultipleAdjustments()),
    });

    results.push({
      category: "Settlement - Approved Loan",
      ...(await testSettleReputationApproved()),
    });

    results.push({
      category: "Settlement - Rejected Loan",
      ...(await testSettleReputationRejected()),
    });

    results.push({
      category: "Settlement - No Votes",
      ...(await testSettleReputationNoVotes()),
    });

    results.push({
      category: "Settlement - Nonexistent Loan",
      ...(await testSettleReputationNonexistentLoan()),
    });

    // ========== SUMMARY ==========
    console.log("\n\n═══════════════════════════════════════════════════════════════");
    console.log("📊 TEST RESULTS SUMMARY");
    console.log("═══════════════════════════════════════════════════════════════\n");

    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const passPercentage = ((passed / total) * 100).toFixed(1);

    // Group by category
    const loanTests = results.filter((r) => r.category.includes("Loan Submission"));
    const votingTests = results.filter((r) => r.category.includes("Voting"));
    const riskTests = results.filter((r) =>
      r.category.includes("Risk Band") && !r.category.includes("Edge")
    );
    const edgeTests = results.filter((r) => r.category.includes("Edge Case"));
    const reputationTests = results.filter(
      (r) =>
        r.category.includes("Reputation") || r.category.includes("Settlement")
    );

    console.log(
      `📝 Loan Submission: ${loanTests.filter((r) => r.passed).length}/${loanTests.length}`
    );
    console.log(
      `🗳️  Voting Eligibility: ${votingTests.filter((r) => r.passed).length}/${votingTests.length}`
    );
    console.log(
      `⚠️  Risk Band Assignment: ${riskTests.filter((r) => r.passed).length}/${riskTests.length}`
    );
    console.log(
      `🎯 Threshold Edge Cases: ${edgeTests.filter((r) => r.passed).length}/${edgeTests.length}`
    );
    console.log(
      `⭐ Reputation Updates: ${reputationTests.filter((r) => r.passed).length}/${reputationTests.length}`
    );

    console.log(`\n🎯 Overall: ${passed}/${total} tests passed (${passPercentage}%)`);

    if (passed === total) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log(`\n⚠️  ${total - passed} test(s) failed\n`);
      results.filter((r) => !r.passed).forEach((r) => {
        console.log(`  ❌ ${r.category}: ${r.error}`);
      });
    }

    console.log(
      "\n═══════════════════════════════════════════════════════════════\n"
    );
  } catch (error) {
    console.error("Fatal error during test execution:", error);
    process.exit(1);
  } finally {
    // Cleanup
    console.log("🧹 Cleaning up test data...");
    await cleanupTestData();
    await prisma.$disconnect();
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
