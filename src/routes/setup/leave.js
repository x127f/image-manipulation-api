const welcome_leave = require("../../util/welcome_leave");

module.exports = (app) => {
	app.get("/", welcome_leave("leave"));
};
