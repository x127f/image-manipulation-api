const CanvasRenderingContext2d = require("canvas/lib/context2d");
const { loadImage } = require("canvas");

CanvasRenderingContext2d.prototype.loadAvatar = async function (user_id, user_avatar, user_tag, size) {
	if (!size) size = 128;
	try {
		return loadImage(`https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=${size}`);
	} catch {
		return loadImage(`https://cdn.discordapp.com/embed/avatars/${user_tag.split("#")[1] % 5}.png?size=${size}`);
	}
};
