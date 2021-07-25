// @ts-nocheck
import { isBrowser, Template, TemplateOptions } from "./Template";
import "missing-native-js-functions";
import { Render } from "../util/Render";

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

export type RankCardOptions = TemplateOptions & { type: "center" | "right" | "left" };

export class RankCard extends Template<RankCardElements, "primary_color" | "text_color"> {
	max?: number;
	xp?: number;
	discriminator?: string;
	username?: string;
	rank?: string;
	status?: string;
	level?: string;
	user_avatar?: string;
	user_id?: string;
	primary_color?: string;

	constructor(public opts: RankCardOptions) {
		super(opts);

		if (isBrowser) opts.path = require("../../assets/templates/discord/RankCardCenter.svg").default;
		else
			opts.path = require("path").join(
				__dirname,
				"..",
				"..",
				"assets",
				"templates",
				"discord",
				"RankCardCenter.svg"
			);
	}

	setUsername(username: string) {
		this.username = username;
		this.setText("username", username);
	}

	setDiscriminator(discriminator: string) {
		this.discriminator = discriminator;
		this.setText("discriminator", `#${discriminator}`);
	}

	setLevel(level: number | string) {
		this.level = level;
		this.setText("level", `${level}`);
	}

	setPrimaryColor(color: string) {
		this.primary_color = color;
		this.setColor("primary_color", color);
	}

	setRank(rank: number | string) {
		this.rank = rank;
		this.setText("rank", `#${rank}`);
	}

	setStatus(status: "online" | "dnd" | "idle" | "offline" | "streaming" | "online-mobile" | "no-status") {
		this.setAttribute("status", "href", `#status-${status}`);
		var mask = "";
		if (status === "online-mobile") mask = "-mobile";
		else if (status === "no-status") mask = "-nostatus";
		this.status = status;

		this.setAttribute("avatar", "mask", `url(#mask-avatar${mask})`);
	}

	setAvatar(user_id?: string, user_avatar?: string, size: number = 256) {
		var url;
		if (!user_avatar || !user_id)
			url = `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 6}.png?size=${size}`;
		else url = `https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=${size}`;
		this.user_avatar = user_avatar;
		this.user_id = user_id;

		return this.loadImage("avatar", url);
	}

	setMax(value: number) {
		this.setText("max", `/ ${value} XP`);
		this.max = value;
		this.setXP(this.xp);
	}

	setXP(value: number) {
		// if (this.max < value) value = this.max;

		this.setText("xp", `${value}`);
		this.xp = value;
		// @ts-ignore
		const maxPercent = Number(this.dom("#progressBackground").attr("width").slice(0, -1));
		// @ts-ignore
		const percentage = Render.percentageOf(Render.percentageFrom(value, this.max), maxPercent);
		this.setAttribute("progress", "width", `${percentage}%`);
	}
}
