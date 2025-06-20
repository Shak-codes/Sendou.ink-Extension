import express from "express";
import { getUser } from "../services/userService";
import { getMatchDataBySendouID } from "../services/redisService";

const router = express.Router();

router.get("/:twitch_id", async (req, res): Promise<any> => {
  const { twitch_id } = req.params;

  try {
    const user = await getUser(twitch_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const matchData = await getMatchDataBySendouID(user.sendou_id);

    if (!matchData) {
      return res.status(404).json({ error: "Match data not found" });
    }

    res.status(200).json(matchData);
  } catch (err) {
    console.error("Error in GET /api/match/:twitch_id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
