import cluster from "cluster";
import { Server, HTTPError } from "lambert-server";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { cpus } from "os";
import process from "process";
import rateLimit from "express-rate-limit";
require("dotenv").config();
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
	const errorHandler = (err: Error | HTTPError, req: Request, res: Response, next: NextFunction) => {
		console.log(err);
		// @ts-ignore
		const code = typeof err.code === "number" ? err.code : 400;
		res.set("error", err?.toString())
			.status(code)
			.sendFile(path.join(__dirname, "..", "assets", "errors", `${code}.png`));
	};

	const server = new Server({
		port: Number(process.env.PORT) || 8080,
		host: "0.0.0.0",
		production: false,
		errorHandler,
	});
	server.app.use(
		rateLimit({
			windowMs: 1000,
			max: 4,
		})
	);
	server.app.use((req, res, next) => {
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "*");
		res.set("Access-Control-Allow-Methods", "*");
		next();
	});

	await server.registerRoutes(path.join(__dirname, "routes_new", "/"));
	server.app.use(express.static(path.join(__dirname, "..", "website", "build")));
	server.app.use("*", (req, res, next) => {
		next(new HTTPError("not found", 404));
	});
	server.app.use(errorHandler);
	await server.start();
}
