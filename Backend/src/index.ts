import express, { Request } from "express";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import twitchRoutes from "./routes/twitchRoutes";
import sendouRoutes from "./routes/sendouRoutes";
import { send } from "process";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const allowedOrigins = ["https://y2o9k4bhgfw5zxj64hcf39gn8324hi.ext-twitch.tv"];

const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  const origin = req.header("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin);
  const corsOptions: CorsOptions = {
    origin: isAllowed,
    credentials: true,
  };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

const rawPort = process.env.PORT;
if (!rawPort || isNaN(Number(rawPort))) {
  throw new Error(`❌ Invalid or missing PORT env: "${rawPort}"`);
}

const PORT = Number(rawPort);

console.log("PORT ENV VALUE:", PORT);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/twitch", twitchRoutes);
app.use("/api/sendou", sendouRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
