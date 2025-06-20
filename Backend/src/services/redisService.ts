import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const getMatchDataBySendouID = async (
  sendouID: string
): Promise<any | null> => {
  try {
    const data = await redis.get(sendouID);
    return data ?? null;
  } catch (err) {
    console.error("Error fetching match data from Redis:", err);
    throw err;
  }
};
