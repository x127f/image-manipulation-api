const crypto = require("crypto");
const fs = require("fs");

const secret = fs.readFileSync(__dirname + "/assets/secret.pem", { encoding: "utf8" });

const hash = crypto
	.createHmac("sha256", secret)
	.update(JSON.stringify({ test: "hi" }))
	.digest("hex");

console.log(hash);
