import { clearAdminCookie } from "../_lib/auth";
import { cors } from "../_lib/cors";

export async function OPTIONS() {
  return cors();
}

export async function POST() {
  const headers = new Headers();
  
  // Clear the cookie correctly
  clearAdminCookie(headers);

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers
    }
  );
}
