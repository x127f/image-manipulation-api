import cluster from "cluster";
import { Server, HTTPError } from "lambert-server";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { cpus } from "os";
import process from "process";
const numCPUs = cpus().length;

if (cluster.isMaster) {
	console.log(`Primary ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	main().caught();
}

async function main() {
	const server = new Server({
		port: Number(process.env.PORT) || 8080,
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
	server.app.use(express.static(path.join(__dirname, "..", "website", "build")));
	server.app.use("*", (req, res) => {
		res.status(404).sendFile(path.join(__dirname, "..", "assets", "404.png"));
	});
	await server.start();
}
