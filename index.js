const config = require("./config.json");
var cluster = require("cluster");
var path = require("path");

var cores = require("os").cpus().length;
if (!config.production) cores = 1;

if (cluster.isMaster) {
	for (var i = 0; i < cores; i++) {
		cluster.fork();
	}
	cluster.on("online", function (worker) {
		console.log("Worker " + worker.process.pid + " is online.");
	});
	cluster.on("exit", function (worker, code, signal) {
		console.log("worker " + worker.process.pid + " died.");
		cluster.fork();
	});
} else {
	const server = require("./server");
}
