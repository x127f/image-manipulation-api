const crypto = require("crypto");
const fs = require("fs");
const nodeFetch = require("node-fetch");
const { production } = require("./config.json");
const { secret } = production;
const { param } = require("express/lib/router");

function generate(path, params, opts = { url: "https://cdn.trenite.tk" }) {
	var query = hash(params);
	return `${opts.url}${path}?${query}`;
}

async function fetch(...args) {
	var res = await nodeFetch(generate.apply(this, args));
	return await res.buffer();
}

function hash(params) {
	delete params.hash;
	Object.keys(params).forEach((key) => {
		try {
			if (typeof params[key] === "number") params[key] = params[key].toString();
			if (typeof params[key] === "object") params[key] = JSON.stringify(params[key]);
		} catch (error) {}
	});
	const hash = crypto.createHmac("sha256", secret).update(JSON.stringify(params)).digest("hex");
	params.hash = hash;

	var query = Object.entries(params)
		.map((x) => {
			return `${x[0]}=${encodeURIComponent(x[1])}`;
		})
		.join("&");
	return query;
}

module.exports = { fetch, hash, generate };
