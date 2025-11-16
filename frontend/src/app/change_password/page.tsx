"use client";
import { useEffect, useState } from "react";
import ChangePasswordForm from "@/Admin/components/ChangePasswordForm";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // If no token, force login
    if (!token) {
      router.push("/admin_login");
      return;
    }

    // get email of Admin from /api/admin-me
    fetch("/api/admin-me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.sub) {
          setEmail(data.sub); // sub = id or email from JWT
        } else {
          router.push("/admin_login");
        }
      });
  }, [router]);

  if (!email) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Password</h2>
        <ChangePasswordForm email={email} />
      </div>
    </div>
  );
}
