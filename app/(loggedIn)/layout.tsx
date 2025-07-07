import Sidebar from "@/app/components/Sidebar";
import "../globals.css";
import { Metadata } from "next";
import { Raleway } from "next/font/google";


const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons:{
    icon: '/favicon.png',
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={raleway.variable}>
      <body className={`font-raleway antialiased flex min-h-screen`}>
        <aside className="w-64 bg-gray-100 p-4 shadow-md">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </body>
    </html>
  )
}