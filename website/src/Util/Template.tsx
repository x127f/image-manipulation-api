// @ts-nocheck
import { debounce, IconButton, MenuItem, Select, Slider, TextField, Tooltip, Typography } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import "missing-native-js-functions";
import "./Template.scss";
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

export function useBetterState(val?: any, delay?: number) {
	var [state, setState] = useState(val);
	const setTimedState = useCallback(
		debounce((s: any) => {
			state = { ...state, ...s };
			setState(state);

			return state;
		}, delay || 50),
		[setState, state]
	);
	return [state, setTimedState];
}

export function Template(opts: {
	children?: ReactNode;
	path: string;
	elements: Record<string, Element>;
	state: Record<string, string>;
	setState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
	var { elements, path, state, children } = opts;
	const setState = (val) => {
		opts.setState(val);
		updateState();
	};
	const [preview, setPreview] = useState<string>();
	const [colors, setWholeColors] = useState<Record<string, { type: string; value: string[] }>>({});

	const setColors = (s: any) => setWholeColors({ ...state, ...s });

	useEffect(() => {
		setState({ format: "svg" });
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

	function renderFields(name: string, fields: Element) {
		if (!colors[name]) colors[name] = { type: "color", value: [] };

		const color = colors[name];

		return (
			<>
				<td className="field color">
					{fields.color && (
						<div className="color-picker">
							<Tooltip title="Add Color">
								<IconButton onClick={() => setColor(name, color.value.length)}>
									<PaletteIcon component="svg" fontSize="small" />
								</IconButton>
							</Tooltip>
							{color?.value.map((value, i) => (
								<input
									onChange={setColor.bind(null, name, i)}
									onContextMenuCapture={(e) => e.preventDefault() || setColor(name, i, false)}
									onDoubleClickCapture={setColor.bind(null, name, i, false)}
									className="color"
									type="color"
								/>
							))}
						</div>
					)}
				</td>
				<td className="field text image attributes select">
					{fields.text && (
						<TextField
							onChange={(e) => setState({ ["text_" + name]: e.target.value })}
							value={state["text_" + name] || ""}
							size="small"
						></TextField>
					)}
					{fields.image && (
						<TextField
							onChange={(e) => {
								setState({
									["image_" + name]: e.target.value,
								});
							}}
							className="image-url"
							size="small"
							InputLabelProps={{ shrink: true }}
							label={"url"}
						></TextField>
					)}
					{fields.select && (
						<Select defaultValue="" onChange={(e) => setState({ [name]: e.target.value })}>
							{fields.select.map((x: any) => (
								<MenuItem value={x}>{x.title()}</MenuItem>
							))}
						</Select>
					)}
					{fields.attributes && renderElements(fields.attributes, "attribute_" + name + "=")}
				</td>
				<td className="field radius">
					{fields.radius && (
						<>
							<Typography gutterBottom>Radius</Typography>
							<Slider defaultValue={0} onChange={(_, val) => setState({ ["radius_" + name]: val })} />
						</>
					)}
				</td>
			</>
		);
	}

	const setColor = useCallback(
		debounce((name: string, index: number, e: Event | boolean) => {
			if (!name) return;
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
			return false;
		}, 0),
		[setState]
	);

	function renderElements(el: Record<string, Element>, prefix: string = "") {
		return Object.entries(el).map(([name, fields]) => (
			<tr className="element" key={name}>
				<td className="name">{name}</td>

				{/* <div className="fields"> */}
				{renderFields(prefix + name, fields)}
				{/* </div> */}
			</tr>
		));
	}

	const seralizedPreview = preview?.replace("&format=svg", "");

	return (
		<div className="template">
			<table id="elements">
				<tr>
					<th>Element</th>
					<th>Color</th>
					<th>Text</th>
				</tr>
				{renderElements(elements)}
				{children}
				<tr className="element">
					<td class="name">Scale</td>
					<td className="field color"></td>
					<td className="field">
						<TextField
							defaultValue={1}
							type="number"
							onChange={(e) => setState({ scale: Number(e.target.value) })}
						/>
					</td>
				</tr>
			</table>
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
