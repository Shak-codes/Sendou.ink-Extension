// require("dotenv").config();
const axios = require("axios");
const Redis = require("ioredis");

const client = new Redis(`${process.env.UPSTASH_REDIS_URL}`);
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const BACKEND = process.env.BACKEND;
const MATCH_ID_URL = process.env.MATCH_ID_URL;
const MATCH_URL = process.env.MATCH_URL;
const SINK_TOKEN = process.env.SINK_TOKEN;
const BATCH_SIZE = 100;
const REFRESH_BUFFER_SECONDS = 3600;

/**
 * @typedef {Object} broadcasterIdentifiers
 * @property {string} discord_id
 * @property {string} twitch_id
 * @property {string} sendou_id
 * @property {string} twitch_name
 * @property {string} sendou_name
 */

const fetchNewTwitchToken = async () => {
  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token`,
    new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const data = await response.data;

  const ttl = data.expires_in - REFRESH_BUFFER_SECONDS;
  await client.set(ACCESS_TOKEN_KEY, data.access_token, "EX", ttl);
  return data.access_token;
};

const getTwitchToken = async () => {
  const token = await client.get(ACCESS_TOKEN_KEY);
  console.log("Grabbed token from redis");
  if (token) return token;

  // Token missing or expiring soon → fetch new
  const newToken = await fetchNewTwitchToken();
  console.log("Generated new token");
  return newToken;
};

/**
 * Gets a list of broadcaster identifiers for user's signed up to our extension.
 * @returns {Promise<broadcasterIdentifiers[]>} - A list of broadcaster identifiers.
 */
const getUserInfo = async () => {
  const res = await axios.get(`${BACKEND}/users/identifiers`);
  console.log("Found Extension User Info");
  return res.data;
};

/**
 * Gets a list of live channels.
 * @param {broadcasterIdentifiers[]} channels - The list of channel data objects
 * @returns {Promise<Set<string>>} - Set of live channels
 */
const getLiveChannels = async (channels) => {
  const names = channels.map((channel) => channel.twitch_name);
  try {
    const userLogins = names.map((u) => `user_login=${u}`).join("&");
    const url = `https://api.twitch.tv/helix/streams?${userLogins}`;
    const access_token = await getTwitchToken();
    const res = await axios.get(url, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
    });
    return new Set(res.data.data.map((channel) => channel.user_login));
  } catch (err) {
    console.error("Live check error:", err.response?.data || err.message);
    return new Set();
  }
};

/**
 * Gets a list of SendouQ match ids for all streamers currently live.
 * @param {broadcasterIdentifiers[]} channels - The list of channel data objects
 * @returns {Promise<string[]>} - A summary string
 */
const getMatchData = async (liveUsers) => {
  console.log("Getting match data");
  for (const user of liveUsers) {
    const idUrl = `${MATCH_ID_URL}/${user.sendou_id}`;
    const idRes = await axios.get(idUrl, {
      headers: {
        Authorization: `Bearer ${SINK_TOKEN}`,
      },
    });
    const matchId = idRes.data.matchId;
    if (!matchId) continue;
    const matchUrl = `${MATCH_URL}/${matchId}`;
    const matchRes = await axios.get(matchUrl, {
      headers: {
        Authorization: `Bearer ${SINK_TOKEN}`,
      },
    });
    await client.set(
      `matches:${user.twitch_id}`,
      JSON.stringify(matchRes.data)
    );
    console.log(`Saved live SendouQ match data for ${user.twitch_name}`);
  }
};

const runJob = async () => {
  console.log("Starting job!");
  const users = await getUserInfo();
  const liveUserNames = new Set();

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    console.log(`Checking batch: ${batch.map((u) => u.twitch_name)}`);
    const live = await getLiveChannels(batch);
    for (const name of live) liveUserNames.add(name);
  }

  const liveUsers = users.filter((user) => liveUserNames.has(user.twitch_name));
  await getMatchData(liveUsers);
  return true;
};

// Local run (for testing)
if (require.main === module) {
  runJob()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error running cron job locally:", err);
      process.exit(1);
    });
}

// AWS Lambda handler
exports.handler = async () => {
  try {
    const liveChannels = await runJob();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Job ran successfully",
        liveChannels,
      }),
    };
  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
