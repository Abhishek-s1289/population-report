import { Router, type NextFunction } from "express";
import { odataUri } from "odata-v4-parser";
import CityController from "./CityController";
import type { IRequest, IResponse } from "types/interfaces";
 
export default class ODataController {
	public router: Router = Router();

	constructor() {
		this._initializeMiddlewares();
		this._initializeRoutes();
	}

	private _initializeMiddlewares() {
		this.router.use((req: IRequest, res: IResponse, next: NextFunction) => {
			if(req.method === 'GET'){
				req.oDataQueryAst = odataUri(decodeURI(req.url)).value.query || null;
			}
			next();
		});
	}

	private _initializeRoutes() {
		const cityController = new CityController();
		this.router.use(cityController.router);
	}
}
