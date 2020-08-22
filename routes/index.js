const fs = require("fs");

async function main(app) {
	var categories = fs.readdirSync(`${__dirname}/`);

	return categories
		.filter((category) => fs.lstatSync(`${__dirname}/${category}`).isDirectory())
		.map((category) => {
			var routes = fs.readdirSync(`${__dirname}/${category}/`);
			return routes.map((route) => {
				var file = require(`${__dirname}/${category}/${route}`);
				file(app);
			});
		});
}

module.exports = (app) => main(app);
