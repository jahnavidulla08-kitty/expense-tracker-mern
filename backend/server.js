import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => res.send("Expense Tracker API is running."));
app.use("/api/expenses", expenseRoutes);

// Central error handler: return JSON instead of crashing the server.
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "Please check the submitted expense details." });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Create backend/.env using .env.example.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
