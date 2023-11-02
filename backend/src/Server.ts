import http from "http";
import express, { type Application } from "express";
import dotenv from "dotenv";
import ODataController from "./controller/ODataController";

dotenv.config();

class Server {
	private _server: http.Server;
	private _app: Application;
	private _port = process.env.PORT || 8080;

	constructor() {
		this._app = express();
		this._server = http.createServer(this._app);
		this._configureGlobalMiddlewares();
		this._configureRoutes();
	}

	public start(): void {
		this._server.listen(this._port, () => {
			console.log(`Server is running on port ${this._port}`);
		});
	}

	private _configureGlobalMiddlewares(): void {
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
	}

	private _configureRoutes(): void {
		const oDataController = new ODataController();
		this._app.use("/api/odata", oDataController.router);
	}
}

new Server().start();
