// @ts-nocheck
import { debounce, IconButton, MenuItem, Select, Slider, TextField, Tooltip, Typography } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import "missing-native-js-functions";
import "./Template.css";
import AddIcon from "@material-ui/icons/Add";
import { useEffect } from "react";
import PaletteIcon from "@material-ui/icons/Palette";

interface Element {
	color?: boolean;
	text?: boolean;
	select?: string[];
	image?: boolean;
	radius?: number;
	attributes?: Record<string, Element>;
}

export function Template({
	elements,
	path,
	state,
	setState,
	children,
}: {
	children?: ReactNode;
	path: string;
	elements: Record<string, Element>;
	state: Record<string, string>;
	setState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
	const [preview, setPreview] = useState<string>();
	const [colors, setWholeColors] = useState<Record<string, { type: string; value: string[] }>>({});

	const setColors = (s: any) => setWholeColors({ ...state, ...s });

	useEffect(() => {
		setOwnState({ format: "svg" });
	}, []);

	useEffect(updateState, [state, setPreview]);

	function updateState() {
		var p = new URLSearchParams();
		for (let key in state) {
			if (!state[key]) continue;
			p.set(key, state[key]);
		}

		const origin = window.location.hostname === "localhost" ? "http://localhost:8080" : window.location.origin;

		setPreview(`${origin}/${path}?${p.toString()}`);
	}

	const setOwnState = (s: any) => {
		state = { ...state, ...s };
		setState(state);
		updateState();

		return state;
	};

	function renderFields(name: string, fields: Element) {
		return Object.entries(fields)
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([field, value]) => {
				if (!colors[name] && field === "color") colors[name] = { type: "color", value: [] };

				const color = colors[name];
				return (
					<div className="field" key={field}>
						{field === "color" && (
							<div className="color-picker">
								{color?.value.map((value, i) => (
									<input
										onChange={setColor.bind(null, name, i)}
										onContextMenuCapture={setColor.bind(null, name, i, false)}
										onDoubleClickCapture={setColor.bind(null, name, i, false)}
										className="color"
										type="color"
									/>
								))}

								<Tooltip title="Add Color">
									<IconButton onClick={() => setColor(name, color.value.length)}>
										<PaletteIcon component="svg" fontSize="small" />
									</IconButton>
								</Tooltip>
							</div>
						)}
						{field === "text" && (
							<TextField
								onChange={(e) => setOwnState({ ["text_" + name]: e.target.value })}
								value={state["text_" + name] || ""}
								size="small"
							></TextField>
						)}
						{field === "image" && (
							<TextField
								onChange={(e) => {
									setOwnState({
										["image_" + name]: e.target.value,
									});
								}}
								className="image-url"
								size="small"
								InputLabelProps={{ shrink: true }}
								label={"url"}
							></TextField>
						)}
						{field === "select" && (
							<Select defaultValue="" onChange={(e) => setOwnState({ [name]: e.target.value })}>
								{value.map((x: any) => (
									<MenuItem value={x}>{x.title()}</MenuItem>
								))}
							</Select>
						)}
						{field === "attributes" && renderElements(value, "attribute_" + name + "=")}
						{field === "radius" && (
							<>
								<Typography gutterBottom>Radius</Typography>
								<Slider
									defaultValue={0}
									onChange={(_, val) => setOwnState({ ["radius_" + name]: val })}
								/>
							</>
						)}
					</div>
				);
			});
	}

	const setColor = useCallback(
		debounce((name: string, index: number, e: Event | boolean) => {
			if (!name) return;
			const value = e?.target?.value || "#000000";
			const color = colors[name];

			if (e === false) color.value.splice(index, 1);
			else color.value[index] = value;

			if (color.value.length === 0) {
				setOwnState({ ["color_" + name]: undefined, ["gradient_" + name]: undefined });
			} else if (color.value.length === 1) {
				setOwnState({ ["color_" + name]: value, ["gradient_" + name]: undefined });
			} else {
				setOwnState({ ["color_" + name]: undefined, ["gradient_" + name]: color.value.join(";") });
			}
			setColors({ ...colors });
		}, 0),
		[setOwnState]
	);

	function renderElements(el: Record<string, Element>, prefix: string = "") {
		return Object.entries(el).map(([name, fields]) => (
			<div className="element" key={name}>
				<div className="name">{name}</div>

				<div className="fields">{renderFields(prefix + name, fields)}</div>
			</div>
		));
	}

	const seralizedPreview = preview?.replace("format=svg&", "");

	return (
		<div className="template">
			<h3>Elements:</h3>

			<div id="elements">
				{renderElements(elements)}
				{children}
				<div className="element">
					<TextField
						defaultValue={1}
						type="number"
						onChange={(e) => setOwnState({ scale: Number(e.target.value) })}
						InputLabelProps={{ shrink: true }}
						label={"Scale"}
					/>
				</div>
			</div>
			<br />
			<img className="preview" alt="rendered preview" src={preview} />

			<a
				style={{ margin: "1rem 0", display: "block", wordBreak: "break-all" }}
				rel="noreferrer"
				target="_blank"
				href={seralizedPreview}
			>
				{decodeURIComponent(seralizedPreview)}
			</a>
		</div>
	);
}
