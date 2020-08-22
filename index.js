const express = require("express");
require("express-async-errors");
const app = express();
const port = 3000;
const fs = require("fs");
const routes = require("./routes");

app.get("/", (req, res) => {
	res.send("Hello World!");
});

routes(app);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
