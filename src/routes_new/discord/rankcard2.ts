// @ts-nocheck
import { Router } from "express";
import { RankCard } from "../../templates/DiscordCanvas";
const router = Router();

router.get("/", async (req, res) => {
	res.setHeader("content-type", "image/png").send(await RankCard(req.query));
});

export default router;
