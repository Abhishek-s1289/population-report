import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ICity, IReportModelData } from "../types/interfaces";
import AppComponent from "../Component";
import View from "sap/ui/core/mvc/View";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import Device from "sap/ui/Device";
import Event from "sap/ui/base/Event";
import MessageToast from "sap/m/MessageToast";
import Setting from "PopulationReport/js/Setting";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import SearchField from "sap/m/SearchField";
import BusyDialog from "sap/m/BusyDialog";
import Table from "sap/m/Table";
import BindingMode from "sap/ui/model/BindingMode";
import Input from "sap/m/Input";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace PopulationReport.controller
 */
export default class Report extends Controller {
	private _dialogs: { [key: string]: Dialog } = {}
	private _model: JSONModel;
	private _setting: Setting;

	public onInit(): void {
		this._setting = new Setting();
		const data: IReportModelData = {
			setting: this._setting,
			loading: false,
			CityListSet: []
		}
		this._model = new JSONModel(data);
		this._model.setDefaultBindingMode(BindingMode.TwoWay);
		(<View>this.getView()).setModel(this._model);
		this._loadCities();
	}

	public onAfterRendering(): void {
		const view = this.getView()
		view && view.addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());

		let searchField = <SearchField>this.byId('searchCity');
		searchField.attachLiveChange(this._debounceEventHOFn((eParameters: Record<string, any>)=>{
            let searchText: string = eParameters.newValue;
            this.handleSearch(searchText);
        }, 600, true));
	}

	public async handleSearch(searchValue: string){
		this._setting.filterData = searchValue?.trim() ? {field: 'name', text: searchValue} : null;
		await this._loadCities();
	}

	public async handleSort(oEvent: Event) {
		const mParams = oEvent.getParameters();
		const sPath = mParams['sortItem']?.getKey();
		const bDescending = mParams['sortDescending'];
		this._setting.sortData = sPath ? { field: sPath, criteria: bDescending ? 'desc' : 'asc' } : null;
		await this._loadCities();
	}

	private _toggleLoading(flag: boolean){
		this._model.setProperty("/loading", flag);
	}

	public async openSortDialog() {
		const oViewSettingsDialog = await this._getDialog("PopulationReport.fragment.SortDialog", true);
		oViewSettingsDialog.open();
	}
	public async onOpenCreateDialog(){
		const oCreateDialog = await this._getDialog("PopulationReport.fragment.CreateCity",);
		oCreateDialog.open();
	}

	private async _getDialog(sDialogFragmentName: string, persist: boolean = false): Promise<Dialog> {
		let oDialog = this._dialogs[sDialogFragmentName];
		if (!oDialog) {
			oDialog = <Dialog>await Fragment.load({ id: (<View>this.getView()).getId(), name: sDialogFragmentName, controller: this });
			if (Device.system.desktop) {
				oDialog.addStyleClass("sapUiSizeCompact");
			}
			persist && (this._dialogs[sDialogFragmentName] = oDialog);
		}
		return oDialog;
	}

	public async closeCreateDialog(action: 'save' | 'cancel'){
		const oDialog = <Dialog>this.byId('createCityDialog');
		if(action === 'cancel'){
			oDialog.close().destroy();
			return;
		}
		if(action === 'save'){
			const cityInput = <Input>this.getView().byId("cityInput");
			const areaInput = <Input>this.getView().byId("areaInput");
			const populationInput = <Input>this.getView().byId("populationInput");
			const name = cityInput.getValue()?.trim();
			const area = areaInput.getValue()?.trim();
			const population = populationInput.getValue()?.trim();
			if(!name || !area || !population){
				MessageBox.error('Please fill mandatory fields!');
				return;
			}
			await this._createCity({name: name, area:Number(area), population:Number(population)});
			oDialog.close().destroy();
		}
	}

	private async _loadCities() {
		this._toggleLoading(true);
		try{
			let url = '/api/odata/City';
			const odataQuery = this._setting.odataQuery;
			if(odataQuery){
				url = url + `?${odataQuery}`;
			}
			const cities = await this._sendRequest('GET', url);
			this._model.setProperty('/CityListSet', cities);
		}catch(err){
			MessageToast.show('Error while fetching cities !');
		}
		this._toggleLoading(false);
	}

	private async _createCity(cityPayload: {name:string, area:number, population:number}) {
		this._toggleLoading(true);
		try{
			let url = '/api/odata/City';
			const newCity = <ICity>await this._sendRequest('POST', url, cityPayload);
			const cities = <ICity[]>this._model.getProperty("/CityListSet");
			cities.unshift(newCity);
			this._model.refresh();
		}catch(err){
			MessageToast.show('Failed to add city !');
		}	
		this._toggleLoading(false);
	}

	private _sendRequest(method: 'GET' | 'POST', url: string, data?: any) {
		return new Promise((resolve, reject) => {
			const requestConfig = {
				url: url,
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				success: function (response, textStatus, xhr) {
					resolve(response);
				},
				error: function (xhr, textStatus, error) {
					reject(error);
				},
			};

			if (data) {
				requestConfig['data'] = JSON.stringify(data);
			}
			$.ajax(requestConfig);
		});
	}

	private _debounceEventHOFn(func: Function, delay: number = 500, passOnlyEvtParams: boolean) {
        let debounceTimer;
        return function() {
            clearTimeout(debounceTimer);
            const context = this;
            let args: IArguments = arguments;
			// Additional passOnlyEvtParams argument is required to keep event parameters. Otherwise, oEvent object will be cleared after the event life cycle.
            if(passOnlyEvtParams){
                const oEvent: Event = arguments[0];
                const eParameters: Record<string, any> = oEvent.getParameters();
                //@ts-ignore
                args = [eParameters]
            }
            debounceTimer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        }
    }
}