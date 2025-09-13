import express, { Router } from "express";
import { fetchUserData } from "../services/sendouService";
import { userRequestLimiter } from "../middleware/rateLimiter";

const router: Router = express.Router();

router.get("/:discord_id", userRequestLimiter, async (req, res) => {
  const { discord_id } = req.params;
  try {
    const data = await fetchUserData(discord_id);
    res.status(200).json(data);
  } catch (err: any) {
    if (err.status === 404) {
      res.status(404).json({ error: "User not found" });
    }

    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/update-matches", userRequestLimiter, async (req, res) => {});

export default router;
