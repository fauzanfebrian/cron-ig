import { config } from "dotenv";
config();

import IGClient from "./IGClient";
import { createImageByDate } from "./image";
import { createServer } from "http";
import cron from "node-cron";
import { response } from "./ClientResponse";

async function main() {
  const client = new IGClient();
  await client.connect();

  cron.schedule("50 7 11 10 *", () => client.sendMessage("hello from heroku"), {
    timezone: "Asia/Jakarta",
  });
  cron.schedule("0 8 11 10 *", () => client.sendMessage("hello from heroku"), {
    timezone: "Asia/Jakarta",
  });
  cron.schedule("10 8 11 10 *", () => client.sendMessage("hello from heroku"), {
    timezone: "Asia/Jakarta",
  });

  cron.schedule(
    "1 0 * * *",
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
