// backend/routes/blog/index.ts
import express from "express";
import crudRouter from "./crud";

const router = express.Router();

// All blog CRUD routes live under /blog
router.use("/", crudRouter);

export default router;
