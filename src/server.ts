import http from "node:http";
import app from "./app";
import { envConfig } from "./config";

const server = http.createServer(app);

const main = async () => {
	try {
		server.listen(envConfig.PORT, () => {
			console.log(`Server is listening on port:${envConfig.PORT}.`);
			console.info(`Go to base end point: http://localhost:${envConfig.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

main();

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);

	server.close(() => {
		console.log("Server is closed due to unhandled rejection");
		process.exit(1);
	});
});

process.on("uncaughtException", (error) => {
	console.log("Uncaught Exception thrown:", error);
	server.close(() => {
		console.log("Server is closed due to uncaught exception");
		process.exit(1);
	});
});
