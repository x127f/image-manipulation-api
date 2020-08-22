module.exports = async (app) => {
	app.get("/", (req, res) => {
		return res.send("HI");
	});
};
