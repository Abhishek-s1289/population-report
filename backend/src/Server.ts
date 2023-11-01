import http from "http";
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

class Server {
    private _server: http.Server;
	private _app: Application;
	private _port = process.env.PORT || 8080;

	constructor() {
		this._app = express();
        this._server = http.createServer(this._app);
		this._configureMiddleware();
		this._configureRoutes();
	}
	
	/**
	 * This method starts the server
	 */
	public start(): void {
		this._server.listen(this._port, () => {
			console.log(`Server is running on port ${this._port}`);
		});
	}

	private _configureMiddleware(): void {
		//TODO:
	}

	private _configureRoutes(): void { 
		this._app.get("/", (req: Request, res: Response) => {
			res.send("Hello!");
		});
	}
}
new Server().start();
