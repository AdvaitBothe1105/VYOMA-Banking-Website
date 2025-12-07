import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Banklio - Effortless Finance for a Smarter Future",
  description: "Track expenses, optimize budgets, and grow wealth with AI-driven insights—secure and seamless finance solutions in one platform.",
};

export default function BanklioLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Trust & Partners */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[oklch(0.22_0.01_56.04)] via-[oklch(0.25_0.01_56.04)] to-background">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Effortless Finance for a Smarter Future
              </h1>
              <p className="text-lg lg:text-xl text-white/90 max-w-xl">
                Track expenses, optimize budgets, and grow wealth with AI-driven insights—secure and seamless finance solutions in one platform.
              </p>
              <Link
                href="/signIn/register"
                className="inline-flex items-center gap-2 bg-[oklch(0.70_0.15_95.62)] text-[oklch(0.22_0_0)] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[oklch(0.75_0.15_95.62)] transition-colors shadow-lg"
              >
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right - Credit Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-52 bg-gradient-to-br from-[oklch(0.85_0.05_95.62)] to-[oklch(0.90_0.05_95.62)] rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[oklch(0.50_0.15_24.94)] rounded"></div>
                        <span className="text-[oklch(0.22_0_0)] font-bold text-lg">Banklio</span>
                      </div>
                      <p className="text-[oklch(0.22_0_0)] text-sm font-medium">PREMIUM ACCOUNT</p>
                    </div>
                    <div className="text-[oklch(0.22_0_0)] font-mono text-xl tracking-wider">
                      5789 **** **** 2847
                    </div>
                    <div className="flex justify-between text-[oklch(0.22_0_0)] text-sm">
                      <div>
                        <p className="text-xs opacity-70">Card holder</p>
                        <p className="font-semibold">Sanzida A.</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70">Expire Date</p>
                        <p className="font-semibold">04/25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Partners Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-12 border-t border-white/10">
            {/* Left - Trust */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.70_0.15_95.62)] to-[oklch(0.75_0.15_95.62)] border-2 border-background"
                    ></div>
                  ))}
                </div>
                <h2 className="text-4xl font-bold text-foreground">10 Million+</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-md">
                Millions trust us our financial services empower lives with smarter money management and real impact.
              </p>
            </div>

            {/* Right - Partners */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">Meet Our Esteemed Partners & Affiliates</h3>
              <div className="grid grid-cols-3 gap-6">
                {['Stripe', 'Mastercard', 'PayPal', 'G Pay', 'Skrill', 'Payoneer'].map((partner) => (
                  <div
                    key={partner}
                    className="h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-semibold"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-5xl font-bold text-foreground">524M</h3>
              <p className="text-muted-foreground text-lg">Users Worldwide</p>
            </div>
            <div className="space-y-2 border-x border-border">
              <h3 className="text-5xl font-bold text-foreground">124+</h3>
              <p className="text-muted-foreground text-lg">Countries</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold text-foreground">184M</h3>
              <p className="text-muted-foreground text-lg">Customer Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simple, Fast & Hassle-Free */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Simple, Fast & Hassle-Free
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign Up, Connect Accounts, And Manage Finances Effortlessly With Smart Tracking And Budgeting.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Card */}
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sync your bank, wallet, or cards securely.
              </h3>
              <p className="text-muted-foreground mb-6">
                Create a custom card that reflects your unique style and personality. Choose from a range of colors, patterns, and designs to customize the look of your card.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-64 h-40 rounded-xl p-4 shadow-md ${
                      i === 1
                        ? 'bg-gradient-to-br from-[oklch(0.85_0.05_95.62)] to-[oklch(0.90_0.05_95.62)] z-10'
                        : i === 2
                        ? 'bg-gradient-to-br from-[oklch(0.75_0.05_95.62)] to-[oklch(0.80_0.05_95.62)] -ml-8 z-0 opacity-80'
                        : 'bg-gradient-to-br from-[oklch(0.65_0.05_95.62)] to-[oklch(0.70_0.05_95.62)] -ml-8 z-0 opacity-60'
                    }`}
                    style={{ transform: `translateY(${(i - 1) * 8}px)` }}
                  >
                    {i === 1 && (
                      <div className="text-[oklch(0.22_0_0)]">
                        <p className="font-bold">Banklio</p>
                        <p className="text-xs">PREMIUM ACCOUNT</p>
                        <p className="font-mono text-sm mt-4">5789 **** **** 284</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Get AI-driven insights to manage spending and grow wealth.
              </h3>
              <p className="text-muted-foreground mb-6">
                Track your spending patterns, analyze income or expenses easily, and receive personalized recommendations to optimize your financial habits.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Freelance', sub: 'Unregular payment', amount: '$1,500', color: 'bg-[oklch(0.70_0.15_95.62)]' },
                  { label: 'Salary', sub: 'Regular payment', amount: '$4,000', color: 'bg-[oklch(0.60_0.15_48.99)]' },
                  { label: 'Grocery', sub: 'Regular paym', amount: '$4,000', color: 'bg-[oklch(0.65_0.15_27.52)]' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`${item.color} rounded-xl p-4 text-white shadow-md`}
                  >
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs opacity-90">{item.sub}</p>
                    <p className="text-lg font-bold mt-2">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Create your account in minutes
                </h3>
                <p className="text-muted-foreground">
                  Create a custom card that reflects your unique style and personality. Choose from a range of colors, patterns, and designs to customize the look of your card.
                </p>
              </div>
              <div className="relative">
                <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground">107+</p>
                    <p className="text-muted-foreground">Happy Clients and Counting!</p>
                    <div className="flex justify-center gap-2 mt-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-primary"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smarter Finance Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Smarter Finance Better Decisions
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg text-muted-foreground">
                    Get 3% Cash Back On Everyday Purchases, 2% On Everything Else
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg text-muted-foreground">
                    Extra Spending Power When You Have Rewards Checking Through Upgrade
                  </span>
                </li>
              </ul>
              <Link
                href="/signIn/register"
                className="inline-flex items-center gap-2 bg-[oklch(0.70_0.15_95.62)] text-[oklch(0.22_0_0)] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[oklch(0.75_0.15_95.62)] transition-colors shadow-lg"
              >
                Explore More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-6">
              {/* Spending Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Spent this day</h3>
                  <select className="bg-muted px-3 py-1 rounded text-sm">
                    <option>Week</option>
                  </select>
                </div>
                <p className="text-3xl font-bold text-foreground mb-4">$259.75</p>
                <div className="h-32 bg-muted rounded-lg flex items-end justify-around p-4">
                  {['Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-primary rounded-t"
                        style={{ height: `${60 + i * 10}%` }}
                      ></div>
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Available Cards */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Available cards</h3>
                  <Link href="#" className="text-sm text-primary hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {[
                    { amount: '98,500 USD', number: '...4141', type: 'Mastercard' },
                    { amount: '76,280 EUR', number: '...8345', type: 'VISA' },
                  ].map((card, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">{card.amount}</p>
                        <p className="text-sm text-muted-foreground">{card.number}</p>
                      </div>
                      <div className="w-12 h-8 bg-primary rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-12">
            Join 16M+ Users Managing Money Smarter with Us
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-64 h-80 bg-muted rounded-2xl"></div>
            </div>
            <div className="bg-muted rounded-2xl p-8 shadow-lg">
              <p className="text-muted-foreground mb-6">
                Feature a few standout reviews with images of clients or their logos. Include short snippets like "Exceeded expectations," "Made my vision a reality," etc.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold text-foreground">Charlotte Anna</p>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    ←
                  </button>
                  <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[oklch(0.25_0.01_56.04)] to-[oklch(0.30_0.01_56.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Take Control of Your Finances Today!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Do you support international transactions? Yes, with multi-currency support.
          </p>
          <Link
            href="/signIn/register"
            className="inline-flex items-center gap-2 bg-[oklch(0.70_0.15_95.62)] text-[oklch(0.22_0_0)] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[oklch(0.75_0.15_95.62)] transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

