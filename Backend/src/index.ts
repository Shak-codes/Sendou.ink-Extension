import express, { Request } from "express";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import userRoutes from "./routes/userRoutes";
import twitchRoutes from "./routes/twitchRoutes";
import sendouRoutes from "./routes/sendouRoutes";
import discordRoutes from "./routes/discordRoutes";
import redisRoutes from "./routes/redisRoutes";
import config from "./config";

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

const { PORT } = config;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/twitch", twitchRoutes);
app.use("/api/sendou", sendouRoutes);
app.use("/api/discord", discordRoutes);
app.use("/api/redis", redisRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
