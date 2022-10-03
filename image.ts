import { createCanvas } from "canvas";
import moment from "moment";
import fs from "fs";

export function createImageByDate() {
  const date = moment().utcOffset(7).format("DD-MM-YYYY");
  const width = 1200;
  const height = 1200;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#112b3c";
  context.fillRect(0, 0, width, height);

  context.textAlign = "center";
  context.fillStyle = "#fff";
  context.font = "120px Impact";
  context.fillText(date, width / 2, height / 2);

  const buffer = canvas.toBuffer("image/jpeg");
  return buffer;
}

fs.writeFileSync("./image.png", createImageByDate());
