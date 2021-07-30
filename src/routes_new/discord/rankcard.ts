// @ts-nocheck
import { Router } from "express";
const router = Router();
import { RankCard } from "../../templates/Discord";
import { RenderMode } from "../../templates/Template";
import { handleQuery, render } from "../../util/Query";

router.get("/", async (req, res) => {
	console.time("svg rank card");
	const t = await new RankCard({ type: req.query.type || "center" }).init();
	await handleQuery(req.query, t);

	const {
		status,
		text_xp,
		text_max,
		image_avatar,
		text_discriminator,
		radius_avatar,
		radius_avatar_circle,
		color_avatar_circle,
	} = req.query as any;
	var discriminator = Math.max(0, Math.min(Number(text_discriminator), 9999));
	if (isNaN(discriminator)) discriminator = 0;

	if (discriminator) t.setText("discriminator", `#${discriminator.toString().padStart(4, "0")}`);
	console.log({ discriminator, text_discriminator });

	if (status) {
		t.setStatus(status);
	}
	if (Number(radius_avatar_circle) && (radius_avatar === 100 || !radius_avatar)) {
		t.setAttribute("avatar_circle", "r", Number(radius_avatar_circle) + 75);
		t.setStatus("no-status");
		if (!color_avatar_circle) {
			var color = "black";
			switch (status) {
				case "online-mobile":
				case "online":
					color = "hsl(139, 47.3%, 43.9%)";
					break;
				case "idle":
					color = "hsl(38, 95.7%, 54.1%)";
					break;
				case "dnd":
					color = "hsl(359,  82.6%, 59.4%)";
					break;
				case "offline":
					color = "hsl(214, 9.9%, 50.4%)";
					break;
				case "streaming":
					color = "hsl(262, 46.8%, 39.8%)";
					break;
			}
			t.dom("#avatar_circle").attr("fill", color);
		}
	}
	if (color_avatar_circle) t.setAttribute("mask_avatar_circle", "fill", "white");

	const val = isNaN(Number(radius_avatar)) ? 100 : Number(radius_avatar);
	const value = val / 200;
	t.setAttribute("mask_avatar", "rx", value);
	t.setAttribute("mask_avatar", "ry", value);
	t.dom("#status").attr("x", (Number(t.dom("#status").attr("x")) || 0) + (100 - val) / 8);
	t.dom("#status").attr("y", (Number(t.dom("#status").attr("y")) || 0) + (100 - val) / 8);
	const statusOffset = (100 - val) / 1200 + 0.85;
	t.setAttribute("status_background", "x", statusOffset - 0.2);
	t.setAttribute("status_background", "y", statusOffset - 0.3);
	t.setAttribute("status_background", "cx", statusOffset);
	t.setAttribute("status_background", "cy", statusOffset);

	if (text_max) t.setMax(Number(text_max) || 0);
	if (text_xp) t.setXP(Number(text_xp) || 0);
	if (image_avatar && image_avatar.startsWith("discord")) {
		const [id, hash] = image_avatar.replace("discord:", "").split(",");
		if (!hash && !discriminator) discriminator = 0;

		await t.setAvatar(id, hash, 512, discriminator);
	}

	await render(req, res, t);
	console.log(req.query);
	console.timeEnd("svg rank card");
});

export default router;
