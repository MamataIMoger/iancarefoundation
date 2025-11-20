import { getCurrentAdmin } from "../_lib/auth";
import { cors } from "../_lib/cors";

export async function OPTIONS() {
  return cors();
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  return Response.json({
    success: true,
    email: admin.email,
    role: admin.role,
  });
}
