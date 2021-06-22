import fs from "fs";
import path from "path";
import { execFileSync, exec } from "child_process";
import os from "os";

const p = path.join(__dirname, "..", "..", "assets", "templates", "discord", "RankCardCenter.svg");
const content = fs.readFileSync(p);
const stream = fs.createReadStream(p);
// @ts-ignore
// const res = execFileSync(`rsvg-convert`, { input: stream });
// console.log("finished", res);

console.log("started");
const child = exec(`rsvg-convert -o test.png`);
child.on("error", console.error);
child.on("disconnect", () => console.error("disconnect"));
child.on("spawn", () => console.log("spawn"));
child.on("exit", (code) => console.log("exit", code));
child.on("message", console.log);
child.stdout.on("data", (d) => console.log(d.toString()));
child.stderr.on("data", (d) => console.log(d.toString()));
// stream.pipe(child.stdin);
child.stdin.write(content);
child.stdin.write(os.EOL);

child.stdin.write(`\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n`);
child.stdin.end();
