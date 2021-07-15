import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services';
import { ApiService } from 'src/app/services/api.service';
import  Constants  from '../../../fleet/constants';

@Component({
    selector: 'app-settlements-list',
    templateUrl: './settlements-list.component.html',
    styleUrls: ['./settlements-list.component.css']
})
export class SettlementsListComponent implements OnInit {
    dataMessage: string = Constants.FETCHING_DATA;
    drivers = [];
    carriers = [];
    ownerOperators = [];
    settlements = [];
    tripsObj = [];
    constructor(private apiService: ApiService, private accountService: AccountService) { }

    ngOnInit() {
        this.fetchDrivers();
        this.fetchCarriers();
        this.fetchOwnerOperators();
        this.fetchSettlements();
        this.fetchTrips();
    }

    fetchDrivers() {
        this.apiService.getData(`drivers/get/list`)
            .subscribe((result: any) => {
                console.log('drivers result', result);
                this.drivers = result;
            })
    }

    fetchCarriers() {
        this.apiService.getData(`contacts/get/list/carrier`)
            .subscribe((result: any) => {
                this.carriers = result;
                console.log('this.carriers', result);
            })
    }

    fetchOwnerOperators() {
        this.apiService.getData(`contacts/get/list/ownerOperator`)
            .subscribe((result: any) => {
                this.ownerOperators = result;
            })
    }

    fetchSettlements() {
        this.accountService.getData(`settlement`)
            .subscribe((result: any) => {
                console.log('this.settlements', result);
                if(result.length == 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND;
                }
                this.settlements = result;
            })
    }

    fetchTrips() {
        this.apiService.getData(`trips/get/list`)
            .subscribe((result: any) => {
                this.tripsObj = result;
            })
    }

}
