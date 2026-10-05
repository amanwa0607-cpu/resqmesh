import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/db.js";

import emergencyRoutes from "./routes/emergencyRoutes.js";
import shelterRoutes from "./routes/shelterRoutes.js";
import roadRoutes from "./routes/roadRoutes.js";

import {
  errorHandler,
} from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 5000;

await connectDatabase();

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   HEALTH
========================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      service: "ResQMesh API",
      status: "operational",
      timestamp:
        new Date().toISOString(),
    });
  }
);

/* =========================================
   API ROUTES
========================================= */

app.use(
  "/api/emergencies",
  emergencyRoutes
);

app.use(
  "/api/shelters",
  shelterRoutes
);

app.use(
  "/api/roads",
  roadRoutes
);

/* =========================================
   404
========================================= */

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API endpoint not found",
      path: req.originalUrl,
    });
  }
);

/* =========================================
   ERROR HANDLER
========================================= */

app.use(
  errorHandler
);

/* =========================================
   START SERVER
========================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `ResQMesh API running on http://0.0.0.0:${PORT}`
    );

    console.log(
      `Local:   http://localhost:${PORT}`
    );

    console.log(
      `Network: http://10.219.176.107:${PORT}`
    );
  }
);