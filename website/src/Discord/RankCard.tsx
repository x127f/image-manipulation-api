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
	const [state, setState] = useBetterState({
		image_avatar: "discord",
	});

	return (
		<div className="discord-rank-card">
			<Template path="discord/rankcard" elements={elements} state={state} setState={setState}>
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
				</tr>
				<tr className="element">
					<td className="name">Opacity</td>
					<td className="field color"></td>
					<td className="field text">
						<TextField
							InputProps={{ inputProps: { min: 0, max: 100 } }}
							defaultValue="0"
							className="element"
							type="number"
							onChange={(e) => setState({ opacity: e.target.value })}
						></TextField>
					</td>
				</tr>
			</Template>
		</div>
	);
}
