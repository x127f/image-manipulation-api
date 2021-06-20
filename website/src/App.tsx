import "./App.css";
import svg from "../../assets/templates/discord/RankCardCenter.svg";
import { Template } from "../../src/templates/Template";
import * as Discord from "../../src/templates/Discord";
import { useEffect, useState } from "react";

function App() {
	const [template, setTemplate] = useState<Discord.RankCard | null>(null);

	useEffect(() => {
		async function test() {
			const t = await new Discord.RankCard({ type: "center" }).init();
			t.setRank(2);
			t.setLevel(2);
			t.setMax(200);
			t.setXP(100);
			t.setUsername("GxdAim");
			t.setDiscriminator("3490");
			t.setColor("primary_color", "#5865F2");
			await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");
			setTemplate(t);
		}

		test();
	}, []);

	// @ts-ignore
	globalThis.template = template;

	return (
		<div className="App">
			<div dangerouslySetInnerHTML={{ __html: template?.toXML() }}></div>
		</div>
	);
}

export default App;
