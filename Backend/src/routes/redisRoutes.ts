import express, { Router } from "express";
import { userRequestLimiter } from "../middleware/rateLimiter";
import {
  getLiveUsers,
  getMatches,
  getMatchData,
} from "../services/redisService";
import config from "../config";
import Redis from "ioredis";
import { broadcast } from "../services/sseService";

const router: Router = express.Router();

router.post("/update", userRequestLimiter, async (req, res) => {
  try {
    const liveUsers = await getLiveUsers();
    const matchRefs = await getMatches(liveUsers);

    if (matchRefs.length === 0) {
      res.status(200).json({ message: "No live matches found" });
    }

    const { REDIS } = config;
    const client = new Redis(REDIS);

    await Promise.all(
      matchRefs.map(async (matchRef) => {
        const matchData = await getMatchData(matchRef);
        await client.set(
          `twitch:${matchRef.twitchId}`,
          JSON.stringify(matchData)
        );

        broadcast(matchRef.twitchId, "matchUpdated", matchData);
      })
    );

    res.status(200).json({
      message: "Matches updated in Redis",
      count: matchRefs.length,
      updated: matchRefs.map((ref) => ref.twitchId),
    });
  } catch (err: any) {
    if (err.status === 404) {
      res.status(404).json({ error: "User not found" });
    }

    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:twitchId", userRequestLimiter, async (req, res) => {
  try {
    const { twitchId } = req.params;
    const { REDIS } = config;
    const client = new Redis(REDIS);

    const data = await client.get(`matchData:${twitchId}`);

    await client.quit();

    if (!data) {
      res.status(404).json({ error: "No match data found" });
      return;
    }

    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
