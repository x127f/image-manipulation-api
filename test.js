const { generate } = require("./fetch");
const fs = require("fs");

var url = generate("/setup/headline", { text: "hi", color: "black", shadow: 0 });
console.log(url);
