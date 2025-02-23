import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

app.post("/submit", async (req, res) => {
  const { problemId, userId, code, language } = req.body;

  try {
    await client.lPush(
      "submissions",
      JSON.stringify({problemId, userId, code, language})
    );
    res.status(200).json("Submission recieved & stored");
  } catch (e) {
    console.error("Redis error", e);
    res.status(500).json("Failed to store submission");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("connected to redis");

    app.listen(3000, () => {
      console.log("running on port 3000");
    });
  } catch (e) {
    console.error("Failed to connect to redis", e);
  }
}


startServer()