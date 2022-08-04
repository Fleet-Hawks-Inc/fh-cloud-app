import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService, HereMapService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Table } from 'primeng/table/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
    @ViewChild('dt') table: Table;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    environment = environment.isFeatureEnabled;
    dataMessage: string = Constants.FETCHING_DATA;
    allData: any = [];
    states: any = [];
    vehicleData = [];
    startDate = '';
    endDate = '';
    start = null;
    end = null;
    lastItemSK = '';
    datee = '';
    loaded = false;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    exportData = [];
    listView = true;
    visible = true;
    loadMsg: string = Constants.NO_LOAD_DATA;
    isSearch = false;
    get = _.get;
   _selectedColumns: any[];
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    public vehicleId;
    
     dataColumns = [
        { width: '10%', field: 'vehicleData', header: 'Vehicle', type: "text" },
        {  width: '10%', field: 'tripNo', header: 'Trip', type: "text" },
        { width: '10%', field: 'orderName', header: 'Order', type: "text" },
         { width: '10%', field: 'assetName', header: 'Assets', type: "text" },
        { width: '19%', field: 'driverName', header: 'Drivers', type: "text" },
        { width: '12%', field: 'uMiles', header: 'US Miles', type: "text" },
        { width: '14%', field: 'canMiles', header: 'Canada Miles', type: "text" },
        { width: '12%', field: 'miles', header: 'Total Miles', type: "text" },
    ];
    
    constructor(private apiService: ApiService,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private hereMap: HereMapService,
    protected _sanitizer: DomSanitizer,
    private modalService: NgbModal, ) { }


    async ngOnInit(): Promise<void> {
        this.end = moment().format("YYYY-MM-DD");
        this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
        this.vehicleId = this.route.snapshot.params[`vehicleId`];
        this.fetchVehicleListing();
        this.fetchVehicleName();
        this.setToggleOptions();
    }

    fetchVehicleName() {
        this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
            this.vehicleData = result.Items;
            console.log('datatotal',result.Items);
        });
    }

    onScroll = async (event: any) => {
        if (this.loaded) {
            this.fetchVehicleListing();
            this.fetchVehicleName();
        }
        this.loaded = false;
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

  fetchVehicleListing() {
        if (this.lastItemSK !== 'end') {
            this.apiService.getData(`vehicles/fetch/TripData?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}&lastKey=${this.lastItemSK}&date=${this.datee}`).subscribe((result: any) => {
                this.allData = this.allData.concat(result.Items)
                if (result.Items.length === 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND
                }
                
                if (result.LastEvaluatedKey !== undefined) {
                    this.lastItemSK = encodeURIComponent(result.Items[result.Items.length - 1].tripSK);
                    this.datee = encodeURIComponent(result.Items[result.Items.length - 1].dateCreated)
                }
                else {
                    this.lastItemSK = 'end';
                }
                this.loaded = true;

                for (let veh of result.Items) {
                    let dataa = veh
                    veh.miles = 0
                    for (let element of dataa.tripPlanning) {
                        veh.miles += Number(element.miles);
                    }
                }
                if (result.Items.length === 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND
                }

            });
        }
    }
    
    
    fetchFullExport() {
        this.apiService.getData(`vehicles/fetch/vehicelActivity/list?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
            this.exportData = result.Items;
            for (let veh of this.exportData) {
                let dataa = veh
                veh.miles = 0

                for (let element of dataa.tripPlanning) {
                    veh.miles += Number(element.miles);
                }
            }
            this.generateCSV();
        });
    }

    searchFilter() {
        if (this.start != null && this.end != null) {
            if (this.start != null && this.end == null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            } else if (this.start == null && this.end != null) {
                this.toastr.error('Please select both start and end dates.');
                return false;
            } else if (this.start > this.end) {
                this.toastr.error('Start Date should be less then end date.');
                return false;
            }
            else {
                this.lastItemSK = '';
                this.allData = []
                this.dataMessage = Constants.FETCHING_DATA;
                this.fetchVehicleListing();
                this.fetchVehicleName();
            }
        } else {
            return false;
        }
    }
    
     refreshData() {
        this.end = moment().format("YYYY-MM-DD");
        this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
        this.allData = []
        this.lastItemSK = '';
        this.loaded = false;
        this.fetchVehicleListing();
        this.fetchVehicleName();
        this.dataMessage = Constants.FETCHING_DATA;
    }

    generateCSV() {
        if (this.exportData.length > 0) {
            let dataObject = []
            let csvArray = []
            this.exportData.forEach(element => {
                let location = ''
                let date = '';
                let usMiles = '';
                let canMiles = ''
                let usState = '';
                let canState = '';
                for (let i = 0; i < element.tripPlanning.length; i++) {
                    const element2 = element.tripPlanning[i];
                    date += `"${element2.type} :-  ${element2.date}\n\"`
                    element2.location = element2.location.replace(/,/g, ' ');
                    location += `"${element2.type} :-  ${element2.location}\n\"`
                }
               
                    if (element.provinceData && element.provinceData.length > 0) {
                        for (let i = 0; i < element.provinceData.length; i++) {
                            const element2 = element.provinceData[i];
                            for(let j = 0; j< element2.usProvince.length; j++)
                            {
                              const element3 = element2.usProvince[j];
                              usState += `"${element3.StCntry}\n\"`;
                              usMiles += `"${element3.Total}\n\"`;
                            }
                            for (let k = 0; k < element2.canProvince.length; k++) {
                                const element4 = element2.canProvince[k];
                                 canState += `"${element4.StCntry}\n\"`;
                                 canMiles += `"${element4.Total}\n\"`;
        
                                    }
                                }
                              }
                            let obj = {}
                            obj["Vehicle"] = element.vehicle.replace(/, /g, ' &');
                            obj["Trip#"] = element.tripNo;
                            obj["Order#"] = element.orderName.replace(/, /g, ' &');
                            obj["Assets"] = element.assetName;
                            obj["Drivers"] = element.driverName.replace(/, /g, ' &');
                            obj["location"] = location;
                            obj["Date"] = date;
                            obj["Province(US)"] = usState;
                            obj["US Miles"] = usMiles;
                            obj["US(Total)"] = element.usMiles;
                            obj["Province(Canada)"] = canState; 
                            obj["Canada Miles"] = canMiles;
                            obj["Canada(Total)"] = element.canMiles;
                            obj["Total Miles"] = element.miles;
                            dataObject.push(obj)
                            console.log('export',obj);
                });
                console.log('export2',dataObject);
            let headers = Object.keys(dataObject[0]).join(',')
            headers += ' \n'
            csvArray.push(headers)

            dataObject.forEach(element => {
                let obj = Object.values(element).join(',')
                obj += ' \n'
                csvArray.push(obj)
            });
            const blob = new Blob(csvArray, { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${moment().format("YYYY-MM-DD:HH:m")}vehicleActivity-Report.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        else {
            this.toastr.error("No Records found")
        }
    }
    
    clear(table: Table) {
        table.clear();
    }
}