import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import clientRouter from "./routes/client/clients"
import contactSubmitRouter from "./routes/contact/submit"
import contactMessagesRouter from "./routes/contact/contactMessages"
import blogRouter from "./routes/blog/index";
import blogCrudRouter from "./routes/blog/crud"
import volunteerRouter from "./routes/volunteer";
import galleryRouter from "./routes/gallery/index"                 // ✅ ensure correct path
import storyRouter from "./routes/story/index"                     // ✅ ensure correct path

const app = express()
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Modular routers
app.use("/api/clients", clientRouter)
app.use("/api/contact-messages", contactMessagesRouter)
app.use("/api/contact", contactSubmitRouter)

// Blog routes
app.use("/api/blog", blogRouter);
app.use("/api/blog/crud", blogCrudRouter)

// Volunteer routes
app.use("/api/volunteer", volunteerRouter);

// Gallery routes
app.use("/api/gallery", galleryRouter)

// Story routes — frontend calls /api/stories, so mount plural
app.use("/api/stories", storyRouter)

// Root route
app.get("/", (req, res) => {
  res.send("API is running")
})

// Server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
