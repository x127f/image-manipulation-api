const crypto = require("crypto");
const fs = require("fs");
const nodeFetch = require("node-fetch");
const { secret } = require("./config.json");
const { param } = require("express/lib/router");

async function generate(path, params, opts = { url: "https://cdn.trenite.tk" }) {
	var query = hash(params);
	return nodeFetch(`${opts.url}${path}?${query}`);
}

async function fetch(...args) {
	return nodeFetch(generate.apply(this, args));
}

function hash(params) {
	Object.keys(params).forEach((key) => {
		try {
			if (typeof params[key] === "number") params[key] = params[key].toString();
			if (typeof params[key] === "object") params[key] = JSON.stringify(params[key]);
			if (typeof params[key] === "string") params[key] = encodeURIComponent(params[key]);
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

module.exports = { fetch, hash, generate };
