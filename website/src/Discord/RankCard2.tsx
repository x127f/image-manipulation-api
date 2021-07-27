// @ts-nocheck
import { RankCard } from "../../../src/templates/Discord";
import { useEffect, useState } from "react";
import Render from "../Util/Render";
import TextField from "@material-ui/core/TextField";
import NativeSelect from "@material-ui/core/NativeSelect";
import useForceUpdate from "../Util/useForceUpdate";

function App() {
	const [template, setTemplate] = useState<RankCard>(new RankCard({ type: "center" }));
	const [forceUpdate, forceUpdateValue] = useForceUpdate();
	const [image, setImage] = useState(null);
	// @ts-ignore
	globalThis.template = template;

	useEffect(() => {
		async function test() {
			const t = await template.init();

			t.setStatus("online");
			t.setRank(2);
			t.setLevel(2);
			t.setMax(200);
			t.setXP(100);
			t.setScale(3);
			t.setColor("status-background", "transparent");
			t.setUsername("Flam3rboy");
			t.setDiscriminator("3490");
			t.setPrimaryColor("#5865F2");
			await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");
			forceUpdate();
		}

		test();
	}, []);

	useEffect(() => {
		(async () => {
			var p = new URLSearchParams();

			if (template.status) p.set("status", template.status);
			if (template.level) p.set("level", template.level);
			if (template.rank) p.set("rank", template.rank);
			if (template.xp) p.set("xp", template.xp);
			if (template.max) p.set("max", template.max);
			if (template.username) p.set("username", template.username);
			if (template.discriminator) p.set("discriminator", template.discriminator);
			if (template.primary_color) p.set("color", template.primary_color);
			if (template.user_avatar) p.set("user_avatar", template.user_avatar);
			if (template.user_id) p.set("user_id", template.user_id);
			if (template.scale) p.set("scale", template.scale);
			if (template.background) p.set("background", template.background);

			const url = `http://imac:8080/discord/rankcard?${p.toString()}`;
			setImage(url);
		})();
	}, [forceUpdateValue]);

	return (
		<div className="discord-rank-card">
			<TextField onChange={(e) => forceUpdate() || template.setLevel(e.target.value)} label="Level" />
			<TextField onChange={(e) => forceUpdate() || template.setRank(e.target.value)} label="Rank" />
			<TextField onChange={(e) => forceUpdate() || template.setUsername(e.target.value)} label="Username" />
			<TextField
				onChange={(e) =>
					forceUpdate() ||
					template.setDiscriminator(
						Math.min(9999, parseInt(e.target.value) || 0)
							.toString()
							.padStart(4, "0")
					)
				}
				label="Discriminator"
			/>
			<TextField onChange={(e) => forceUpdate() || template.setXP(parseInt(e.target.value) || 0)} label="XP" />
			<TextField onChange={(e) => forceUpdate() || template.setMax(parseInt(e.target.value) || 0)} label="Max" />
			<TextField onChange={(e) => forceUpdate() || template.setBackground(e.target.value)} label="Background" />
			<TextField onChange={(e) => forceUpdate() || template.setPrimaryColor(e.target.value)} label="Color" />
			<NativeSelect onChange={(e) => forceUpdate() || template.setStatus(e.target.value)}>
				<option value="online">Online</option>
				<option value="online-mobile">Online-mobile</option>
				<option value="offline">Offline</option>
				<option value="idle">Idle</option>
				<option value="dnd">DND</option>
				<option value="streaming">Streaming</option>
				<option value="no-status">No-Status</option>
			</NativeSelect>
			<Render template={template}></Render>

			<img width="100%" alt="rendered preview" src={image} />
		</div>
	);
}

export default App;
