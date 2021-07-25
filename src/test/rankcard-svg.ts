const { RankCard } = require("../templates/Discord");
const { RenderMode } = require("../templates/Template");

async function main() {
	console.time("generate rank card");
	const t = await new RankCard({ type: "center" }).init();
	t.setStatus("online");
	t.setRank(2);
	t.setLevel(2);
	t.setMax(200);
	t.setXP(100);
	t.setUsername("Flam3rboy");
	t.setDiscriminator("3490");
	t.setPrimaryColor("#5865F2");

	await t.toPNG({ mode: RenderMode.NODE_CANVAS_RENDERER });
	console.timeEnd("generate rank card");

	main();
}

main();
