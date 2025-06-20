require("dotenv").config();
const WebSocket = require("ws");
const fs = require("fs");
const axios = require("axios");

const oAuth = process.env.OAUTH;
const CLIENT_ID = process.env.CLIENT_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BACKEND = process.env.BACKEND;
const nick = "Shakbot";

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

const getLiveChannels = async (channels) => {
  try {
    const userLogins = channels.map((u) => `user_login=${u}`).join("&");
    const url = `https://api.twitch.tv/helix/streams?${userLogins}`;
    const res = await axios.get(url, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return res.data.data;
  } catch (err) {
    console.error("Live check error:", err.response?.data || err.message);
    return [];
  }
};

const getUserInfo = async () => {
  const res = await fetch(`${BACKEND}/api/users/ids`);
  return res.json();
};

exports.handler = async () => {
  const data = await getUserInfo();
  const channels = data.map((channel) => channel.twitch_name);
  const liveChannels = [];

  for (let i = 0; i < channels.length; i += BATCH_SIZE) {
    const batch = channels.slice(i, i + BATCH_SIZE);
    const live = await getLiveChannels(batch);
    liveChannels.push(live);
  }

  // MAKE BATCH REQUEST TO SENDOU.INK API

  // STORE RESULT IN CACHE

  console.log(result); // or save to DB, email, alert, etc.
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
