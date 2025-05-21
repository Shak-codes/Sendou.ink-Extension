const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();

app.use(express.static("video_component"));
app.use("/images", express.static("public/images"));

const options = {
  key: fs.readFileSync("certs/server.key"),
  cert: fs.readFileSync("certs/server.crt"),
};

https.createServer(options, app).listen(8080, () => {
  console.log("Extension dev server running at https://localhost:8080");
});
