import { Router } from "express";
import { addClient, removeClient } from "../services/sseService";

const router = Router();

router.get("/:twitchId", (req, res) => {
  const { twitchId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addClient(twitchId, res);

  req.on("close", () => {
    removeClient(twitchId, res);
  });
});

export default router;
