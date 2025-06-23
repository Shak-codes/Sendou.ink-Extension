import express, { Request, Response, Router } from "express";
import {
  getUser,
  get_identifiers,
  addUser,
  fetchUserData,
} from "../services/userService";
import { userRequestLimiter } from "../middleware/rateLimiter";

const router: Router = express.Router();

router.get("/identifiers", async (_req, res) => {
  try {
    const names = await get_identifiers();
    res.status(200).json(names);
  } catch (error) {
    console.error("Error in GET /api/users/identifiers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/sendou-profile/:discord_id",
  userRequestLimiter,
  async (req, res) => {
    const { discord_id } = req.params;
    try {
      const data = await fetchUserData(discord_id);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to find user" });
    }
  }
);

router.post("/signup", userRequestLimiter, async (req, res) => {
  try {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

router.get(
  "/:twitch_id",
  async (req: Request<{ twitch_id: string }>, res: Response): Promise<void> => {
    const { twitch_id } = req.params;

    try {
      const user = await getUser(twitch_id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error in GET /user/:twitch_id", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
