import { Template } from "./Template";
import path from "path";
import "missing-native-js-functions";
import { Render } from "../util/Render";
const RankCardCenter = require("../../assets/templates/discord/RankCardCenter.svg");

console.log(RankCardCenter);

type RankCardElements =
	| "labelRank"
	| "rank"
	| "username"
	| "discriminator"
	| "xp"
	| "max"
	| "progressBackground"
	| "progress"
	| "labelLevel"
	| "level"
	| "avatar"
	| "status"
	| "background";

export class RankCard extends Template<RankCardElements, "primary_color" | "text_color"> {
	max?: number;
	xp?: number;
	discriminator?: string;

	constructor(type: "center" | "right" | "left" = "center") {
		super();
	}

	setUsername(username: string) {
		this.setText("username", username);
	}

	setDiscriminator(discriminator: string) {
		this.discriminator = discriminator;
		this.setText("discriminator", `#${discriminator}`);
	}

	setLevel(level: number) {
		this.setText("level", `${level}`);
	}

	setRank(rank: number) {
		this.setText("rank", `#${rank}`);
	}

	setStatus(status: "online" | "dnd" | "idle" | "offline" | "streaming" | "online-mobile") {
		this.setAttribute("status", "href", `status-${status}`);
	}

	setAvatar(user_id?: string, user_avatar?: string, size?: number) {
		var url;
		if (!size) size = 256;
		if (!user_avatar || !user_id)
			url = `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.png?size=${size}`;
		else url = `https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=${size}`;

		return this.loadImage("avatar", url);
	}

	setMax(value: number) {
		this.setText("max", `/ ${value} XP`);
		this.max = value;
	}

	setXP(value: number) {
		this.setText("xp", `${value}`);
		this.xp = value;
		const maxPercent = Number(this.dom("#progressBackground").attr("width").slice(0, -1));
		const percentage = Render.percentage(maxPercent, Render.percentage(this.max, value));
		this.setAttribute("progress", "width", `${percentage}%`);
	}
}
