import { IgApiClient, DirectThreadEntity } from "instagram-private-api";
import moment from "moment";

const { IG_USERNAME, IG_PASSWORD, IG_DESTINATION } = process.env;

export default class IGClient {
  declare thread: DirectThreadEntity;
  declare client: IgApiClient;

  constructor(
    private username = IG_USERNAME as string,
    private password = IG_PASSWORD as string,
    private destination = IG_DESTINATION as string
  ) {}

  async connect() {
    try {
      const client = new IgApiClient();
      client.state.generateDevice(this.username);

      this.consoleTime(`Sign in to ${this.username}`);
      await client.account.login(this.username, this.password);
      this.consoleTime(`Sign in to ${this.username} success`);

      const userId = await client.user.getIdByUsername(this.destination);
      const thread = client.entity.directThread([userId.toString()]);

      this.client = client;
      this.thread = thread;
    } catch (error) {
      this.consoleTime("IG Connecting Error: ", error);
      throw error;
    }
  }

  async sendMessage(msg: string) {
    try {
      // check the ig has connected or not
      if (!this.thread) await this.connect();

      this.consoleTime(`Sending message to @${this.destination}`);
      await this.thread.broadcastText(msg, true);
      this.consoleTime(`Sending message to @${this.destination} success`);
    } catch (error) {
      console.error("Sending Message Error:", error);
      throw error;
    }
  }

  async changeProfilePicture(image: Buffer) {
    try {
      // check the ig has connected or not
      if (!this.client) await this.connect();

      this.consoleTime(`Changing @${this.username}'s profile picture`);
      await this.client.account.changeProfilePicture(image);
      this.consoleTime(`Changing @${this.username}'s profile picture success`);
    } catch (error) {
      this.consoleTime("Change Profile Picture Error:", error);
      throw error;
    }
  }

  consoleTime(text: string, ...msg: unknown[]) {
    const time = moment().utcOffset(7).format("DD-MM-YYYY HH:mm:ss");
    return console.log(`[${time}]: ${text}`, ...msg);
  }
}
