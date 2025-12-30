import AdminDashboard from '@/app/components/AdminDashboard'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Dashboard | Vyoma Bank",
  description: "Admin panel for managing users, accounts, and transactions.",
  keywords: ["Admin", "Dashboard", "Vyoma Bank"],
};

const page = () => {
  return (
    <div>
      <AdminDashboard />
    </div>
  )
}

export default page

