const welcome_leave = require("../welcome_leave");

module.exports = (app) => {
	app.get("/", welcome_leave("leave"));
};
