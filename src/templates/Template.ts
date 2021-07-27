// @ts-nocheck
import path from "path";
import { CheerioAPI } from "cheerio";
import { fetchBase64 } from "../util/fetch";
import { performance } from "perf_hooks";
import { createCanvas, loadImage } from "canvas";

export type TemplateOptions = {
	path?: string;
};

export var isBrowser = false;
export var isNode = false;

try {
	isBrowser = window;
} catch (error) {
	isNode = global;
}

export class Template<T extends string, G extends string> {
	static cache: Record<string, string> = {};
	static COUNTER = 0;
	// @ts-ignore
	dom: CheerioAPI;
	background?: string;
	scale: number = 1;
	elements: string[] = [];
	color_elements: string[] = [];

	constructor(public opts: TemplateOptions) {}

	async init() {
		if (isBrowser) {
			const content = await this.loadUrl(this.opts.path);
			this.useJquery(content);
		} else if (isNode) {
			const content = this.loadFile(this.opts.path);
			this.useCheerio(content);
		}
		this.dom("svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
		return this;
	}

	loadFile(path: string) {
		const content = Template.cache[path] || require("fs").readFileSync(path, { encoding: "utf8" });
		// Template.cache[path] = content;
		return content;
	}

	useCheerio(content: string) {
		this.dom = require("cheerio").load(content, { xmlMode: true });
		return this;
	}

	async loadUrl(url: string) {
		var content = Template.cache[url];
		if (!content) content = await (await (globalThis.fetch || require("node-fetch"))(url)).text();
		Template.cache[url] = content;
		return content;
	}

	useJquery(content: string) {
		const jQuery = require("jquery");
		const $ = jQuery(jQuery.parseXML(content));
		this.dom = $.find.bind($);
		this.dom.__proto__ = $.__proto__;
		return this;
	}

	getElement(idClass: string) {
		const element = this.dom(`#${idClass}, .${idClass}`);
		if (!element) throw new Error("Element not found");
		return element;
	}

	async loadImage(id: T, url: string) {
		if (!url.startsWith("http")) return;

		// @ts-ignore
		const element = this.getElement(id);

		if (globalThis.window) {
			const image = document.createElement("image");
			element[0].attributes.forEach((x) => {
				image.setAttribute(x.name, x.value);
			});
			image.setAttribute("href", value);

			background[0].outerHTML = image.outerHTML;
		} else {
			element[0].tagName = "image";
			element.attr("href", await fetchBase64(url));
		}
	}

	async setBackground(value: string) {
		const $ = this.dom;
		this.background = value;
		const isLink = value.startsWith("http") || value.startsWith("data:");
		window.t = $;

		if (globalThis.window) {
			const background = document.querySelector("#background");
			window.test = background;
			const image = document.createElement(isLink ? "image" : "rect");
			background.attributes.forEach((x) => {
				image.setAttribute(x.name, x.value);
			});
			image.setAttribute("fill", value);
			image.setAttribute("href", value);
			console.log(background, image);

			background.outerHTML = image.outerHTML;
		} else {
			const background = $("#background");
			if (!background) return;
			if (isLink) {
				background.tagName = "image";
				background.attribs.href = await fetchBase64(value);
			} else {
				background.attribs.fill = value;
			}
		}
	}

	setColor(id: T | G, color: string) {
		this.getElement(id).attr("fill", color);
	}

	setGradient(id: T | G, gradient: Gradient) {
		this.dom("defs").append(gradient.toXML());
		this.getElement(id).attr("fill", `url(#${gradient.id})`);
	}

	setText(id: T, text: string) {
		this.getElement(id).text(text);
	}

	setAttribute(id: T | G, name: string, value: string) {
		this.getElement(id).attr(name, value);
	}

	toSharp() {
		return require("sharp")(Buffer.from(this.toXML()));
	}

	setScale(value: number) {
		this.scale = Number(value) || 1;
	}

	setWidth(value: number) {
		this.dom("svg:root").attr("width", value);
	}

	setHeight(value: number) {
		this.dom("svg:root").attr("height", value);
	}

	getWidth() {
		return Number(this.dom("svg:root").attr("width"));
	}

	getHeight() {
		return Number(this.dom("svg:root").attr("height"));
	}

	async toPNG(opts?: { mode?: RenderMode }) {
		this.setWidth(this.getWidth() * this.scale);
		this.setHeight(this.getHeight() * this.scale);
		console.log(this.toXML());
		switch (opts?.mode || RenderMode.SHARP_CONVERTER) {
			case RenderMode.SHARP_CONVERTER:
				return await this.toSharp().png().toBuffer();
			case RenderMode.NODE_CANVAS_RENDERER:
				const image = await loadImage(`data:image/svg+xml;base64,${btoa(this.toXML())}`);
				const canvas = createCanvas(image.width, image.height);
				const ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height);
				const NodeRender = require("../util/NodeRender").NodeRender;

				return await new NodeRender(canvas).toPNG();
			default:
				return null;
		}
	}

	toXML() {
		if (!this.dom) return "";
		return this.dom.xml ? this.dom.xml() : this.dom(":root")[0].outerHTML;
	}
}

export enum RenderMode {
	SHARP_CONVERTER,
	NODE_CANVAS_RENDERER,
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
		this.opts = { transform: "", spread: "pad", x: 0, y: 0, toX: "", toY: "", ...opts };
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
			href: `data:image/jpg;base64,${opts.image?.toString("base64")}`,
			x: opts.x,
			y: opts.y,
			width: opts.width,
			height: opts.height,
		});
		return this;
	}

	toXML() {
		return `<pattern id="${this.id}" height="${this.opts?.height}" width="${this.opts?.width}" x="${
			this.opts?.x
		}" y="${this.opts?.y}" patternContentUnits="${this.opts?.contentUnits}" patternTransform="${
			this.opts?.transform
		}" patternUnits="${this.opts?.patternUnits}" preserveAspectRatio="${this.opts?.preserveAspectRatio}" viewBox="${
			this.opts?.viewBox
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

globalThis.Template = Template;
