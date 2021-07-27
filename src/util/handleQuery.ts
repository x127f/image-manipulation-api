import { Gradient, Template } from "../templates/Template";
import { HTTPError } from "lambert-server";
import { ParsedQs } from "qs";

export function handleQuery(query: ParsedQs, template: Template<string, string>) {
	return Promise.all(
		Object.keys(query).map(async (key) => {
			const [type, ...elements] = key.split("_");
			const element = elements.join("_");
			const value = query[key];
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
				case "attribute":
					const [id, name] = element.split("=");
					console.log("set attribute", { element, name, value });
					template.setAttribute(id, name, value);
					break;
				case "scale":
					template.setScale(Number(value));
					break;
				case "image":
					await template.loadImage(element, value);
					break;
				default:
			}
		})
	);
}
