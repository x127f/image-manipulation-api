const Canvas = require("canvas");
const fetch = require("node-fetch");

Canvas.loadImage = (src) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (src.startsWith("http")) {
				try {
					var res = await fetch(`https://cors.flam3rboy.workers.dev/${encodeURIComponent(src)}`, {
						redirect: "follow",
					});
					if (res.status != 200) return reject(new Error("Image returned error code"));
					var buffer = await res.buffer();
					src = `data:image/png;base64,${buffer.toString("base64")}`;
				} catch (error) {
					return reject("image couldn't be loaded");
				}
			}

			const image = new Canvas.Image();

			function cleanup() {
				image.onload = null;
				image.onerror = null;
			}

			image.onload = () => {
				cleanup();
				resolve(image);
			};
			image.onerror = (err) => {
				cleanup();
				reject("image couldn't be loaded");
			};

			image.src = src;
		} catch (error) {
			reject(error);
		}
	});
};
