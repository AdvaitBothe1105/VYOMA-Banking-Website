import React from "react";

const Features = () => {
  return (
    <div>
      <div
        className="bg-[#edeae7] py-24 sm:py-32 features-section"
        data-anim-target="feat-sec"
        id="features-section"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 feat_txt_wrap">
          <div
            className="mx-auto max-w-6xl lg:text-center feat-sec"
            id="feat-sec"
          >
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Features of VYOMA Savings Account!!
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Saving money in the VYOMA digital savings account can help you
              maximize your benefits. VYOMA Bank is India’s first new-age
              financial company to introduce a no-minimum balance digital
              savings account. VYOMA digital savings account is available in 2
              variants, each catering to specific spending habits of customers.
              With zero-contact and video-KYC benefits, open a VYOMA digital
              savings account anytime, and from anywhere. Avail the best online
              banking solutions in just a few clicks. Open an online savings
              account with us and explore our wide range of offerings now! Take
              a look.
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
                  title: "Hassle-Free Banking",
                  description:
                    "Keep a low balance to continue benefiting from the full range of services, stress-free!",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                    />
                  ),
                },
                {
                  title: "Go Digital, Pay Zero!!",
                  description:
                    "Enjoy the convenience of a virtual debit card without any fees!",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                  ),
                },
                {
                  title: "Transfer Money Anytime, Anywhere—No Fees Attached",
                  description:
                    "Enjoy seamless transfers via IMPS, NEFT, RTGS, or UPI without any extra charges!",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  ),
                },
                {
                  title: "Effortless Account Management",
                  description:
                    "We offer a 24/7 Account Management facility through our website.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
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
      </div>
    </div>
  );
};

export default Features;
