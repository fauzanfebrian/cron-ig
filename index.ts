import { createServer } from "http";
import { config } from "dotenv";
config();

import cron from "node-cron";
import IGClient, { sendMessage, changeProfilePicture } from "./IGClient";
import { createImageByDate } from "./image";

async function main() {
  try {
    const { thread, client } = await IGClient();

    cron.schedule(
      "50 10 3 10 *",
      () => sendMessage(thread, "hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );
    cron.schedule(
      "55 10 3 10 *",
      () => sendMessage(thread, "hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );

    cron.schedule(
      "1 0 * * *",
      () => changeProfilePicture(client, createImageByDate()),
      { timezone: "Asia/Jakarta" }
    );
  } catch (error) {
    console.error(error);
  }
}

// adding res client for checking application ready or not
const client = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Everything ready");
  res.end();
});
client.listen(process.env.PORT || 3000, async () => {
  await main();
  console.log("Starting");
});
