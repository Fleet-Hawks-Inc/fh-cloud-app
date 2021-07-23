import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';

@Component({
    selector: 'app-settlements-detail',
    templateUrl: './settlements-detail.component.html',
    styleUrls: ['./settlements-detail.component.css']
})
export class SettlementsDetailComponent implements OnInit {

    noRecordMsg: string = Constants.NO_RECORDS_FOUND;
    settlementID = '';
    driverDetail = {
        firstName: '',
        lastName: '',
        paymentDetails:{
            paymentType: ''
        }
    };
    settlementData = {
        type: null,
        entityId: null,
        setNo: '',
        setDate: null,
        fromDate: null,
        toDate: null,
        tripIds: [],
        miles: {
            tripsTotal: 0,
            driverTotal: 0,
            tripsLoaded: 0,
            driverLoaded: 0,
            tripsEmpty: 0,
            driverEmpty: 0,
            tripsTeam: 0,
            driverHours: 0,
            teamHours: 0,
            totalHours: 0
        },
        expenses: [],
        addition: [],
        deduction: [],
        additionTotal: 0,
        deductionTotal: 0,
        paymentTotal: 0,
        taxes: 0,
        finalTotal: 0,
        transactionLog: [],
    }
    tripsObj = [];
    accounts = [];
    operatorDetail = {
        companyName: '',
        paymentDetails:{
            payrollType: ''
        }
    };

    entityName = "";
    entityPaymentType = "";

    constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService) { }

    ngOnInit() {
        this.settlementID = this.route.snapshot.params['settlementID'];
        this.fetchSettlementDetail();
        this.fetchTrips();
        this.fetchAccounts();
    }

    fetchSettlementDetail() {
        this.accountService.getData(`settlement/detail/${this.settlementID}`)
            .subscribe((result: any) => {
                this.settlementData = result[0];
                if (this.settlementData.type === 'driver') {
                    this.fetchDriverDetail(this.settlementData.entityId);
                } else {
                    this.fetchContact(this.settlementData.entityId);
                }
            })
    }

    fetchDriverDetail(driverID) {
        this.apiService.getData(`drivers/${driverID}`)
            .subscribe((result: any) => {
                this.driverDetail = result.Items[0];
                this.entityName  = `${this.driverDetail.firstName} ${this.driverDetail.lastName} `;
                this.entityPaymentType = this.driverDetail.paymentDetails.paymentType;
            })
    }

    fetchContact(contactID) {
        this.apiService.getData(`contacts/detail/${contactID}`)
            .subscribe((result: any) => {
                this.operatorDetail = result.Items[0];
                this.entityName  = this.operatorDetail.companyName;
                this.entityPaymentType = this.operatorDetail.paymentDetails.payrollType;
            })
    }

    fetchTrips() {
        this.apiService.getData(`trips/get/list`)
            .subscribe((result: any) => {
                this.tripsObj = result;
            })
    }

    fetchAccounts() {
        this.accountService.getData(`chartAc/get/internalID/list/all`)
          .subscribe((result: any) => {
            this.accounts = result;
          })
      }

}
