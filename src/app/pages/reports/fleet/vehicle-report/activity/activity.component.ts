import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';

import * as _ from 'lodash';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
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
    dataMessage = Constants.FETCHING_DATA;
    date = new Date();
    exportData = [];
    usStateArr: any;
    element3: any;
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    public vehicleId;
    constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }


    ngOnInit(): void {
        this.end = moment().format("YYYY-MM-DD");
        this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
        this.vehicleId = this.route.snapshot.params[`vehicleId`];
        this.fetchVehicleListing();
        this.fetchVehicleName();
    }

    fetchVehicleName() {
        this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
            this.vehicleData = result.Items;
        });
    }

    onScroll() {
        if (this.loaded) {
            this.fetchVehicleListing();
            this.fetchVehicleName();
        }
        this.loaded = false;
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

                for (let veh of this.allData) {
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

    fetchFullExport(type = '') {
        this.apiService.getData(`vehicles/fetch/vehicelActivity/list?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
            this.exportData = result.Items;
            for (let veh of this.exportData) {
                let dataa = veh
                veh.miles = 0

                for (let element of dataa.tripPlanning) {
                    veh.miles += Number(element.miles);
                }
            }
            this.generateCSV(type);

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

    generateCSV(type = '') {
        if (this.exportData.length > 0) {
            let dataObject = []
            let csvArray = []
            this.exportData.forEach(element => {
                let location = ''
                let date = ''
                let Miles = 0
                let usMiles = ''
                let canMiles = ''
                let usState = ''
                let canState = ''
                let stateArr = [];
                for (let i = 0; i < element.tripPlanning.length; i++) {
                    const element2 = element.tripPlanning[i];
                    date += `"${element2.type} :-  ${element2.date}\n\"`
                    element2.location = element2.location.replace(/,/g, ' ');
                    location += `"${element2.type} :-  ${element2.location}\n\"`
                }
                if (type === 'CAN') {
                    stateArr = element.canStatesData;
                } else if (type === 'US') {
                    stateArr = element.usStatesData;
                }
                stateArr.forEach((tripUSState, stateIndex) => {
                    if (element.provinceData && element.provinceData.length > 0) {
                        for (let i = 0; i < element.provinceData.length; i++) {
                            const element2 = element.provinceData[i];

                            for (let k = 0; k < element2.canProvince.length; k++) {
                                const element4 = element2.canProvince[k];
                                canState += `"${element4.StCntry}\n\"`;
                                canMiles += `"${element4.Total}\n\"`;
                            }
                            let obj = {}
                            obj["Vehicle"] = element.vehicle.replace(/, /g, ' &');
                            obj["Trip#"] = element.tripNo;
                            obj["Order#"] = element.orderName.replace(/, /g, ' &');
                            obj["location"] = location;
                            obj["Date"] = date;
                            if (type === 'US') {
                                obj["Province(US)"] = element2.usProvince[stateIndex].StCntry;
                                obj["US Province Miles"] = element2.usProvince[stateIndex].Total;
                                obj["US(Total)"] = element.usMiles;
                            }
                            else {
                                obj["Province(Canada)"] = element2.canProvince[stateIndex].StCntry;
                                obj["Canada Total Miles"] = element2.canProvince[stateIndex].Total;
                                obj["Canada(Total)"] = element.canMiles;
                            }
                            obj["Total Miles"] = element.miles;
                            dataObject.push(obj)
                        }
                    }
                });
            });
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
}