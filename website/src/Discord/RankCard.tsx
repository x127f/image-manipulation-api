// @ts-nocheck
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Template, useBetterState } from "../Util/Template";

export const elements = {
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
		color: true,
	},
	max: {
		text: true,
		color: true,
	},
	level: {
		text: true,
		color: true,
	},
	rank: {
		text: true,
		color: true,
	},
	avatar: {
		image: true,
		radius: true,
	},
	avatar_circle: {
		color: true,
		radius: {
			min: 0,
			max: 20,
		},
	},
	status: {
		select: ["offline", "online", "online-mobile", "idle", "dnd", "streaming", "no-status"],
	},
	background: {
		color: true,
		image: true,
		radius: true,
	},
	back: {
		color: true,
		opacity: true,
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

const codeExample = `
// Usage with discord.js
// Status
// You need to enable the presence intent https://discordjs.guide/popular-topics/intents.html
opts.set("status", message.author.presence.status)

// Avatar
opts.set("image_avatar", message.author.displayAvatarURL({format: "png"}))

// Username
opts.set("text_username", message.author.username)

// Discriminator
opts.set("text_discriminator", message.author.discriminator)
`;
const codeExampleAfter = `
const card = new MessageAttachment(url, "card.png");
message.channel.send(card);
`;

export default function RankCard() {
	const [state, setState] = useBetterState({
		image_avatar: "discord",
	});

	return (
		<div className="discord-rank-card">
			<Template
				path="discord/rankcard"
				elements={elements}
				state={state}
				setState={setState}
				codeExample={codeExample}
				codeExampleAfter={codeExampleAfter}
			>
				<tr className="element">
					<td className="name">Type</td>
					<td className="field color"></td>
					<td className="field">
						<Select defaultValue="center" onChange={(e) => setState({ type: e.target.value })}>
							<MenuItem value={"left"}>Left</MenuItem>
							<MenuItem value={"center"}>Center</MenuItem>
							<MenuItem value={"right"}>Right</MenuItem>
						</Select>
					</td>
					<td className="field"></td>
				</tr>
				<tr className="element">
					<td className="name">Status background</td>
					<td className="field color"></td>
					<td className="field">
						<Select
							defaultValue="center"
							onChange={(e) => setState({ color_status_background: e.target.value })}
						>
							<MenuItem value={"transparent"}>Transparent</MenuItem>
							<MenuItem value={"black"}>Black</MenuItem>
						</Select>
					</td>
					<td className="field"></td>
				</tr>
			</Template>
		</div>
	);
}
