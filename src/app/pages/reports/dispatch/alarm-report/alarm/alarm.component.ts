import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService } from 'src/app/services'
import Constant from 'src/app/pages/fleet/constants'
import { CurrencyPipe } from '@angular/common'
import * as moment from 'moment'
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../../services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import Constants from 'src/app/pages/fleet/constants'

declare var $: any;

@Component({
    selector: 'app-alarm',
    templateUrl: './alarm.component.html',
    styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {



    @ViewChild('dt') table: Table;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    lastEvaluatedKey = undefined;
    loadMsg: string = Constants.NO_LOAD_DATA;
    autoCarrier = [];
    beverageRack = [];
    flatbed = [];
    controlledTemp = [];
    isChecked = false;
    headCheckbox = false;
    closeResult = '';
    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error = '';
    Success = '';
    message: any;
    totalRecords = 10;
    pageLength = 10;
    loaded = false
    _selectedColumns: any[];
    get = _.get;
    isSearch = false;
    alarm = []
    visible = true;

    dataColumns = [
        { field: 'alAssetName', header: 'Alarm Name', type: "text" },
        { field: 'alDeviceNo', header: 'Device Number', type: "text" },
        { field: 'alTripNo', header: 'Trip Number', type: "text" },
        { field: 'highTemp', header: 'Hight Temp', type: "text" },
        { field: 'lowTemp', header: 'Low Temp', type: "text" },
    ];

    constructor(private apiService: ApiService,
        private currencyPipe: CurrencyPipe,
        private spinner: NgxSpinnerService,
        private httpClient: HttpClient,
        private hereMap: HereMapService,
        private toastr: ToastrService) { }

    async ngOnInit(): Promise<void> {
        await this.initDataTable();
        this.setToggleOptions();
        //this.fetchOrderReport();
    }

    async initDataTable() {
        let result;
        if (this.lastEvaluatedKey != undefined) {
            result = await this.apiService.getData('alarms/report/get/' + this.lastEvaluatedKey).toPromise();
        }
        else {
            result = await this.apiService.getData('alarms/report/get').toPromise();
        }
        result.data.forEach((item) => {
            if (item.alTempCelsius === 0) {
                item.highTemp = `${item.highTemp} Fahrenheit`;
                item.lowTemp = `${item.lowTemp} Fahrenheit`;
            }
            else {
                item.highTemp = `${item.highTemp} Celsius`;
                item.lowTemp = `${item.lowTemp} Celsius`;
            }
        });
        this.dataMessage = Constants.NO_RECORDS_FOUND;
        this.loaded = true;
        if (result.nextKey !== undefined) {
            this.lastEvaluatedKey = result.nextKey;
        }
        else {
            this.lastEvaluatedKey = undefined;
        }
        this.alarm = this.alarm.concat(result.data);
        this.loaded = true;
        this.isSearch = false;
    }

    setToggleOptions() {
        this.selectedColumns = this.dataColumns;
    }

    @Input() get selectedColumns(): any[] {
        return this._selectedColumns;
    }

    set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
    }

    onScroll = async (event: any) => {
        if (this.loaded) {
            this.initDataTable();
        }
        this.loaded = false;
    }

    refreshData() {
        this.alarm = [];
        this.lastEvaluatedKey = undefined;
        this.loaded = false;
        this.initDataTable();
        this.dataMessage = Constants.FETCHING_DATA;
    }
    
     generateAlarmsCSV() {
        if (this.alarm.length > 0) {
            let dataObject = []
            let csvArray = []
            this.alarm.forEach(element => {
                let obj = {}
                obj["Alarm Name"] = element.alAssetName
                obj["Device Number"] = element.alDeviceNo
                obj["Trip Number"] = element.alTripNo
                obj["Hight Temp"] = element.highTemp
                obj["Low Temp"] = element.lowTemp 
                dataObject.push(obj)
            });
            let headers = Object.keys(dataObject[0]).join(',')
            headers += '\n'
            csvArray.push(headers)
            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += '\n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}Driver-Report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found")
        }
    }
    

    someClickHandler(info: any): void {
        this.message = info.id + ' - ' + info.firstName;
    }

    valuechange() {
        this.visible = !this.visible;
    }

    clear(table: Table) {
        table.clear();
    }
}
