import AdminSidebar from "@/app/components/AdminSidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your_fallback_secret");

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/signIn");
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const crn = payload.crn as string;

    if (crn) {
      const user = await prisma.user.findUnique({
        where: { crn },
        select: { isAdmin: true },
      });

      if (!user || !user.isAdmin) {
        redirect("/dashboard");
      }
    } else {
      redirect("/signIn");
    }
  } catch (error) {
    redirect("/signIn");
  }

  return (
    <>
      <aside className="w-64 bg-gray-100 shadow-lg">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
    </>
  );
}

