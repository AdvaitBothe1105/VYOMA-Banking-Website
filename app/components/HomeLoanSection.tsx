import Image from "next/image";

const homeLoanFeatures = [
  {
    icon: (
      <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" clipRule="evenodd" />
      </svg>
    ),
    title: "Low Interest Rates",
    desc: "Enjoy some of the most competitive interest rates in the market, keeping your monthly payments affordable.",
  },
  {
    icon: (
      <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
    title: "Flexible Tenure Options",
    desc: "Choose a loan tenure that works for you—short-term or long-term, we’ve got you covered.",
  },
  {
    icon: (
      <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
        <path fillRule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clipRule="evenodd" />
      </svg>
    ),
    title: "Quick & Transparent Approval",
    desc: "Our streamlined application process ensures fast approvals with full transparency at every stage.",
  },
];

export default function HomeLoanSection() {
  return (
    <div className="overflow-hidden bg-[#edeae7] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 img-wrap">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unlock Your Dream Home!</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We help make your homeownership dreams a reality with personalized loan solutions designed to meet your unique needs. Whether you're buying your first home, upgrading to a larger space, or building the home you've always wanted, our expert team is here to guide you every step of the way. With flexible loan options, competitive interest rates, and a smooth application process, we ensure that owning your dream home is not only attainable but also stress-free.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {homeLoanFeatures.map((f) => (
                  <div className="relative pl-9" key={f.title}>
                    <dt className="inline font-semibold text-gray-900">{f.icon}{f.title}</dt>{" "}
                    <dd className="inline">{f.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/Home.png"
            alt="Product screenshot"
            className="w-[68rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[47rem] md:-ml-4 lg:-ml-0 animated-img"
            width={900}
            height={500}
            priority
          />
        </div>
      </div>
    </div>
  );
}