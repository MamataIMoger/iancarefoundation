//app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/Admin/AdminDashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/admin-me", {
          method: "GET",
          credentials: "include",
        });


        if (res.ok) {
          setAuthorized(true);
        } else {
          router.replace("/admin_login");
        }
      } catch {
        router.replace("/admin_login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading)
    return <div className="p-6 text-gray-600">Checking admin session...</div>;

  if (!authorized) return null;

  return <AdminDashboard/>;
}
