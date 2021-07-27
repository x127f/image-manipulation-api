import { Template } from "../Util/Template";

function App() {
	const elements = {
		primary: {
			color: true,
		},
		text: {
			color: true,
		},
		progress: {
			color: true,
		},
		progress_background: {
			color: true,
		},
		username: {
			color: true,
			text: true,
		},
		discriminator: {
			color: true,
			text: true,
		},
		xp: {
			text: true,
		},
		max: {
			text: true,
		},
		level: {
			text: true,
			color: true,
		},
		avatar: {
			image: true,
		},
		status: {
			select: ["offline", "online", "idle", "dnd", "streaming", "no-status"],
		},
		status_background: {
			attributes: {
				fill: {
					select: ["transparent", "black"],
				},
			},
		},
		background: {
			color: true,
			image: true,
		},
		label_rank: {
			text: true,
			color: true,
		},
		label_level: {
			text: true,
			color: true,
		},
	};

	return (
		<div className="discord-rank-card">
			<Template
				path="discord/rankcard"
				elements={elements}
				defaultState={{
					image_avatar: "discord",
				}}
			></Template>
		</div>
	);
}

export default App;
