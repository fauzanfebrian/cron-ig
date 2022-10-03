import { IgApiClient, DirectThreadEntity } from "instagram-private-api";
import moment from "moment";

const { IG_USERNAME, IG_PASSWORD, IG_DESTINATION } = process.env;

export default class IGClient {
  private username: string;
  private password: string;
  private destination: string;

  declare thread: DirectThreadEntity;
  declare client: IgApiClient;

  constructor(username?: string, password?: string, destination?: string) {
    this.username = username || (IG_USERNAME as string);
    this.password = password || (IG_PASSWORD as string);
    this.destination = destination || (IG_DESTINATION as string);
  }

  async connect() {
    try {
      const client = new IgApiClient();
      client.state.generateDevice(this.username);

      console.log(`Sign in to ${this.username}`);
      await client.account.login(this.username, this.password);
      console.log(`Sign in to ${this.username} success`);

      const userId = await client.user.getIdByUsername(this.destination);
      const thread = client.entity.directThread([userId.toString()]);

      this.client = client;
      this.thread = thread;
    } catch (error) {
      console.error("IG Connecting Error: ", error);
      throw error;
    }
  }

  async sendMessage(msg: string) {
    try {
      // check the ig has connected or not
      if (!this.thread) await this.connect();

      console.log(`Sending message to @${this.destination}`);
      await this.thread.broadcastText(msg, true);
      const timeSending = moment().utcOffset(7).format("DD-MM-YYYY HH:mm");
      console.log(
        `Sending message to @${this.destination} success at ${timeSending}`
      );
    } catch (error) {
      console.error("Sending Message Error:", error);
      throw error;
    }
  }

  async changeProfilePicture(image: Buffer) {
    try {
      // check the ig has connected or not
      if (!this.client) await this.connect();

      console.log(`Changing @${this.username}'s profile picture`);
      await this.client.account.changeProfilePicture(image);
      console.log(`Changing @${this.username}'s profile picture success`);
    } catch (error) {
      console.error("Change Profile Picture Error:", error);
      throw error;
    }
  }
}
