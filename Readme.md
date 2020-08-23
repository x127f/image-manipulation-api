# Image (cdn) rest-api Trenite

<p align="center">
    <img style="border-radius: 100px" width="128" height="128" src="https://avatars0.githubusercontent.com/u/47723417?s=460&amp;u=10c488f1c4e0644b839df15ecefbfef2a9869305&amp;v=4">
    <img style="border-radius: 100px" width="128" height="128" src="https://cdn.discordapp.com/avatars/311129357362135041/401edcbaa39365697dc0a01cb1d0b485.png?size=2048">
</p>

### Features (planned):

-   [ ] welcome image (userProfilePic, username, background) [url parameters]
-   [ ] rank cards (xp system) [lvl, xp, username, userProfilePic][url parameters]
-   [ ] leave image (userProfilePic, username, background) [url parameters]

### Architecture:

-   express.js
-   hashbased auth (url-param)

### endpoints:

| endpoints:     | params:                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| /setup/welcome | user_name, guild_name, guild_avatar, member_count, user_avatar, background |
| /setup/leave   | user_name, guild_name, guild_avatar, member_count, user_avatar, background |
| /fortnite/shop | items                                                                      |
| /economy/slots | items                                                                      |

### Auth:

use [fetch.js](https://github.com/Trenite/image-manipulation-api/blob/master/fetch.js)

```js
const { fetch } = require("./fetch");
const fs = require("fs");

fetch("/setup/welcome", {
	user_tag: "xnacly#6370",
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
```

see [test.js](https://github.com/Trenite/image-manipulation-api/blob/master/test.js) for a more in depth example
