const fetch = require("./fetch");
const fs = require("fs");

fetch("/setup/welcome", {
	user_tag: "xnacly%236370",
	user_id: "417699816836169728",
	guild_name: "Trenite",
	guild_avatar: "6e4174e86c4b36be80d2159f8214788a",
	guild_id: "683026970606567440",
	member_count: "42",
	user_avatar: "f76492e43b50b60ad4a3299691225f73",
	background: "",
})
	.then((res) => res.buffer())
	.then((buffer) => fs.writeFileSync("image.png", buffer));
