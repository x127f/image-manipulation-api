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

	const { status, text_xp, text_max, image_avatar, text_discriminator } = req.query as any;
	var discriminator = Number(text_discriminator);
	if (status) t.setStatus(status);
	if (text_max) t.setMax(Number(text_max));
	if (text_xp) t.setXP(Number(text_xp));
	if (image_avatar && image_avatar.startsWith("discord")) {
		const [id, hash] = image_avatar.replace("discord:", "").split(",");
		if ((!hash && !discriminator) || isNaN(discriminator)) discriminator = 0;

		await t.setAvatar(id, hash, 512, discriminator);
	}

	await render(req, res, t);
	console.log(req.query);
	console.timeEnd("svg rank card");
});

export default router;
