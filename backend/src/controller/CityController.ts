import { Router } from "express";
import CityService from "../service/CityService";
import { IRequest, IResponse } from "types/interfaces";

export default class CityController {
	public router: Router = Router();
	private _cityService: CityService = new CityService();

	constructor() {
		this._initializeRoutes();
	}

	private _initializeRoutes() {
		this.router.get("/City", this._handleGet.bind(this));
		this.router.post("/City", this._handlePost.bind(this));
	}

	private async _handleGet(req: IRequest, res: IResponse) {
		try{
			let result = null;
			if(req.oDataQueryAst?.value?.options?.length){
				result = await this._cityService.getSomeCity(req.oDataQueryAst.value.options);
			}else{
				result = await this._cityService.getAllCities();
			}
			res.send(result);
		}catch(e){
			res.status(500).send({message: "Failed to fetch city(s)!"});
		}
	}

	private async _handlePost(req: IRequest, res: IResponse) {
		try{
			let result = await this._cityService.addCity(req.body);
			res.send(result);
		}catch(e){
			res.status(500).send({message: "Failed to add city!"});
		}
	}
}
