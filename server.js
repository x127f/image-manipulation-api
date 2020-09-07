require("dotenv").config();
process.env = {
	...process.env,
	production: false,
};

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const { registerFont } = require("canvas");
require("./lib/roundRect");
require("./lib/drawCircleImage");
require("./lib/drawStatusIndicator");
require("./lib/drawBackground");
require("./lib/loadAvatar");
require("./lib/loadImage");
require("express-async-errors");
var config = require("./config.json");
config = process.env.production ? config.production : config.development;
const app = express();
const port = config.port;
const routes = require("./routes");
const errorHandler = require("./routes/error");
const fonts = `${__dirname}/assets/fonts/`;

fs.readdirSync(fonts).forEach((file) => {
	const family = file.split(".")[0];
	registerFont(`${fonts}/${file}`, { family });
});

app.use((req, res, next) => {
	res.set("Cache-Control", "public, max-age=31536000");
	if (!process.env.production) return next();
	if (!req.query || !Object.keys(req.query).length || !req.query.hash)
		throw "No query/hash specified";
	var payload = { ...req.query };
	delete payload.hash;
	payload = JSON.stringify(payload);

	var hash = crypto.createHmac("sha256", config.secret).update(payload).digest("hex");

	if (hash !== req.query.hash) throw "Invalid query signature";

	next();
});

routes(app);
app.use(express.static("website"));
app.use("/api/docs", express.static("docs"));

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
