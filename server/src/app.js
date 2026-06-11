import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/candidates", candidateRoutes);
app.use("/workflow", workflowRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 5000;
  connectDatabase().then(() => {
    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Stop the existing process or set PORT to another value in server/.env.`);
        process.exit(1);
      }
      throw error;
    });
  });
}
