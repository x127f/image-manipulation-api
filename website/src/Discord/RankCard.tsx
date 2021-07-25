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
			const url = `http://localhost:8080/discord/rankcard?status=${encodeURIComponent(
				template.status
			)}&rank=${encodeURIComponent(template.rank)}&level=${encodeURIComponent(
				template.level
			)}&xp=${encodeURIComponent(template.xp)}&max=${encodeURIComponent(
				template.max
			)}&username=${encodeURIComponent(template.username)}&discriminator=${encodeURIComponent(
				template.discriminator
			)}&color=${encodeURIComponent(template.primary_color)}&user_id=${encodeURIComponent(
				template.user_id
			)}&user_avatar=${encodeURIComponent(template.user_avatar)}`;
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
