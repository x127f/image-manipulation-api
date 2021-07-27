// @ts-nocheck
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import { Template } from "../Util/Template";

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
	avatar: {
		image: true,
	},
	status: {
		select: ["offline", "online", "online-mobile", "idle", "dnd", "streaming", "no-status"],
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
		radius: true,
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

export default function RankCard() {
	const [state, setState] = useState<Record<string, string>>({
		image_avatar: "discord",
	});

	return (
		<div className="discord-rank-card">
			<Template path="discord/rankcard" elements={elements} state={state} setState={setState}>
				<FormControl className="element">
					<InputLabel shrink>Type</InputLabel>
					<Select defaultValue="center" onChange={(e) => setState({ ...state, type: e.target.value })}>
						<MenuItem value={"left"}>Left</MenuItem>
						<MenuItem value={"center"}>Center</MenuItem>
						<MenuItem value={"right"}>Right</MenuItem>
					</Select>
				</FormControl>
			</Template>
		</div>
	);
}
