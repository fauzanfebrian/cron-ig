import { config } from "dotenv";
config();

import IGClient, { sendMessage, changeProfilePicture } from "./IGClient";
import { createImageByDate } from "./image";
import { createServer } from "http";
import cron from "node-cron";
import { response } from "./ClientResponse";

async function main() {
  try {
    const { thread, client } = await IGClient();

    // cron.schedule(
    //   "50 10 3 10 *",
    //   () => sendMessage(thread, "hello from heroku"),
    //   { timezone: "Asia/Jakarta" }
    // );
    // cron.schedule(
    //   "55 10 3 10 *",
    //   () => sendMessage(thread, "hello from heroku"),
    //   { timezone: "Asia/Jakarta" }
    // );

    cron.schedule(
      "1 0 * * *",
      () => changeProfilePicture(client, createImageByDate()),
      { timezone: "Asia/Jakarta" }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// adding res client for checking application ready or not
const client = createServer(response);
client.listen(process.env.PORT || 3000, () =>
  main()
    .then(() => console.log("Started"))
    .catch(console.error)
);
