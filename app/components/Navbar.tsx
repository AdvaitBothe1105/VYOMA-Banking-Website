"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Phone,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

const bankingServices = [
  {
    title: "Personal Banking",
    href: "/personal",
    description: "Checking accounts, savings, and personal loans.",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Credit Cards",
    href: "/credit-cards",
    description: "Discover our range of credit card options.",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: "Savings & Investment",
    href: "/savings",
    description: "Grow your wealth with our investment products.",
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    title: "Business Banking",
    href: "/business",
    description: "Banking solutions for your business needs.",
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

const supportLinks = [
  {
    title: "Security Center",
    href: "/security",
    description: "Learn about our security measures.",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with our support team.",
    icon: <Phone className="h-4 w-4" />,
  },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#222a32] border-b border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              width={105}
              height={24}
              alt="VYOMA Logo"
              className="object-contain rounded-2xl"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium text-gray-300 hover:text-white px-3 py-2 bg-transparent hover:bg-gray-700">
                  Banking
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full md:w-[500px] p-4 bg-white rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {bankingServices.map((service) => (
                        <ListItem
                          key={service.title}
                          title={service.title}
                          href={service.href}
                          icon={service.icon}
                        >
                          {service.description}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium text-gray-300 hover:text-white px-3 py-2 bg-transparent hover:bg-gray-700">
                  Loans
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full md:w-[400px] p-4 bg-white rounded-lg shadow-lg">
                    <div className="grid gap-3">
                      <ListItem
                        title="Personal Loans"
                        href="/loans/personal"
                        icon={<User className="h-4 w-4" />}
                      >
                        Quick approval personal loans with competitive rates.
                      </ListItem>
                      <ListItem
                        title="Home Loans"
                        href="/loans/home"
                        icon={<PiggyBank className="h-4 w-4" />}
                      >
                        Mortgage solutions for your dream home.
                      </ListItem>
                      <ListItem
                        title="Auto Loans"
                        href="/loans/auto"
                        icon={<CreditCard className="h-4 w-4" />}
                      >
                        Finance your next vehicle with great rates.
                      </ListItem>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/investments"
                  className={`${navigationMenuTriggerStyle()} text-base font-medium text-gray-300 hover:text-white px-3 py-2 bg-transparent hover:bg-gray-700`}
                >
                  Investments
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium text-gray-300 hover:text-white px-3 py-2 bg-transparent hover:bg-gray-700">
                  Support
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full md:w-[350px] p-4 bg-white rounded-lg shadow-lg">
                    <div className="grid gap-3">
                      {supportLinks.map((link) => (
                        <ListItem
                          key={link.title}
                          title={link.title}
                          href={link.href}
                          icon={link.icon}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Need immediate help?
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          1-800-BANK-HELP
                        </p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/signIn"
              className="text-base font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#EDEAE7] text-black px-4 py-2 rounded-lg text-base font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-[#222a32]">
          <div className="px-4 py-3 space-y-3">
            <Link href="/personal" className="block text-base text-white hover:text-blue-400">Banking</Link>
            <Link href="/loans" className="block text-base text-white hover:text-blue-400">Loans</Link>
            <Link href="/investments" className="block text-base text-white hover:text-blue-400">Investments</Link>
            <Link href="/support" className="block text-base text-white hover:text-blue-400">Support</Link>
            <div className="border-t border-gray-600 pt-3 space-y-2">
              <Link href="/login" className="block text-base text-white hover:text-blue-400">Sign In</Link>
              <Link href="/signup" className="block bg-white text-black px-4 py-2 rounded-lg text-center">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
    >
      {icon && <div className="text-blue-600 mt-0.5">{icon}</div>}
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{children}</p>
      </div>
    </Link>
  );
}
