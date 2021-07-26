// @ts-nocheck
import { Router } from "express";
const router = Router();
import { RankCard } from "../../templates/Discord";
import { RenderMode } from "../../templates/Template";

router.get("/", async (req, res) => {
	console.time("svg rank card");
	const t = await new RankCard({ type: "center" }).init();
	const { status, rank, level, max, xp, username, discriminator, color, user_id, user_avatar } = req.query;
	if (status) t.setStatus(status);
	if (rank) t.setRank(rank);
	if (level) t.setLevel(level);
	if (max) t.setMax(max);
	if (xp) t.setXP(xp);
	if (username) t.setUsername(username);
	if (discriminator) t.setDiscriminator(discriminator);
	if (color) t.setColor("primary_color", color);
	if ((user_id && user_avatar) || discriminator) await t.setAvatar(user_id, user_avatar);

	res.setHeader("content-type", "image/png").send(await t.toPNG({ mode: RenderMode.NODE_CANVAS_RENDERER }));
	console.timeEnd("svg rank card");
});

export default router;
