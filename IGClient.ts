import { IgApiClient, DirectThreadEntity } from "instagram-private-api";
import moment from "moment";

const { IG_USERNAME, IG_PASSWORD, IG_DESTINATION } = process.env;

export default async function IGClient() {
  const client = new IgApiClient();
  client.state.generateDevice(IG_USERNAME as string);

  console.log(`Sign in to ${IG_USERNAME}`);
  //   await client.simulate.preLoginFlow();
  await client.account.login(IG_USERNAME as string, IG_PASSWORD as string);
  //   await client.simulate.postLoginFlow();
  console.log(`Sign in to ${IG_USERNAME} success`);

  const userId = await client.user.getIdByUsername(IG_DESTINATION as string);
  const thread = client.entity.directThread([userId.toString()]);

  return { thread, client };
}

export async function sendMessage(thread: DirectThreadEntity, msg = "TEST") {
  try {
    await thread.broadcastText(msg, true);
    const timeSending = moment().utcOffset(7).format("DD-MM-YYYY HH:mm");
    console.log(
      `Sending "${msg}" to "${IG_DESTINATION}" success at ${timeSending}`
    );
  } catch (error) {
    console.error("Sending Message Error:", error);
    throw error;
  }
}

export async function changeProfilePicture(client: IgApiClient, image: Buffer) {
  try {
    await client.account.changeProfilePicture(image);
    console.log(`Changing ${IG_USERNAME}'s profile picture success`);
  } catch (error) {
    console.error("Change Profile Picture Error:", error);
    throw error;
  }
}
