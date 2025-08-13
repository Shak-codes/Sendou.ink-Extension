import express, { Router } from "express";
import { getAvatarHash } from "../services/discordService";

const router: Router = express.Router();

router.get("/:discord_id", async (req, res) => {
  const { discord_id } = req.params;
  try {
    const hash = await getAvatarHash(discord_id);
    res
      .status(200)
      .json(`https://cdn.discordapp.com/avatars/${discord_id}/${hash}`);
  } catch (err: any) {
    if (err.status === 404) {
      res.status(404).json({ error: "User not found" });
    }

    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
