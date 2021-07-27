// @ts-nocheck
import { isBrowser, Template, TemplateOptions } from "./Template";
import "missing-native-js-functions";
import { Render } from "../util/Render";

type RankCardElements =
	| "label_rank"
	| "rank"
	| "username"
	| "discriminator"
	| "xp"
	| "max"
	| "progress_background"
	| "progress"
	| "label_level"
	| "level"
	| "avatar"
	| "status"
	| "background";

export type RankCardOptions = TemplateOptions & { type: "center" | "right" | "left" };

export class RankCard extends Template<RankCardElements, "primary" | "text" | "status-background"> {
	max: number = 100;
	xp: number = 50;
	status?: string;
	user_avatar?: string;
	user_id?: string;

	constructor(public opts: RankCardOptions) {
		super(opts);

		if (isBrowser) opts.path = require(`../../assets/templates/discord/RankCard${opts.type.title()}.svg`).default;
		else
			opts.path = require("path").join(
				__dirname,
				"..",
				"..",
				"assets",
				"templates",
				"discord",
				`RankCard${opts.type.title()}.svg`
			);
	}

	setStatus(status: "online" | "dnd" | "idle" | "offline" | "streaming" | "online-mobile" | "no-status") {
		this.setAttribute("status", "href", `#status-${status}`);
		var mask = "";
		if (status === "online-mobile") mask = "-mobile";
		else if (status === "no-status") mask = "-nostatus";
		this.status = status;

		this.setAttribute("avatar", "mask", `url(#mask-avatar${mask})`);
	}

	setAvatar(user_id?: string, user_avatar?: string, size: number = 2048, discriminator?: number) {
		var url;
		if (!user_avatar || !user_id)
			url = `https://cdn.discordapp.com/embed/avatars/${Number(discriminator) % 6}.png?size=${size}`;
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
		const maxPercent = Number(this.dom("#progress_background").attr("width").slice(0, -1));
		// @ts-ignore
		const percentage = Render.percentageOf(Render.percentageFrom(value, this.max), maxPercent);
		this.setAttribute("progress", "width", `${percentage}%`);
	}
}
