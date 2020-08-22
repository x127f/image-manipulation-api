const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const secret = fs.readFileSync(__dirname + "/assets/secret.pem", { encoding: "utf8" });

require("express-async-errors");
const app = express();
const port = 3000;
const routes = require("./routes");

app.use((req, res, next) => {
	if (!req.query || !Object.keys(req.query).length || !req.query.hash) throw "No query/hash specified";
	var payload = { ...req.query };
	delete payload.hash;
	payload = JSON.stringify(payload);

	var hash = crypto.createHmac("sha256", secret).update(payload).digest("hex");

	if (hash !== req.query.hash) throw "Invalid query signature";

	next();
});

routes(app);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
