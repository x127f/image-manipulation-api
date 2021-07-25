import { useState } from "react";

export default function useForceUpdate(): [Function, number] {
	const [value, setValue] = useState(0); // integer state
	return [() => setValue((value) => value + 1), value]; // update the state to force render
}
