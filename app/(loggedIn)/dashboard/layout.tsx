import Sidebar from "@/app/components/Sidebar";
import "../../globals.css";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
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