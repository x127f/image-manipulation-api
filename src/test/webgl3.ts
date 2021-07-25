import fs from "fs";
import THREE, {
	AmbientLight,
	BoxBufferGeometry,
	Camera,
	Clock,
	FlatShading,
	FontLoader,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	MeshDepthMaterial,
	MeshNormalMaterial,
	MeshStandardMaterial,
	OrthographicCamera,
	PerspectiveCamera,
	Scene,
	TextGeometry,
	TextureLoader,
	WebGLRenderer,
} from "three";
import initCore from "3d-core-raub";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const width = 1280;
const height = 720;
const pixelRatio = 1;
const fps = 60;
const moveSpeed = 10;
const rotateSpeed = 0.02;
const keys = new Set();

var frameCount = 0;
var elapsedTime = 0;
var lastTime = Date.now();
const webgl = initCore({ width, height }); // no opts is fine too
const { window, document, requestAnimationFrame } = webgl;
const pixels = new Uint8Array(width * height * 4);

var camera: Camera;
var scene: Scene;
var renderer: WebGLRenderer;
var text: Mesh;
var mesh: Mesh;
var controls: any;
const clock = new Clock();
init();

function init() {
	// camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 10000);
	camera = new PerspectiveCamera(70, width / height, 1, 10000);

	camera.position.z = 500;

	renderer = new WebGLRenderer();
	renderer.setPixelRatio(pixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	scene = new Scene();

	var geometry = new BoxBufferGeometry(200, 200, 200);
	// var material = new MeshBasicMaterial({ map: texture });
	// @ts-ignore
	var material = new MeshStandardMaterial({
		color: 0xffffff,
	});

	mesh = new Mesh(geometry, material);
	mesh.position.set(0, 0, 0);

	scene.add(mesh);

	// @ts-ignore
	document.body.appendChild(renderer.domElement);
	window.on("resize", onWindowResize);

	const loader = new FontLoader();
	const font1 = JSON.parse(
		fs.readFileSync(path.join(__dirname, "..", "..", "assets", "fonts", "helvetiker_bold.typeface.json"), {
			encoding: "utf8",
		})
	);

	const font = loader.parse(font1);
	const textGeometry = new TextGeometry("Hello js!", {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5,
	});
	var textMaterial = new MeshNormalMaterial({
		// @ts-ignore
		flatShading: FlatShading,
		transparent: true,
		opacity: 0.9,
	});

	text = new Mesh(textGeometry, textMaterial);
	text.position.set(-300, 0, -100);

	scene.add(text);

	setInterval(requestAnimationFrame.bind(null, animate), 1000 / fps);
	// requestAnimationFrame(animate);
}

function onWindowResize() {
	// camera.aspect = window.innerWidth / window.innerHeight;
	// camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

document.on("keydown", (event) => {
	keys.add(event.which);
	requestAnimationFrame(animate);
});
document.on("keyup", (event) => {
	keys.delete(event.which);
	requestAnimationFrame(animate);
});

function animate() {
	// requestAnimationFrame(animate);
	const delta = clock.getDelta();

	const now = Date.now();
	mesh.rotation.x = now * 0.0005;
	mesh.rotation.y = now * 0.001;
	renderer.render(scene, camera);

	if (keys.has(87)) {
		// w
		camera.position.z -= moveSpeed;
	}
	if (keys.has(83)) {
		// s
		camera.position.z += moveSpeed;
	}
	if (keys.has(65)) {
		// a
		camera.position.x -= moveSpeed;
	}
	if (keys.has(68)) {
		// d
		camera.position.x += moveSpeed;
	}
	if (keys.has(32)) {
		// space
		camera.position.y += moveSpeed;
	}
	if (keys.has(16)) {
		// shift
		camera.position.y -= moveSpeed;
	}
	if (keys.has(37)) {
		// left
		camera.rotation.y += rotateSpeed;
	}
	if (keys.has(38)) {
		// up
		camera.rotation.x += rotateSpeed;
	}
	if (keys.has(39)) {
		// right
		camera.rotation.y -= rotateSpeed;
	}
	if (keys.has(40)) {
		// down
		camera.rotation.x -= rotateSpeed;
	}
	if (keys.has(80)) {
		camera.rotation.set(0, 0, 0);
		camera.position.set(0, 0, 500);
	}

	frameCount++;
	elapsedTime += now - lastTime;

	lastTime = now;

	if (elapsedTime >= 1000) {
		elapsedTime -= 1000;

		console.log(frameCount, (delta * 1000).toFixed() + "ms");
		frameCount = 0;
	}

	// gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	// await sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } })
	// 	.png()
	// 	.toBuffer();
	// .pipe(fs.createWriteStream("test.png"));
}
