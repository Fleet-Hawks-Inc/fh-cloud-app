import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services';
import { ApiService } from 'src/app/services/api.service';
import Constants from '../../../fleet/constants';

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
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    filter = {
        startDate: null,
        endDate: null,
        type: null,
        settlementNo: ''
    }

    constructor(private apiService: ApiService, private accountService: AccountService, private toaster: ToastrService) { }

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
                this.drivers = result;
            })
    }

    fetchCarriers() {
        this.apiService.getData(`contacts/get/list/carrier`)
            .subscribe((result: any) => {
                this.carriers = result;
            })
    }

    fetchOwnerOperators() {
        this.apiService.getData(`contacts/get/list/ownerOperator`)
            .subscribe((result: any) => {
                this.ownerOperators = result;
                console.log('ownerOperators', this.ownerOperators);
            })
    }

    fetchSettlements() {
        this.accountService.getData(`settlement/paging?type=${this.filter.type}&settlementNo=${this.filter.settlementNo}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
            .subscribe((result: any) => {
                if (result.length == 0) {
                    this.dataMessage = Constants.NO_RECORDS_FOUND;
                }
                this.settlements = result;
                this.settlements.map((v) => {
                    v.entityType = v.type.replace('_', ' ');
                })
            })
    }

    fetchTrips() {
        this.apiService.getData(`trips/get/list`)
            .subscribe((result: any) => {
                this.tripsObj = result;
            })
    }

    searchFilter() {
        if (this.filter.type !== null || this.filter.settlementNo !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
            this.dataMessage = Constants.FETCHING_DATA;
            this.settlements = [];
            this.fetchSettlements();
        }
    }

    resetFilter() {
        this.dataMessage = Constants.FETCHING_DATA;
        this.filter = {
            startDate: null,
            endDate: null,
            type: null,
            settlementNo: ''
        }
        this.fetchSettlements();
    }

    deleteSettlement(settlementID) {
        this.accountService.getData(`settlement/delete/${settlementID}`)
          .subscribe((result: any) => {
            this.fetchSettlements();
            this.toaster.success('Settlement deleted successfully.');
          })
    }
}
