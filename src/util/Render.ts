// @ts-nocheck
export type LiteralUnion<T, U = string> = T | (U & Record<never, never>);

export type RenderMode = "corner" | "corners" | "center" | "radius";
export type Radius = number | { topLeft?: number; topRight?: number; bottomLeft?: number; bottomRight?: number };
export type Filter =
	| "blur"
	| "brightness"
	| "contrast"
	| "grayscale"
	| "hue-rotate"
	| "invert"
	| "opacity"
	| "saturate"
	| "sepia";
export type ImageOptions = {
	image: CanvasImageSource;
	x: number;
	y: number;
	width?: number;
	height?: number;
	radius?: number;
	cropX?: number;
	cropY?: number;
	cropWidth?: number;
	cropHeight?: number;
	scale?: number;
	circle?: boolean;
};

export class Render {
	public ctx: CanvasRenderingContext2D;
	public width: number;
	public height: number;
	public mode: RenderMode = "corner";
	public fontSettings: {
		size: number;
		style: string;
		family: string;
	} = {
		size: 15,
		style: "normal",
		family: "sans-serif",
	};

	constructor(public canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.stroke(null);
	}

	get centerX() {
		return this.width / 2;
	}

	get centerY() {
		return this.height / 2;
	}

	render(callback: (frame?: number, ...args: any[]) => any, frameRate: number = 60, amount: number = 0) {
		var i = 0;
		const interval: any = setInterval(
			async (frame) => {
				try {
					if (amount > 0) i++;
					if (i > amount) {
						return clearInterval(interval);
					}
					await callback(frame);
				} catch (error) {
					console.error(error);
					return clearInterval(interval);
				}
			},
			1000 / frameRate,
			i
		);
		return interval;
	}

	renderMode(mode: RenderMode) {
		this.mode = mode;
		return this;
	}

	filter(name: Filter, value: number) {
		this.ctx.filter = (this.ctx.filter || "") + ` ${name}(${value})`;
		return this;
	}

	dropshadow(opts: { blur?: number; color?: string; x?: number; y?: number }) {
		this.ctx.shadowBlur = opts.blur ?? 5;
		this.ctx.shadowOffsetX = opts.x ?? 5;
		this.ctx.shadowOffsetY = opts.y ?? 5;
		this.ctx.shadowColor = opts.color || "black";
		return this;
	}

	smooth(value: boolean = true) {
		this.ctx.imageSmoothingEnabled = value;
		return this;
	}

	static percentage(percentage: number, max: number) {
		return (max / 100) * percentage;
	}

	percentage(percentage: number, max: number) {
		return Render.percentage(percentage, max);
	}

	text(opts: {
		text: string;
		align?: CanvasTextAlign;
		baseline?: CanvasTextBaseline;
		style?: string;
		size?: number;
		color?: string;
		font?: string;
		x?: number;
		y?: number;
		maxWidth?: number;
		measure?: false;
	}): Render;

	text(opts: {
		text: string;
		align?: CanvasTextAlign;
		baseline?: CanvasTextBaseline;
		style?: string;
		size?: number;
		color?: string;
		font?: string;
		x?: number;
		y?: number;
		maxWidth?: number;
		measure?: true;
	}): TextMetrics;

	text(opts: {
		text: string;
		align?: CanvasTextAlign;
		baseline?: CanvasTextBaseline;
		style?: string;
		size?: number;
		color?: string;
		font?: string;
		x?: number;
		y?: number;
		maxWidth?: number;
		measure?: boolean;
	}): Render | TextMetrics {
		this.ctx.font = `${opts.style || this.fontSettings.style || "normal"} ${
			opts.size || this.fontSettings.size || 15
		}px ${opts.font || this.fontSettings.family || "sans-serif"}`;
		if (!opts.x) opts.x = 0;
		if (!opts.y) opts.y = 0;
		this.ctx.textAlign = opts.align || this.ctx.textAlign;
		this.ctx.textBaseline = opts.baseline || this.ctx.textBaseline;
		this.ctx.fillStyle = opts.color || this.ctx.fillStyle;

		if (this.ctx.strokeStyle) this.ctx.strokeText(opts.text, opts.x, opts.y, opts.maxWidth);
		if (this.ctx.fillStyle) this.ctx.fillText(opts.text, opts.x, opts.y, opts.maxWidth);

		if (opts.measure) {
			const box = { ...this.ctx.measureText(opts.text) };
			box.width = Math.min(box.width, opts.maxWidth || box.width);
			return box;
		}

		return this;
	}

	background(color: string | CanvasImageSource) {
		if (typeof color !== "string") return this.image({ image: color, x: 0, y: 0, width: this.width });
		const fillStyle = this.ctx.fillStyle;
		this.ctx.fillStyle = color;
		this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fill();
		this.ctx.fillStyle = fillStyle;
		return this;
	}

	fill(color: string | CanvasGradient | CanvasPattern) {
		if (color == null) color = "transparent";
		this.ctx.fillStyle = color;
		return this;
	}

	stroke(
		value: LiteralUnion<CanvasLineJoin | CanvasLineCap, number | null | string | CanvasGradient | CanvasPattern>
	) {
		if (value == null) value = "transparent";

		if (typeof value == "number") this.ctx.lineWidth = value;
		else if (["butt", "round", "square"].includes(value as string)) this.ctx.lineCap = value as CanvasLineCap;
		else if (["bevel", "miter", "round"].includes(value as string)) this.ctx.lineJoin = value as CanvasLineJoin;
		else if (typeof value == "string") {
			this.ctx.strokeStyle = value;
		}
		return this;
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		return this;
	}

	textSize(value: number) {
		this.fontSettings.size = value;
		return this;
	}

	textFont(value: string) {
		this.fontSettings.family = value;
		return this;
	}

	textStyle(value: string) {
		this.fontSettings.style = value;
		return this;
	}

	scale(x: number, y?: number) {
		if (!y) y = x;
		this.ctx.scale(x, y);
		return this;
	}

	pixelDensity(val: number) {
		this.canvas.width = this.width * val;
		this.canvas.height = this.height * val;

		this.ctx.scale(val, val);
		return this;
	}

	modeAdjust<T>(mode: RenderMode, opts: T & { x: number; y: number; width: number; height: number }): T {
		if (mode === "corner" || !mode) {
			return { ...opts, x: opts.x, y: opts.y, width: opts.width, height: opts.height };
		} else if (mode === "corners") {
			return { ...opts, x: opts.x, y: opts.y, width: opts.x - opts.width, height: opts.height - opts.y };
		} else if (mode === "radius") {
			return {
				...opts,
				x: opts.x - opts.width,
				y: opts.y - opts.height,
				width: opts.width * 2,
				height: opts.height * 2,
			};
		} else if (mode === "center") {
			return {
				...opts,
				x: opts.x - opts.width * 0.5, // remove 0.5 for circle, but not for rect
				y: opts.y - opts.height * 0.5,
				width: opts.width,
				height: opts.height,
			};
		}
	}

	rect(opts: { x: number; y: number; width?: number; height?: number; radius?: Radius }) {
		if (!opts.width) opts.width = opts.height;
		if (!opts.height) opts.height = opts.width;
		var { height, radius, y, x, width } = this.modeAdjust(this.mode, opts);
		if (this.mode === "center") {
			x += opts?.width * 0.5;
			y += opts?.height * 0.5;
		}
		this.ctx.beginPath();

		if (!radius) radius = 0;
		if (typeof radius === "number")
			radius = { bottomLeft: radius, bottomRight: radius, topLeft: radius, topRight: radius };

		this.ctx.moveTo(x + radius.topLeft, y);
		this.ctx.arcTo(x + width, y, x + width, y + height, radius.topRight);
		this.ctx.arcTo(x + width, y + height, x, y + height, radius.bottomRight);
		this.ctx.arcTo(x, y + height, x, y, radius.bottomLeft);
		this.ctx.arcTo(x, y, x + width, y, radius.topLeft);
		this.ctx.closePath();

		if (this.ctx.fillStyle) this.ctx.fill();
		if (this.ctx.strokeStyle) this.ctx.stroke();
		return this;
	}

	line({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
		this.ctx.lineWidth = height;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x + width, y);
		this.ctx.stroke();
	}

	circle(opts: { x: number; y: number; radius: number }) {
		return this.arc(opts);
	}

	arc(opts: {
		x: number;
		y: number;
		radius: number;
		angleStart?: number;
		angleStop?: number;
		anticlockwise?: boolean;
	}) {
		return this.ellipse({ ...opts, width: opts.radius * 2, height: opts.radius * 2, rotation: 0 });
	}

	ellipse(opts: {
		x: number;
		y: number;
		width?: number;
		height?: number;
		rotation?: number;
		angleStart?: number;
		angleStop?: number;
		anticlockwise?: boolean;
	}) {
		if (!opts.angleStart) opts.angleStart = 0;
		if (!opts.angleStop) opts.angleStop = 2 * Math.PI;
		if (this.mode == "center") {
			opts = {
				...opts,
				x: opts.x - opts.width,
				y: opts.y - opts.height,
				width: opts.width,
				height: opts.height,
			};
		} else opts = this.modeAdjust(this.mode, opts);
		this.ctx.beginPath();

		opts.x += opts.width;
		opts.y += opts.height;

		this.ctx.ellipse(
			opts.x,
			opts.y,
			opts.width,
			opts.height,
			opts.rotation,
			opts.angleStart,
			opts.angleStop,
			opts.anticlockwise
		);

		if (this.ctx.fillStyle) this.ctx.fill();
		if (this.ctx.strokeStyle) this.ctx.stroke();

		return this;
	}

	image(opts: ImageOptions) {
		if (!opts.scale) opts.scale = 1;

		if (!opts.height && !opts.width) {
			const hRatio = this.width / (opts.image.width as number);
			const vRatio = this.height / (opts.image.height as number);
			const ratio = Math.min(hRatio, vRatio);

			opts.height = (opts.image.height as number) * ratio;
			opts.width = (opts.image.width as number) * ratio;
		} else if (!opts.height) {
			opts.height = (opts.image.height as number) * (opts.width / (opts.image.width as number));
		} else if (!opts.width) {
			opts.width = (opts.image.width as number) * (opts.height / (opts.image.height as number));
		}

		opts.width = opts.width * opts.scale;
		opts.height = opts.height * opts.scale;

		opts = this.modeAdjust(this.mode, opts);

		if (!opts.cropX) opts.cropX = 0;
		if (!opts.cropY) opts.cropY = 0;
		if (!opts.cropHeight) opts.cropHeight = opts.image.height as number;
		if (!opts.cropWidth) opts.cropWidth = opts.image.width as number;

		if (opts.circle) opts.radius = Math.min(opts.width, opts.height) / 2;
		this.ctx.beginPath();

		if (opts.radius) {
			this.ctx.save();
			this.rect(opts);
			this.ctx.clip();
		}

		this.ctx.drawImage(
			opts.image,
			opts.cropX,
			opts.cropY,
			opts.cropWidth,
			opts.cropHeight,
			opts.x,
			opts.y,
			opts.width,
			opts.height
		);
		if (opts.radius) this.ctx.restore();

		return this;
	}
}
