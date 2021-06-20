import path from "path";
import { CheerioAPI } from "cheerio";
import fetch from "../util/fetch";
import * as Discord from "./Discord";

export { Discord };

export class Template<T extends string, G extends string> {
	static cache: Record<string, string> = {};
	dom: CheerioAPI;

	constructor() {}

	init() {
		this.dom("svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
	}

	static loadFile(path: string) {
		const content = Template.cache[path] || require("fs").readFileSync(path, { encoding: "utf8" });
		Template.cache[path] = content;
		const template = new Template();
		template.dom = require("cheerio").load(content, { xmlMode: true });
		template.init();
		return template;
	}

	static async loadBrowser(url: string) {
		var content = Template.cache[url];
		if (!content) content = await await fetch(url).text();

		const template = new Template();
		const jQuery = require("jquery");
		// @ts-ignore
		template.dom = jQuery(jQuery.parseXML(content));
		template.init();
		return template;
	}

	setImage(id: T, image: Buffer) {
		const $ = this.dom;

		$(`#${id}`).attr("href", `data:image/png;base64,${image.toString("base64")}`);
	}

	async loadImage(id: T, url: string) {
		const image = await (await fetch(url)).buffer();
		return this.setImage(id, image);
	}

	async setBackground(value: Buffer | string) {
		const $ = this.dom;
		// @ts-ignore
		if (typeof value === "string") return this.setColor("background", value);

		$("#background").each((i, x) => {
			x.tagName = "image";
			x.attribs.href = `data:image/png;base64,${value.toString("base64")}`;
		});
	}

	setColor(id: T | G, color: string) {
		const $ = this.dom;

		const elements = $(`#${id}, .${id}`);
		if (!elements) throw new Error("Color not found");

		elements.attr("fill", color);
	}

	setGradient(id: T | G, gradient: Gradient) {
		const $ = this.dom;

		const elements = $(`#${id}, .${id}`);
		if (!elements) throw new Error("Color not found");

		const gradientElement = $(`#${gradient.id}`);
		if (!gradientElement.length) $("defs").after(gradient.toXML());

		elements.attr("fill", `url(#${gradient.id})`);
	}

	setText(id: T, text: string) {
		const $ = this.dom;

		$(`#${id}`).text(text);
	}

	setAttribute(id: T, name: string, value: string) {
		const $ = this.dom;

		$(`#${id}`).attr(name, value);
	}

	toSharp() {
		return require("sharp")(Buffer.from(this.toXML()));
	}

	toPNG() {
		return this.toSharp().png().toBuffer();
	}

	toXML() {
		return this.dom.xml ? this.dom.xml() : this.dom.html();
	}
}

const assetPath = path.join(__dirname, "..", "..", "assets", "templates");

export const Assets: Record<Asset, string> = {
	DiscordRankCardLeft: path.join(assetPath, "discord", "RankCardLeft.svg"),
	DiscordRankCardCenter: path.join(assetPath, "discord", "RankCardCenter.svg"),
	DiscordRankCardRight: path.join(assetPath, "discord", "RankCardRight.svg"),
};

export type Asset = "DiscordRankCardLeft" | "DiscordRankCardCenter" | "DiscordRankCardRight";

export class Gradient {
	colors: { offset: number; color: string }[] = [];
	static COUNTER = 0;
	public id: string;

	constructor(
		public opts?: {
			transform?: string;
			spread?: "pad" | "reflect" | "repeat";
			x?: number;
			y?: number;
			toX?: number;
			toY?: number;
		}
	) {
		// @ts-ignore
		this.opts = { transform: "", spread: "", x: 0, y: 0, toX: "", toY: "", ...opts };
		this.id = `gradient-${Gradient.COUNTER++}`;
	}

	add(color: string, offset: number) {
		this.colors.push({ offset, color });
		return this;
	}

	toXML() {
		return `<linearGradient id="${this.id}" gradientTransform="${this.opts?.transform}" spreadMethod="${
			this.opts?.spread
		}" x1="${this.opts?.x}" y1="${this.opts?.y}" x2="${this.opts?.toX}" y2="${this.opts?.toY}">
			${this.colors.map((x) => `<stop offset="${x.offset}%"  stop-color="${x.color}" />`).join("\n")}
		</linearGradient>`;
	}
}

export class Pattern {
	static COUNTER = 0;
	public id: string;
	patterns: {
		x?: string | number;
		y?: string | number;
		width?: string | number;
		height?: string | number;
		type: string;
		href?: string;
	}[] = [];

	constructor(
		public opts?: {
			contentUnits?: "userSpaceOnUse" | "objectBoundingBox";
			patternUnits?: "userSpaceOnUse" | "objectBoundingBox";
			preserveAspectRatio?:
				| "none"
				| "xMinYMin"
				| "xMidYMin"
				| "xMaxYMin"
				| "xMinYMid"
				| "xMidYMid"
				| "xMaxYMid"
				| "xMinYMax"
				| "xMidYMax"
				| "xMaxYMax";
			viewBox?: string;
			transform?: string;
			x?: string | number;
			y?: string | number;
			height: string | number;
			width: string | number;
		}
	) {
		this.opts = {
			transform: "", // @ts-ignore
			contentUnits: "", // @ts-ignore
			preserveAspectRatio: "", // @ts-ignore
			patternUnits: "",
			x: "0",
			y: "0",
			height: "",
			width: "",
			viewBox: "",
			...opts,
		};

		this.id = `pattern-${Pattern.COUNTER++}`;
	}

	// TODO: fix Error: svgload_buffer: SVG rendering failed. vips2png: unable to write to target target
	addImage(opts: {
		x?: string | number;
		y?: string | number;
		height?: string | number;
		width?: string | number;
		image?: Buffer;
	}) {
		opts = { x: 0, y: 0, ...opts };
		this.patterns.push({
			type: "image",
			href: `data:image/jpg;base64,${opts.image.toString("base64")}`,
			x: opts.x,
			y: opts.y,
			width: opts.width,
			height: opts.height,
		});
		return this;
	}

	toXML() {
		return `<pattern id="${this.id}" height="${this.opts.height}" width="${this.opts.width}" x="${
			this.opts.x
		}" y="${this.opts.y}" patternContentUnits="${this.opts.contentUnits}" patternTransform="${
			this.opts.transform
		}" patternUnits="${this.opts.patternUnits}" preserveAspectRatio="${this.opts.preserveAspectRatio}" viewBox="${
			this.opts.viewBox
		}">

			${this.patterns
				.map(
					(x) =>
						`<${x.type} x="${x.x}" y="${x.y}" width="${x.width}" height="${x.height}" xlink:href="${x.href}" />`
				)
				.join("\n")}
		</pattern>`;
	}
}
