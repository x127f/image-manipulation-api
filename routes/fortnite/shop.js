module.exports = (app) => {
	app.get("/shop", (req, res) => {
		return res.send("HI");
	});
};
