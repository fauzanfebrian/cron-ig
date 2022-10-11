import { createCanvas, registerFont } from "canvas";
import moment from "moment";
import fs from "fs";

export function createImageByDate(save = true, filename = "profile") {
  const date = moment().utcOffset(7).format("DD-MM-YYYY");
  const width = 1200;
  const height = 1200;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  registerFont("./fonts/Poppins-Regular.ttf", { family: "Poppins" });

  context.fillStyle = "#112b3c";
  context.fillRect(0, 0, width, height);

  context.textAlign = "center";
  context.fillStyle = "#f66b0e";
  context.font = "180px Poppins";
  context.fillText(date, width / 2, height / 2 + 65);

  const buffer = canvas.toBuffer("image/jpeg");
  if (save) fs.writeFileSync(`./public/images/${filename}.jpg`, buffer);
  return buffer;
}
