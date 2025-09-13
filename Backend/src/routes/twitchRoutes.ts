import express, { Router } from "express";
import { getDisplayName } from "../services/twitchService";
import { userRequestLimiter } from "../middleware/rateLimiter";

const router: Router = express.Router();

router.get("/name/:channel_id", userRequestLimiter, async (req, res) => {
  const { channel_id } = req.params;
  try {
    const data = await getDisplayName(channel_id);
    res.status(200).json(data);
  } catch (err: any) {
    if (err.status === 404) {
      res.status(404).json({ error: "Invalid channel_id" });
    }

    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
