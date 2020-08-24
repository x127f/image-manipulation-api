const welcome_leave = require("../../lib/welcome_leave");

module.exports = (app) => {
	app.get("/", welcome_leave("welcome"));
};
