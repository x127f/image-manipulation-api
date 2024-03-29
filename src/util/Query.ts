import { Gradient, RenderMode, Template } from "../templates/Template";
import { ParsedQs } from "qs";
import { Response, Request } from "express";

export function handleQuery(query: ParsedQs, template: Template<string, string>) {
	const scale = Number(query.scale);
	const opacity = Number(query.opacity);
	// background_opacity

	if (scale > 0 && scale << 10) template.setScale(scale);
	if (opacity) template.setAttribute("background_opacity", "opacity", `${opacity / 100}`);

	return Promise.all(
		Object.keys(query).map(async (key) => {
			const [type, ...elements] = key.split("_");
			const element = elements.join("_");
			var value = query[key] as string;
			if (typeof value !== "string") return;

			switch (type) {
				case "color":
					template.setColor(element, value);
					break;
				case "text":
					template.setText(element, value);
					break;
				case "gradient":
					const gradient = new Gradient({});
					const colors = value.split(";");
					var i = 0;
					for (const x of colors) {
						let [color, offset] = x.split(",");
						// @ts-ignore
						if (!offset) offset = (100 / (colors.length - 1)) * i++;

						gradient.add(color, Number(offset));
					}
					template.setGradient(element, gradient);
					break;
				case "radius":
					template.setAttribute(element, "r", value, true);
					template.setAttribute(element, "rx", value);
					template.setAttribute(element, "ry", value);
					template.setAttribute(element + "_radius", "rx", value);
					template.setAttribute(element + "_radius", "ry", value);
					break;
				case "opacity":
					template.setAttribute(element, "opacity", `${Number(value) / 100}`);
					break;
				case "blur":
					template.dom("#blur feGaussianBlur").attr("stdDeviation", value);
					template.setAttribute(element, "filter", `url(#blur`);
					break;
				case "image":
					await template.loadImage(element, value);
					break;
			}
		})
	);
}

export async function render(req: Request, res: Response, template: Template<string, string>) {
	res.set("Cache-Control", "public, max-age=31536000");
	switch (req.query.format) {
		case "svg":
			return res.type("image/svg+xml").send(await template.toXML());
		case "jpg":
		case "jpeg":
			return res.type("image/jpeg").send(await template.toJPEG());
		default:
		case "png":
			return res.type("image/png").send(await template.toPNG({ mode: RenderMode.SHARP_CONVERTER }));
			return res.type("image/png").send(await template.toPNG({ mode: RenderMode.NODE_CANVAS_RENDERER }));
	}
}
