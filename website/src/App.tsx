import "./App.css";
import svg from "../../assets/templates/discord/RankCardCenter.svg";
import Template from "../../src/templates/Template.ts";

console.log(Template);

function App() {
	return (
		<div className="App">
			<img src={svg}></img>
			<header className="App-header">
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
