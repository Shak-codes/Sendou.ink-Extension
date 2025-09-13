import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  DISCORD_TOKEN: string;
  TWITCH_HELIX_ROUTE: string;
  TWITCH_OAUTH_ROUTE: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  REDIS: string;
  OAUTH_TOKEN_KEY: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  TWITCH_HELIX_ROUTE: process.env.TWITCH_HELIX_ROUTE!,
  TWITCH_OAUTH_ROUTE: process.env.TIWTCH_OAUTH_ROUTE!,
  TWITCH_CLIENT_ID: process.env.TWITCH_EXTENSION_CLIENT_ID!,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_EXTENSION_CLIENT_SECRET!,
  REDIS: process.env.REDIS_URL!,
  OAUTH_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY!,
};

export default config;
