import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

const rawPort = process.env.PORT;
if (!rawPort || isNaN(Number(rawPort))) {
  throw new Error(`❌ Invalid or missing PORT env: "${rawPort}"`);
}

const PORT = Number(rawPort);

console.log("PORT ENV VALUE:", PORT);

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
