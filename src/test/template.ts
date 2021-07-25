import path from "path";
import fs from "fs";
import { RankCard } from "../templates/Discord";

async function main() {
	const t = await new RankCard({ type: "center" }).init();

	t.setStatus("online");
	t.setRank(2);
	t.setLevel(2);
	t.setMax(200);
	t.setXP(100);
	t.setUsername("Flam3rboy");
	t.setDiscriminator("3490");
	t.setColor("primary_color", "#5865F2");
	await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");
	fs.writeFileSync(path.join(__dirname, "result.svg"), t.toXML());
	fs.writeFileSync(path.join(__dirname, "result.png"), await t.toPNG());
	console.log("written");
}

main();
