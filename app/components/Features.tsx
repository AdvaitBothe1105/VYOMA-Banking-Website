import React from "react";

const Features = () => {
  return (
    <div>
      <div
        className="relative bg-[#edeae7] pt-24 pb-32 sm:pt-32 sm:pb-40 features-section"
        data-anim-target="feat-sec"
        id="features-section"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 feat_txt_wrap">
          <div
            className="mx-auto max-w-6xl lg:text-center feat-sec"
            id="feat-sec"
          >
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose VYOMA?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              VYOMA combines traditional banking with blockchain technology.
              Open a digital savings account with online KYC, manage
              beneficiaries, transfer funds with zero fees, apply for loans
              governed by community voting, and earn VYO tokens — all from a
              single secure platform.
            </p>
          </div>
          <div
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl sing-wrap"
            data-anim-target="anim-sing-feat"
            id="sing-feat"
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16 anim-sing-feat">
              {[
                {
                  title: "On-Chain KYC Verification",
                  description:
                    "Submit Aadhaar & PAN online. Once verified, your KYC proof is attested on the blockchain via the KYC Registry smart contract — immutable and tamper-proof.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  ),
                },
                {
                  title: "Community-Governed Loans",
                  description:
                    "Loan decisions are made by the community. Eligible users with 300+ reputation and verified KYC vote Yes, No, or Abstain on every application.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  ),
                },
                {
                  title: "Deposits & Investments",
                  description:
                    "Grow your wealth with Fixed Deposits, Recurring Deposits, NPS, DEMAT accounts, and Mutual Funds — all managed from your dashboard.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    />
                  ),
                },
                {
                  title: "Reputation-Based Risk Scoring",
                  description:
                    "Your reputation score (starting at 300) evolves with your activity — correct votes earn points, while loan outcomes and participation shape your risk band.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  ),
                },
              ].map((feature, idx) => (
                <div key={idx} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#46494c]">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </svg>
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Features;
