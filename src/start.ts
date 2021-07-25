import { Server, HTTPError } from "lambert-server";
import { NextFunction, Request, Response } from "express";
import path from "path";

async function main() {
	const server = new Server({
		port: 8080,
		host: "0.0.0.0",
		production: false,
		errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => {
			console.log(err);
			res.set("error", err?.toString()).status(400).sendFile(path.join(__dirname, "..", "assets", "400.png"));
		},
	});
	server.app.use((req, res, next) => {
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "*");
		res.set("Access-Control-Allow-Methods", "*");
		next();
	});

	await server.registerRoutes(path.join(__dirname, "routes_new", "/"));
	server.app.use("*", (req, res) => {
		res.status(404).sendFile(path.join(__dirname, "..", "assets", "404.png"));
	});
	await server.start();
}

main().catch(console.error);
