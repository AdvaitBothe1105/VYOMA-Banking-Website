# 🏦 Vyoma Bank

**Hybrid Digital Banking Platform with Blockchain-Backed Settlement**

Vyoma Bank is a **research-driven, full-stack digital banking platform** that combines traditional account-based banking with **blockchain-backed settlement and auditability** using a **custodial ERC-20 token model**.

Unlike wallet-first crypto applications, Vyoma preserves a **familiar banking UX** (accounts, balances, transfers) while leveraging blockchain only where it adds **real technical value**:
**settlement, ownership enforcement, auditability, and verification**.

---

## 📌 Key Design Philosophy

> **Blockchain where trust must be removed.
> Centralization where accountability is required.**

Vyoma is **not a DeFi app** and **not a DAO**.
It is a **hybrid banking architecture** designed for realism, compliance, and academic research.

---

## ✨ Core Highlights

* Custodial blockchain wallet per user (server-managed)
* ERC-20 token–based settlement (VyomaToken / VYO)
* Blockchain as **source of truth for balances**
* Database as **banking ledger mirror**
* Immutable on-chain audit trails
* Privacy-preserving KYC verification on blockchain
* Gas abstraction (users never manage ETH)
* Designed for scalability, safety, and compliance

---

## 🛠 Technology Stack

### Frontend

* **Next.js 15 (App Router)**
* **React 19**
* **TypeScript**
* Tailwind CSS
* Zustand (state management)
* React Hook Form + Zod (validation)

### Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL
* JWT authentication (HTTP-only cookies)
* bcrypt password hashing

### Blockchain Layer

* Solidity `0.8.20`
* Hardhat (local blockchain simulation)
* Ethers.js v6
* ERC-20 standard (VyomaToken)
* Custom audit & KYC contracts

### External Services

* Supabase Storage (KYC documents)
* Alpha Vantage API (financial news & sentiment)

---

## 🧱 System Architecture (High-Level)

```
Frontend (Next.js)
        ↓
Backend APIs (Next.js)
        ↓
PostgreSQL (Prisma ORM)
        ↓
Blockchain (Hardhat / Sepolia)
```

---

## 🔐 Authentication & User Management

* Secure user registration & login
* JWT-based authentication
* HTTP-only cookies
* Middleware-protected routes
* Role-based access (user / admin)

---

## 👤 User Registration & Custodial Wallet Creation

During registration:

1. User submits personal details + KYC documents
2. Backend generates a **blockchain wallet**
3. Wallet private key is **AES-256-GCM encrypted**
4. Wallet address stored in database
5. User never sees or manages the wallet
6. Initial VYO tokens minted
7. ETH funded for gas (custodial abstraction)
8. Bank account created separately

This mirrors **real-world bank & exchange custody models**.

---

## 🏦 Account-Based Banking Model

* Each user may have **multiple bank accounts**
* All accounts map to **one custodial wallet**
* Account balances represent **internal banking segregation**
* Wallet balance represents **total on-chain ownership**

This allows:

* Savings / Current / DEMAT separation
* Traditional banking UX
* Blockchain-backed settlement

---

## 💸 ERC-20 Based Fund Transfers

All fund transfers follow this strict flow:

1. Validate banking rules (limits, minimum balance)
2. Check **on-chain VYO balance** (source of truth)
3. Verify ETH gas availability
4. Execute ERC-20 transfer on blockchain
5. Update database **after chain success**
6. Optionally anchor audit hash on-chain (non-blocking)

### Key Properties

* Blockchain-enforced settlement
* No double-spending
* DB updates only after successful settlement
* Audit layer failures never block transfers

---

## 📜 Transaction Management & Auditability

Each transaction records:

* Sender & receiver accounts
* Amount & metadata
* ERC-20 transaction hash
* Optional audit hash

### Audit Anchoring (TxHashStore)

* Stores transaction fingerprints on-chain
* Enables independent verification
* Non-blocking & best-effort
* Failure-tolerant by design

---

## 🪙 VyomaToken (VYO)

### What It Is

* ERC-20 compliant token
* Minted only by Vyoma Bank (owner)
* Used exclusively for internal settlement

### What It Is Not

* Not a speculative cryptocurrency
* Not publicly tradable
* Not user-managed

### Why It Exists

1. **On-chain settlement**
2. **Cryptographic ownership enforcement**
3. **Auditability & immutability**
4. **Future extensibility (DeFi, governance, loans)**

---

## 🧾 KYC Architecture (Privacy-Preserving)

### Off-Chain

* Aadhaar & PAN stored securely in Supabase
* Documents never stored on-chain

### On-Chain (KYCRegistry)

* Cryptographic hash of KYC metadata
* Wallet address
* Verifier address
* Timestamp

### Database

* Stores only KYC status (`pending | verified`)
* Used for UI gating & access control

### Key Guarantees

* ❌ No PII on-chain
* ✅ Immutable verification proof
* ✅ Verifier accountability
* ✅ Audit-ready compliance model

---

## 🛡 Security Features

| Layer          | Protection              |
| -------------- | ----------------------- |
| Wallet custody | Encrypted private keys  |
| Authentication | JWT + HTTP-only cookies |
| Passwords      | bcrypt hashing          |
| Transfers      | Blockchain-enforced     |
| DB consistency | Read-after-write        |
| Audit          | Immutable hashes        |
| Gas            | Custodial abstraction   |
| Access         | Role-based control      |

---

## 🗄 Database Schema (Simplified)

### User

* Identity & KYC metadata
* Blockchain wallet reference
* Encrypted private key
* Admin role flag

### Account

* Banking ledger (authoritative UX layer)
* IFSC, account number, balance

### Transaction

* Transfer metadata
* Blockchain transaction hash
* Optional audit hash

---

## 📰 Financial News & Market Sentiment

* Integrated Alpha Vantage API
* Real-time financial news
* Sentiment analysis (bullish / bearish / neutral)
* Responsive UI carousel

---

## 🔧 Environment Variables

### Required

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ALPHA_VANTAGE_KEY=
MASTER_WALLET_ENCRYPTION_KEY=
```

### Blockchain (Local / Optional Testnet)

```env
LOCAL_RPC_URL=http://127.0.0.1:8545
SEPOLIA_RPC_URL=
WALLET_PRIVATE_KEY=
VYO_TOKEN_ADDRESS=
TX_HASH_STORE_ADDRESS=
KYC_REGISTRY_ADDRESS=
```

---

## 🚀 Development Commands

```bash
npm install
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start prod server

npx prisma migrate dev
npx prisma studio

npx hardhat node
npx hardhat compile
npx hardhat run scripts/deploy-*.js --network localhost
```

---

## 🧪 Testing & Reliability

* Deterministic local blockchain (Hardhat)
* Mock users & wallets
* Failure-tolerant blockchain writes
* Admin resync & reconciliation tools
* Wallet health checks

---

## 🎓 Academic & R&D Value

Vyoma demonstrates:

* Selective decentralization
* Hybrid trust architecture
* Practical blockchain integration
* Compliance-aware system design
* Realistic banking workflows

This makes it suitable for:

* University research projects
* Architecture studies
* Blockchain systems evaluation
* Fintech experimentation

---

## 🔮 Future Scope (Not Implemented Yet)

* Loan advisory voting system
* Risk scoring engines
* DAO simulations (research only)
* Advanced reconciliation
* Cross-chain settlement experiments

---

## 📄 License

This project is developed for **educational & research purposes**.

---

### ✨ Final Note

> Vyoma is not “blockchain for the sake of blockchain.”
> It is **engineering-driven decentralization**, applied where it matters.

---
