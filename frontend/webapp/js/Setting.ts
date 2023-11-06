export default class Setting{
	public filterData: {field: string, text: string};
	public get hasFilter(): boolean{
		if(this.filterData?.field){
			return true;
		}
		return false;
	}
	public get $filter(): string{
		if(this.filterData?.field && this.filterData?.text){
			return `$filter=contains(${this.filterData.field}, '${this.filterData.text}')`;
		}
		return null;
	}
	public sortData: {field: string, criteria: 'asc' | 'desc'};

	//this getter field can be binded with the sort button, to know whether sort has been applied or not
	public get hasSort(): boolean{
		if(this.sortData?.field){
			return true;
		}
		return false;
	}
	public get $orderby(): string{
		if (this.sortData?.field && this.sortData?.criteria) {
			return `$orderby=${this.sortData.field} ${this.sortData.criteria}`;
		}
		return null;
	}

    public get odataQuery(): string{
        const queryParams = [];
        if(this.filterData?.field){
            queryParams.push(this.$filter);
        }
        if(this.sortData?.field){
            queryParams.push(this.$orderby);
        }
        return queryParams.join('&');
    }
}