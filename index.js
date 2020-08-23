const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const routes = require("./routes");

app.get("/", (req, res) => {
	throw "baseULR";
});

routes(app);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
	if (err)
		if (err.toString() == "404") {
			return res.sendFile(__dirname + "/assets/404.jpg");
		} else {
			return res.status(400).send({
				err: err.toString() + ", for further help, view our repo: https://github.com/Trenite/image-manipulation-api",
				success: false,
				status: 400,
			});
		}
});
