import { Router, type Request, type Response } from "express";

export default class CityController {
	public router: Router = Router();

	constructor() {
		this._initializeRoutes();
	}

	private _initializeRoutes() {
		this.router.get("/city", this._get.bind(this));
		this.router.post("/city", this._post.bind(this));
	}

	private async _get(req: Request, res: Response) {
		res.send("GET /city");
	}

	private async _post(req: Request, res: Response) {
		res.send("POST /city");
	}
}
