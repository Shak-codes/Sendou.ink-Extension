require("dotenv").config();
const axios = require("axios");
const Redis = require("ioredis");

const client = new Redis(`${process.env.UPSTASH_REDIS_URL}`);
const CLIENT_ID = process.env.CLIENT_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BACKEND = process.env.BACKEND;
BATCH_SIZE = 100;

const getLiveChannels = async (channels) => {
  try {
    const userLogins = channels.map((u) => `user_login=${u}`).join("&");
    const url = `https://api.twitch.tv/helix/streams?${userLogins}`;
    console.log(url);
    const res = await axios.get(url, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    console.log(res.data.data);
    return res.data.data.map((channel) => channel.user_login);
  } catch (err) {
    console.error("Live check error:", err.response?.data || err.message);
    return [];
  }
};

const getUserInfo = async () => {
  const res = await fetch(`${BACKEND}/users/twitch-names`);
  console.log("Got names!");
  return res.json();
};

const runJob = async () => {
  console.log("Starting job!");
  const channels = await getUserInfo();
  const liveChannels = [];
  console.log(`Channels ${channels}`);

  for (let i = 0; i < channels.length; i += BATCH_SIZE) {
    const batch = channels.slice(i, i + BATCH_SIZE);
    console.log(`Batch channels ${batch}`);
    const live = await getLiveChannels(batch);
    liveChannels.push(...live);
  }

  console.log("Finished batching!");

  await client.set("live", JSON.stringify(liveChannels));
  console.log("Saved live channels to Redis:", liveChannels);
  await client.quit();
  process.exit(0);
};

if (require.main === module) {
  runJob().catch((err) => {
    console.error("Error running cron job:", err);
    process.exit(1);
  });
}

exports.handler = async () => {
  await runJob();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Job ran successfully" }),
  };
};
