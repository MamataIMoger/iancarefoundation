import { clearAdminCookie } from "../_lib/auth";
import { cors } from "../_lib/cors";

export async function OPTIONS() {
  return cors();
}

export async function POST() {
  clearAdminCookie();
  return Response.json({ success: true });
}
