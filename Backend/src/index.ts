import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import matchRoutes from "./routes/matchRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
