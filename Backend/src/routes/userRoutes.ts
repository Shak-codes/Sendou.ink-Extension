import express, { Request, Response, Router } from "express";
import { getUser, getIDs, addUser } from "../services/userService";
import { userRequestLimiter } from "../middleware/rateLimiter";

const router: Router = express.Router();

router.get(
  "/:twitchID",
  async (req: Request<{ twitchID: string }>, res: Response): Promise<void> => {
    const { twitchID } = req.params;

    try {
      const user = await getUser(twitchID);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error in GET /user/:twitchID", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/ids", async (_req, res) => {
  try {
    const userIDs = await getIDs();
    res.status(200).json(userIDs);
  } catch (error) {
    console.error("Error in GET /api/users/ids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", userRequestLimiter, async (req, res) => {
  try {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default router;
