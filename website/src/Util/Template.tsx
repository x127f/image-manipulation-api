import { debounce, IconButton, MenuItem, Select, TextField, Tooltip } from "@material-ui/core";
import { useCallback, useState } from "react";
import "missing-native-js-functions";
import "./Template.css";
import AddIcon from "@material-ui/icons/Add";
import { useEffect } from "react";

interface Element {
	color?: boolean;
	text?: boolean;
	select?: string[];
	image?: boolean;
	attributes?: Record<string, string[]>;
}

export function Template({
	elements,
	path,
	defaultState,
}: {
	path: string;
	elements: Record<string, Element>;
	defaultState: Record<string, string>;
}) {
	const [preview, setPreview] = useState<string>(`http://imac:8080/${path}`);
	const [state, setWholeState] = useState<Record<string, string>>({});
	const [colors, setWholeColors] = useState<Record<string, { type: string; value: string[] }>>({});

	const setColors = (s: any) => setWholeColors({ ...state, ...s });

	useEffect(() => {
		setState(defaultState || {});
	}, []);

	const setState = (s: any) => {
		const newState = { ...state, ...s };
		setWholeState(newState);

		var p = new URLSearchParams();
		for (let key in newState) {
			if (!newState[key]) continue;
			p.set(key, newState[key]);
		}

		setPreview(`http://imac:8080/${path}?${p.toString()}`);
		return newState;
	};

	function renderFields(name: string, fields: Element) {
		return (
			Object.entries(fields)
				.sort(([a], [b]) => b.localeCompare(a))
				// @ts-ignore
				.map(([field, value]) => {
					if (!colors[name] && field === "color") colors[name] = { type: "color", value: [] };

					const color = colors[name];
					return (
						<div className="field" key={field}>
							{field === "color" && (
								<div className="color-picker">
									{color?.value.map((value, i) => (
										<input
											// @ts-ignore
											onChange={setColor.bind(null, name, i)}
											// @ts-ignore
											onDoubleClickCapture={setColor.bind(null, name, i, false)}
											className="color"
											type="color"
										/>
									))}

									<Tooltip title="Add Color">
										<IconButton
											// @ts-ignore
											onClick={() => setColor(name, color.value.length)}
										>
											<AddIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</div>
							)}
							{field === "text" && (
								<TextField
									onChange={(e) => setState({ ["text_" + name]: e.target.value })}
									value={state["text_" + name] || ""}
									variant="filled"
									size="small"
									label={"text_" + name}
								></TextField>
							)}
							{field === "image" && (
								<TextField
									onChange={(e) => {
										setState({
											["image_" + name]: e.target.value,
										});
									}}
									className="image-url"
									variant="filled"
									size="small"
									label={"image_" + name}
								></TextField>
							)}
							{field === "select" && (
								<Select onChange={(e) => setState({ [name]: e.target.value })}>
									{value.map((x) => (
										<MenuItem value={x}>{x.title()}</MenuItem>
									))}
								</Select>
							)}
							{field === "attributes" && renderElements(value, "attribute_" + name + "=")}
						</div>
					);
				})
		);
	}

	const setColor = useCallback(
		// @ts-ignore
		debounce((name: string, index: number, e: Event | boolean) => {
			if (!name) return;
			// @ts-ignore
			const value = e?.target?.value || "#000000";
			const color = colors[name];

			if (e === false) color.value.splice(index, 1);
			else color.value[index] = value;

			if (color.value.length === 0) {
				setState({ ["color_" + name]: undefined, ["gradient_" + name]: undefined });
			} else if (color.value.length === 1) {
				setState({ ["color_" + name]: value, ["gradient_" + name]: undefined });
			} else {
				setState({ ["color_" + name]: undefined, ["gradient_" + name]: color.value.join(";") });
			}
			setColors({ ...colors });
		}, 50),
		[setState]
	);

	function renderElements(el: Record<string, Element>, prefix: string = "") {
		return Object.entries(el).map(([name, fields]) => (
			<div className="element" key={name}>
				<div className="name">{name}</div>

				<div className="fields">{renderFields(prefix + name, fields)}</div>
			</div>
		));
	}

	return (
		<div className="template">
			<h3>Elements:</h3>

			<div id="elements">
				{renderElements(elements)}
				<div className="element">
					<TextField
						defaultValue={1}
						type="number"
						onChange={(e) => setState({ scale: Number(e.target.value) })}
						label={"Scale"}
					/>
				</div>
			</div>
			<img className="preview" alt="rendered preview" src={preview} />

			<a
				style={{ margin: "1rem 0", display: "block", wordBreak: "break-all" }}
				rel="noreferrer"
				target="_blank"
				href={preview}
			>
				{preview}
			</a>
		</div>
	);
}
