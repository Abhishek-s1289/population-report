import { City } from "../entity/City";
import { type Token, TokenType } from "odata-v4-parser/lib/lexer";
import Utils from "../util/Utils";
import path from "path";
import type { IExternalCityJSON, IInternalCityJSON } from "types/interfaces";

export default class CityService {

    private _cityJsonPath: string = path.join(__dirname, "../../data/cities.json");
    private _cookedCities: IExternalCityJSON[];

    /**
     * 
     * @returns 
     */
    public async getAllCities(): Promise<IExternalCityJSON[]> {
        let cities = await this._loadCities();
        return cities;
    }

    public async getSomeCity(queryOptions: Token[]): Promise<IExternalCityJSON[]>{
        let cities = await this._loadCities();
        //based on queryoptions, filter, orderby or etc and return result
        let filterNode = queryOptions.find(option => option.type === TokenType.Filter);
        if (filterNode) {
            cities = Utils.gI().filterEntitySet(cities, filterNode.value)
        }

        let orderByNode = queryOptions.find(option => option.type === TokenType.OrderBy);
        if (orderByNode) {
            cities = Utils.gI().sortEntitySet(cities, orderByNode);
        }
        return cities;
    }

    public async addCity(payload: IInternalCityJSON): Promise<IExternalCityJSON>{
        //sanitize newCityPayload
        let newCity = new City(payload);
        let rawCities = JSON.parse(await Utils.gI().readFromJSON(this._cityJsonPath, 'utf-8'));
        rawCities.push(newCity.getInternalJSON());
        await Utils.gI().writeToJSON(this._cityJsonPath, JSON.stringify(rawCities), "utf-8");
        this._cookedCities = null;
        return newCity.getExternalJSON();
    }

    private async _loadCities():Promise<IExternalCityJSON[]>{
        if (!this._cookedCities) {
            let rawCities = await Utils.gI().readFromJSON(this._cityJsonPath, "utf-8");
            this._cookedCities = JSON.parse(rawCities).map((c) => new City(c).getExternalJSON());
        }
        return this._cookedCities;
    }
}
