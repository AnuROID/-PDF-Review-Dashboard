import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import uploadRoute from "./routes/upload";
import extractRoute from "./routes/extract";
import invoiceRouter from "./routes/invoice";
dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB first
connectDB().then(() => {
  //  Only then mount routes
  app.use("/upload", uploadRoute);
  app.use("/extract", extractRoute);
  app.use("/invoices",invoiceRouter);

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
});
