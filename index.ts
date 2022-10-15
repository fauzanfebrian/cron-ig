import { config } from "dotenv";
config();

import IGClient from "./IGClient";
import { createImageByDate, createImageByText } from "./image";
import { createServer } from "http";
import cron from "node-cron";
import { response } from "./ClientResponse";

async function main() {
  const client = new IGClient();
  await client.connect();

  cron.schedule(
    "57 23 25 10 *",
    () => client.sendMessage("hello from heroku"),
    {
      timezone: "Asia/Jakarta",
    }
  );

  cron.schedule("0 0 26 10 *", () => client.sendMessage("hello from heroku"), {
    timezone: "Asia/Jakarta",
  });

  cron.schedule("45 1 26 10 *", () => client.sendMessage("hello from heroku"), {
    timezone: "Asia/Jakarta",
  });

  cron.schedule(
    "0 2 * * *",
    () => client.changeProfilePicture(createImageByDate()),
    { timezone: "Asia/Jakarta" }
  );
}

// adding res client for checking application ready or not
const client = createServer(response);
client.listen(process.env.PORT || 3000, () =>
  main()
    .then(() => console.log("Started"))
    .catch(() => console.error("Connecting Failed"))
);
