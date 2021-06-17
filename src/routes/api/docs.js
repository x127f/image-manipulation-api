const fs = require("fs").promises;

module.exports = async (app) => {
	var base = __dirname + "/../../docs/";
	var categories = {};

	(await fs.readdir(base)).forEach(async (category) => {
		if (!(await fs.lstat(base + category)).isDirectory()) return;
		categories[category] = {};

		(await fs.readdir(base + category)).forEach(async (route) => {
			categories[category][route] = await fs.readFile(
				`${base}${category}/${route}/Readme.md`,
				{
					encoding: "utf8",
				}
			);
		});
	});

	app.get("/", async (req, res) => {
		res.json(categories);
	});
};
