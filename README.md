# Vyoma Bank – Modern Digital Banking Platform

Vyoma Bank is a full-stack digital banking platform built with **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM**, and **Supabase/PostgreSQL**.  
It offers a seamless, secure, and modern banking experience with features like digital onboarding, fund transfers, loan management, investments, and more.

---

## 🚀 Features

### 🏦 Account & Onboarding
- **User Registration & KYC:**  
  - Multi-step registration with online KYC (Aadhaar & PAN upload).
  - Unique CRN (Customer Reference Number) generation.
- **Secure Login:**  
  - Sign in with CRN or Card Number.
  - Password-based authentication.
- **Auth:** Custom authentication using JWT tokens (stateless, secure API access)

### 💸 Banking Operations
- **Account Dashboard:**  
  - View account summary, assets, and liabilities.
  - Recent transactions with download statement option.
- **Fund Transfer:**  
  - Transfer funds to any account.
  - Add/manage beneficiaries.
  - One-time transfers and transfer limits.
- **Transaction History:**  
  - View and filter recent transactions.

### 📰 News & Insights
- **Market Sentiment News Carousel:**  
  - Live financial news with sentiment analysis and ticker highlights, powered by AlphaVantage API.

### 🏠 Loans
- **Home Loans:**  
  - Dedicated section with features, benefits, and application CTA.
- **Car Loans:**  
  - Dedicated section with features, benefits, and application CTA.
- **Personal Loans:**  
  - Quick approval, competitive rates.

### 📈 Investments
- **Mutual Funds:**  
  - Explore and apply for mutual funds.
- **Demat Account:**  
  - Open and manage demat account for stocks and securities.

### 🌟 Digital Banking Features
- **Minimal minimum Balance Account**
- **Virtual Debit Card**
- **24/7 Account Management**
- **No/Minimal Fees**
- **Seamless IMPS/NEFT/RTGS/UPI Transfers**

### 📰 News & Insights
- **Market Sentiment News Carousel:**  
  - Live news with sentiment analysis and ticker highlights.

### 🔒 Security
- **Multi-factor Authentication**
- **Secure document upload**
- **Data encryption and privacy**

### 📱 Responsive UI
- **Modern, mobile-friendly design**
- **Animated carousels, and more**

---

## 🗂️ Project Structure

```
vyoma/
├── app/
│   ├── (users)/
│   │   ├── page.tsx           # Landing page
│   │   ├── signIn/            # Login & registration
│   │   ├── loans/             # Loans pages
│   │   └── ...                # Other user routes
│   ├── (loggedIn)/
│   │   ├── dashboard/         # User dashboard
│   │   ├── fund/              # Fund transfer
│   │   └── ...                # Authenticated routes
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Features.tsx
│   │   ├── CtaSec.tsx
│   │   ├── NewsSection.tsx
│   │   ├── HomeLoanSection.tsx
│   │   ├── CarLoanSection.tsx
│   │   ├── Login.tsx
│   │   ├── UserInfo.tsx
│   │   ├── OnlineKYC.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FundPage.tsx
│   │   ├── MainFund.tsx
│   │   ├── RecTransaction.tsx
│   │   ├── InvestInfo.tsx
│   │   └── ... (other UI components)
│   ├── globals.css
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── lib/
│   ├── prisma.ts
│   ├── supabaseClient.ts
│   └── generated/prisma/
├── public/
│   ├── Logo.png
│   ├── Assets/
│   └── ...
├── next.config.ts
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom (with CRN/Card Number), JWT
- **File Storage:** Supabase Storage (for KYC docs)
- **APIs:** AlphaVantage (for news), others as needed

---

## 🏁 Getting Started

### 1. **Clone the Repo**
```sh
git clone https://github.com/AdvaitBothe1105/VYOMA-Banking-Website.git
cd vyoma
```

### 2. **Install Dependencies**
```sh
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root:

```
DATABASE_URL=postgresql://<your-supabase-connection-string>
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key
JWT_SECRET=your_jwt_secret
```

### 4. **Push Prisma Schema**
```sh
npx prisma generate
npx prisma db push
```

### 5. **Run Locally**
```sh
npm run dev
```
App will be available at [http://localhost:3000](http://localhost:3000)

---

### **Database**
- Uses Supabase (PostgreSQL) – free tier is sufficient for development and small projects.

---

## 📚 Key Components & Pages

- **`/components/Navbar.tsx`** – Responsive navigation bar with logo and auth buttons.
- **`/components/Footer.tsx`** – Informative footer with contact and quick links.
- **`/components/Dashboard.tsx`** – User dashboard with summary, transactions, loans, deposits, investments.
- **`/components/FundPage.tsx`** – Fund transfer, beneficiaries, limits, and one-time transfers.
- **`/components/NewsSection.tsx`** – Market news carousel with sentiment badges.
- **`/components/Features.tsx`** – Feature highlights for savings account.
- **`/components/CtaSec.tsx`** – Call-to-action section with feature icons.
- **`/components/HomeLoanSection.tsx`** – Home loan info and features.
- **`/components/CarLoanSection.tsx`** – Car loan info and features.
- **`/components/Login.tsx`** – Login and registration UI.
- **`/components/UserInfo.tsx`** – User info collection for onboarding.
- **`/components/OnlineKYC.tsx`** – Online KYC document upload.

---

## 📝 Prisma Schema (Key Models)

```prisma
model User {
  id            String   @id @default(uuid())
  crn           String   @unique
  name          String
  email         String   
  password      String
  phone         String
  dob           DateTime
  address       String
  city          String
  state         String
  pincode       String
  aadharUrl     String
  panUrl        String
  accountType   String
  agree         Boolean
  createdAt     DateTime @default(now())
  accounts      Account[]
}

model Account {
  account_id     Int     @id @default(autoincrement())
  crn            String @unique
  accountType    String
  account_number String @unique
  ifsc_code      String @default("VYOMAIN0000001")
  balance        Decimal @default(3000.00)
  name           String
  created_at     DateTime @default(now())
  user           User @relation(fields: [crn], references: [crn], onDelete: Cascade)
  transactionsFrom Transaction[] @relation("FromAccount")
  transactionsTo   Transaction[] @relation("ToAccount")
}

model Transaction {
  id              Int      @id @default(autoincrement())
  fromAccountId   Int
  toAccountId     Int
  amount          Decimal
  remarks         String?
  createdAt       DateTime @default(now())
  fromAccount     Account  @relation("FromAccount", fields: [fromAccountId], references: [account_id])
  toAccount       Account  @relation("ToAccount", fields: [toAccountId], references: [account_id])
}
```

---

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

**Vyoma Bank – Secure. Fast. Modern. Your digital banking, reimagined.**