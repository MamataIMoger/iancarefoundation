// app/admin_login/page.tsx
import AdminLogin from "../../components/sections/admin_login"; // adjust path if your tsconfig uses different alias
export const metadata = { title: "Admin Login" };

export default function Page() {
  return <AdminLogin />;
}
