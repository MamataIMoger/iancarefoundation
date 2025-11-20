import { connectDB } from "../_lib/db";
import { Admin } from "../../models/Admin";
import bcrypt from "bcryptjs";
import { signAdminToken, setAdminCookie } from "../_lib/auth";
import { cors } from "../_lib/cors";

export async function OPTIONS() {
  return cors();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: "Email & password required" }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    if (!admin.active) {
      return Response.json({ error: "Account disabled" }, { status: 403 });
    }

    const token = signAdminToken(admin._id.toString());
    setAdminCookie(token);

    return Response.json({
      success: true,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
