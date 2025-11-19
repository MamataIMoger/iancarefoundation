// backend/server.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// Middleware
import { proxy } from "./middleware/proxy";

// Serverless
import serverless from "serverless-http";

// Modular Routers
import clientRouter from "./routes/client/clients";
import contactSubmitRouter from "./routes/contact/submit";
import contactMessagesRouter from "./routes/contact/contactMessages";
import blogRouter from "./routes/blog/index";
import blogCrudRouter from "./routes/blog/crud";
import volunteerRouter from "./routes/volunteer";
import galleryRouter from "./routes/gallery/index";
import storyRouter from "./routes/story/index";
import dashboardRoute from "./routes/dashboard/index";

// Admin Handlers
import loginHandler from "./routes/admin/admin-login";
import logoutHandler from "./routes/admin/admin-logout";
import meHandler from "./routes/admin/admin-me";
import changePasswordHandler from "./routes/admin/admin-change-password";
import requestResetHandler from "./routes/admin/admin-request-reset";
import resetPasswordHandler from "./routes/admin/admin-reset-password";
import bookConsultHandler from "./routes/book/book-consult";
import consultFormHandler from "./routes/form/consult-form";
import consultRequestsHandler from "./routes/request/consult-requests";
import updateConsultStatusHandler from "./routes/consult-request/status";

const app = express();

// ===============================
// ✅ FIXED CORS FOR SERVERLESS
// ===============================
app.use(
  cors({
    origin: [
      "https://iancarefoundation-frontend.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);


// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(proxy);

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Root
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Routers
app.use("/api/blog/crud", blogCrudRouter); // specific route first
app.use("/api/blog", blogRouter);

app.use("/api/clients", clientRouter);
app.use("/api/contact-messages", contactMessagesRouter);
app.use("/api/contact", contactSubmitRouter);

app.use("/api/volunteer", volunteerRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/stories", storyRouter);
app.use("/api/dashboard", dashboardRoute);

// Admin Authentication
app.post("/api/admin/admin-login", loginHandler);
app.post("/api/admin/admin-logout", logoutHandler);
app.get("/api/admin/admin-me", meHandler);
app.post("/api/admin/change-password", changePasswordHandler);
app.post("/api/admin/admin-request-reset", requestResetHandler);
app.post("/api/admin/admin-reset-password", resetPasswordHandler);

// Consult Request Routes
app.post("/api/book/book-consult", bookConsultHandler);
app.get("/api/book/book-consult", bookConsultHandler);
app.patch("/api/book/book-consult", bookConsultHandler);

app.post("/api/form/consult-form", consultFormHandler);
app.get("/api/request/consult-requests", consultRequestsHandler);
app.post("/api/consult-request/status", updateConsultStatusHandler);

// ===============================
// ✅ EXPORT DEFAULT HANDLER FOR VERCEL
// ===============================
export default serverless(app);

// ===============================
// ✅ LOCAL DEVELOPMENT SERVER
// ===============================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}

