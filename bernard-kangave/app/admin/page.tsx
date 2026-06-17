import type { Metadata } from "next";
import AdminDashboard from "@/app/components/admin/AdminDashboard";

export const metadata: Metadata = {
    title: "Admin Dashboard | Bernard Kangave",
    description: "Website analytics and performance dashboard",
    robots: { index: false, follow: false },
};

export default function AdminPage() {
    return <AdminDashboard />;
}
