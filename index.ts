import { createServer } from "http";
import { config } from "dotenv";
config();

import { IgApiClient, DirectThreadEntity } from "instagram-private-api";
import cron from "node-cron";
import moment from "moment";

const { IG_USERNAME, IG_PASSWORD, IG_DESTINATION } = process.env;

async function getThread() {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME as string);

  console.log(`Sign in to ${IG_USERNAME}`);
  //   await ig.simulate.preLoginFlow();
  await ig.account.login(IG_USERNAME as string, IG_PASSWORD as string);
  //   await ig.simulate.postLoginFlow();
  console.log(`Sign in to ${IG_USERNAME} success`);

  const userId = await ig.user.getIdByUsername(IG_DESTINATION as string);
  const thread = ig.entity.directThread([userId.toString()]);

  return thread;
}

async function sendMessage(thread: DirectThreadEntity, msg = "TEST") {
  const timeSending = moment().utcOffset(7).format("DD-MM-YYYY HH:mm");
  await thread.broadcastText(msg, true);
  console.log(`Sending ${msg} to ${IG_DESTINATION} success at ${timeSending}`);
}

async function main() {
  try {
    const thread = await getThread();

    cron.schedule(
      "0 20 1 10 *",
      () => sendMessage(thread, "hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );
    cron.schedule(
      "5 20 1 10 *",
      () => sendMessage(thread, "hello from heroku"),
      { timezone: "Asia/Jakarta" }
    );
  } catch (error) {
    console.error(error);
  }
}

const client = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Everything ready");
  res.end();
});
client.listen(process.env.PORT || 3000, async () => {
  await main();
  console.log("Starting");
});
