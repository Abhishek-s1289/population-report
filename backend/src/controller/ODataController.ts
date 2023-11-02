import { Router, type Request, type Response, type NextFunction } from "express";
import CityController from "./CityController";

export default class ODataController {
	public router: Router = Router();

	constructor() {
		this._initializeMiddlewares();
		this._initializeRoutes();
	}

	private _initializeMiddlewares() {
		this.router.use((req: Request, res: Response, next: NextFunction)=>{
			//TODO: Odatauri parsing
			next();
		});
	}

	// Add all the entity controllers here.
	private _initializeRoutes() {
		const cityController = new CityController();
        this.router.use(cityController.router);
    }
}

