import type Setting from "PopulationReport/js/Setting"

export interface ICity{
    name: string,
    area: number,
    density: number,
    population: number
}

export interface IReportModelData{
    setting: Setting,
    loading: boolean,
    CityListSet: ICity[]
}