import { config } from "dotenv";
config();

import IGClient from "./IGClient";
import { createImageByDate } from "./image";
import { createServer } from "http";
import cron from "node-cron";
import { response } from "./ClientResponse";

async function main() {
  try {
    const client = new IGClient();
    await client.connect();

    cron.schedule(
      "50 14 3 10 *",
      () => client.sendMessage("hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );
    cron.schedule(
      "55 14 3 10 *",
      () => client.sendMessage("hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );
    cron.schedule(
      "0 15 3 10 *",
      () => client.sendMessage("hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );

    cron.schedule(
      "1 0 * * *",
      () => client.changeProfilePicture(createImageByDate()),
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
