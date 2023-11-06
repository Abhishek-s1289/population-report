import type { IExternalCityJSON, IInternalCityJSON } from "types/interfaces";

export class City {
    private _name: string;
    private _area: number;
    private _population: number;
    
    // transient field.
    private get _density():number{
        return Math.floor(this._population/this._area);
    }

    constructor(json: {[key: string]: any}){
        this._name = json['name'];
        this._area = json['area'];
        this._population = json['population'];
    }

    //dont include transient fields
    public getInternalJSON(): IInternalCityJSON{
        return { 
            name:this._name, 
            area:this._area, 
            population:this._population 
        };
    }

    //include all the fields
    public getExternalJSON(): IExternalCityJSON{
        return { 
            ...this.getInternalJSON(), 
            density:this._density
        };
    }
}