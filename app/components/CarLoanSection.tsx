import Image from "next/image";

const carLoanFeatures = [
  {
    icon: (
      <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" clipRule="evenodd" />
      </svg>
    ),
    title: "Quick Loan Approval",
    desc: "Fast-track your car purchase with our hassle-free, quick approval process—so you can drive off sooner.",
  },
  {
    icon: (
      <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
        <path fillRule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clipRule="evenodd" />
      </svg>
    ),
    title: "No Hidden Charges",
    desc: "Complete transparency with no hidden costs or charges, ensuring peace of mind throughout the loan term.",
  },
];

export default function CarLoanSection() {
  return (
    <div className="overflow-hidden bg-[#fff] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:grid-flow-col-dense">
          <div className="lg:pr-8 lg:pt-4">
            <Image
              src="/Car.png"
              alt="Product screenshot"
              className="slide-in-right w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[47rem] lg:-ml-[40%]"
              width={900}
              height={500}
              priority
            />
          </div>
          <div className="lg:pl-8 lg:pt-4">
            <div className="slide-in-bottom lg:max-w-lg">
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Road to a New Ride Starts Here</p>
              <p className="mt-3 text-lg leading-8 text-gray-600">
                Fast, flexible, and affordable car loans tailored to suit your needs, making your dream car more accessible than ever. Whether you're eyeing a brand-new model or a pre-owned vehicle, our car loans offer competitive interest rates, minimal paperwork, and quick approvals. With a range of repayment options and financing up to 100%, we make the journey to owning your car as smooth as the drive itself. Apply today and hit the road with confidence!
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {carLoanFeatures.map((f) => (
                  <div className="relative pl-9" key={f.title}>
                    <dt className="inline font-semibold text-gray-900">{f.icon}{f.title}</dt>{" "}
                    <dd className="inline">{f.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}