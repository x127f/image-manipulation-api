const crypto = require("crypto");
const fs = require("fs");
const nodeFetch = require("node-fetch");

const secret = fs.readFileSync(__dirname + "/assets/secret.pem", { encoding: "utf8" });

async function fetch(path, params) {
	var query = hash(params);
	return nodeFetch(`http://localhost:3000${path}?${query}`);
}

function hash(params) {
	Object.keys(params).forEach((key) => {
		try {
			params[key] = JSON.stringify(params[key]);
		} catch (error) {}
	});
	const hash = crypto.createHmac("sha256", secret).update(JSON.stringify(params)).digest("hex");
	params.hash = hash;

	var query = Object.entries(params)
		.map((x) => {
			return `${x[0]}=${x[1]}`;
		})
		.join("&");
	return query;
}

module.exports = { fetch, hash };
