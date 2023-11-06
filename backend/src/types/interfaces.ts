import type { Token } from "odata-v4-parser/lib/lexer";
import { type Request, type Response } from "express";

export interface IInternalCityJSON{
    name: string,
    area: number,
    population: number
}

export interface IExternalCityJSON extends IInternalCityJSON{
    density: number
}

export interface IRequest extends Request{
	oDataQueryAst?: Token;
}

export interface IResponse extends Response{}
