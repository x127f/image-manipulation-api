const Canvas = require("canvas");
const canvas = Canvas.createCanvas(1920, 1080);
const ctx = canvas.getContext("2d");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const buffer = canvas.toBuffer("image/jpeg");
sharp(buffer).jpeg({}).toBuffer();

fs.writeFileSync(path.join(__dirname, "out.png"), buffer);
