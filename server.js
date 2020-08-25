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
const config = require("./config.json");
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
	if (!config.production) return next();
	if (!req.query || !Object.keys(req.query).length || !req.query.hash) throw "No query/hash specified";
	var payload = { ...req.query };
	delete payload.hash;
	payload = JSON.stringify(payload);

	var hash = crypto.createHmac("sha256", config.secret).update(payload).digest("hex");

	if (hash !== req.query.hash) throw "Invalid query signature";

	next();
});

routes(app);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
