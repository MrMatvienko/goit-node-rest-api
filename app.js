import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const app = express();

const { MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const { PORT } = process.env;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`);
});
