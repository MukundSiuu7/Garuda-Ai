import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database";

import casesRouter from "./routes/cases";
import dashboardRouter from "./routes/dashboard";
import entitiesRouter from "./routes/entities";
import networkRouter from "./routes/network";
import analyticsRouter from "./routes/analytics";
import crimeAnalyticsRouter from "./routes/crimeAnalytics";
import transactionAnalyticsRouter from "./routes/transactionAnalytics";
import aiRouter from "./routes/ai";

dotenv.config();

const app = express();

export default app;

const PORT = process.env.PORT || 5000;

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

/*
==================================================
HEALTH CHECK
==================================================
*/

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CrimeGraph API is running",
  });
});

/*
==================================================
API ROUTES
==================================================
*/

app.use("/api/cases", casesRouter);

app.use("/api/dashboard", dashboardRouter);

app.use("/api/entities", entitiesRouter);

app.use("/api/network", networkRouter);

app.use("/api/analytics", analyticsRouter);

app.use("/api/crime-analytics", crimeAnalyticsRouter);

app.use("/api/transactions", transactionAnalyticsRouter);

/*
==================================================
AI ROUTE
==================================================
*/

app.use("/api/ai", aiRouter);

/*
==================================================
404 HANDLER
==================================================
*/

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
==================================================
ERROR HANDLER
==================================================
*/

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  },
);

/*
==================================================
START SERVER
==================================================
*/

const startServer = async () => {
  try {
    await connectDatabase();

    console.log("Database initialization complete");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}
