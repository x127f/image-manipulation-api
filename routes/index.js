const fs = require("fs");
const express = require("express");
const errorHandler = require("./error");

async function main(app) {
	var categories = fs.readdirSync(`${__dirname}/`);

	return categories
		.filter((category) => fs.lstatSync(`${__dirname}/${category}`).isDirectory())
		.map((category) => {
			var routes = fs.readdirSync(`${__dirname}/${category}/`);
			return routes.map(async (file) => {
				var router = express.Router();
				var route = file.split(".")[0];
				router.app = app;
				router.path = route;

				var file = require(`${__dirname}/${category}/${file}`);
				try {
					await file(router);
					console.log(`route loaded: ${category}/${route}`);
				} catch (error) {
					console.error(`error while loading route: ${category}/${route}`, error);
				}
				router.use(errorHandler);

				app.use(`/${category}/${route}`, router);
			});
		});
}

module.exports = (app) => main(app);
