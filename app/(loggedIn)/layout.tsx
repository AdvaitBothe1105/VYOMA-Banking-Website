import Sidebar from "@/app/components/Sidebar";
import AdminSidebar from "@/app/components/AdminSidebar";
import { ToastProvider } from "@/app/components/toast/ToastContext";
import { ToastContainer } from "@/app/components/toast/ToastContainer";
import "@/app/globals.css";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons:{
    icon: '/favicon.png',
  }
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your_fallback_secret");

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isAdmin = false;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Check if we're on an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const { payload } = await jwtVerify(token, secret);
      const crn = payload.crn as string;

      if (crn) {
        const user = await prisma.user.findUnique({
          where: { crn },
          select: { isAdmin: true },
        });

        isAdmin = user?.isAdmin || false;
      }
    }
  } catch (error) {
    // If there's an error, default to false (non-admin)
    isAdmin = false;
  }

  // For admin routes, let the nested admin layout handle the sidebar
  // Don't render sidebar in parent layout for admin routes
  if (isAdminRoute) {
    return (
      <html lang="en" className={raleway.variable}>
        <body className={`font-raleway antialiased flex min-h-screen bg-gray-50`}>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={raleway.variable}>
      <body className={`font-raleway antialiased flex min-h-screen ${isAdmin ? 'bg-gray-50' : ''}`}>
        <ToastProvider>
          <aside className="w-64 bg-gray-100 shadow-lg">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}
          </aside>
          <main className="flex-1 p-6">
            {children}
          </main>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}