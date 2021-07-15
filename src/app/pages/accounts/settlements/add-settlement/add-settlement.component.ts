import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService, ApiService, ListService } from '../../../../services';
import Constants from '../../../fleet/constants';

@Component({
    selector: 'app-add-settlement',
    templateUrl: './add-settlement.component.html',
    styleUrls: ['./add-settlement.component.css']
})
export class AddSettlementComponent implements OnInit {

    noRecordMsg: string = Constants.NO_RECORDS_FOUND;
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
        finalTotal: 0
    }
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    drivers = [];
    carriers = [];
    ownerOperators = [];
    additionRowData = {
        tripID: null,
        chargeName: '',
        desc: '',
        amount: '',
        currency: 'CAD'
    };
    deductionRowData = {
        tripID: null,
        chargeName: '',
        desc: '',
        amount: '',
        currency: 'CAD'
    }
    selectedTrips = [];
    trips = [];
    vehicles = [];
    assets = [];
    tripsObject = [];
    orders = [];
    driverDetail;
    driverId = '';
    errors = {};
    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error: string = '';
    Success: string = '';
    submitDisabled = true;
    settlementID;
    settledTrips = [];
    oldTrips = [];

    constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

    ngOnInit() {
        this.settlementID = this.route.snapshot.params['settlementID'];
        if (this.settlementID) {
            this.fetchSettlementDetail();
        }
        this.fetchDrivers();
        this.fetchCarriers();
        this.fetchOwnerOperators();
        this.fetchVehicles();
        this.fetchAssets();
        this.fetchOrders();
    }

    fetchDrivers() {
        this.apiService.getData(`drivers/get/list`)
            .subscribe((result: any) => {
                this.drivers = result;
            })
    }

    fetchDriverDetail(driverID) {
        this.driverId = driverID;
        this.apiService.getData(`drivers/${driverID}`)
            .subscribe((result: any) => {
                this.driverDetail = result.Items[0];
            })
    }

    fetchVehicles() {
        this.apiService.getData(`vehicles/get/list`)
            .subscribe((result: any) => {
                this.vehicles = result;
            })
    }

    fetchAssets() {
        this.apiService.getData(`assets/get/list`)
            .subscribe((result: any) => {
                this.assets = result;
            })
    }

    fetchOrders() {
        this.apiService.getData(`orders/get/list`)
            .subscribe((result: any) => {
                this.orders = result;
            })
    }

    fetchTrips() {
        this.apiService.getData(`trips/driver/unsettled?entityID=${this.settlementData.entityId}&startDate=${this.settlementData.fromDate}&endDate=${this.settlementData.toDate}`)
            .subscribe((result: any) => {

                this.trips = result.Items;

                for (let i = 0; i < this.trips.length; i++) {
                    const element = this.trips[i];
                    element.pickupLocation = '';
                    element.dropLocation = '';
                    element.carrID = [];
                    let pickCount = 1;
                    let dropCount = 1;
                    element.selected = false;

                    for (let j = 0; j < element.tripPlanning.length; j++) {
                        const plan = element.tripPlanning[j];

                        if (plan.type == 'Pickup') {
                            element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                            pickCount++;
                        }

                        if (plan.type == 'Delivery') {
                            element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                            dropCount++;
                        }

                        if (plan.carrierID !== '') {
                            if (!element.carrID.includes(plan.carrierID)) {
                                element.carrID.push(plan.carrierID);
                            }
                        }
                    }

                }

                let stlObj = result.Items.reduce((a: any, b: any) => {
                    return a[b['tripID']] = (b['isDeleted'] == 1) ? b['tripNo'] + '  - Deleted' : b['tripNo'], a;
                }, {});

                this.tripsObject = _.merge(this.tripsObject, stlObj);
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
            })
    }

    addAdditionalExp() {
        if (this.additionRowData.tripID != null && this.additionRowData.chargeName != '' && this.additionRowData.amount != '') {
            this.settlementData.addition.push(this.additionRowData);
            this.additionRowData = {
                tripID: null,
                chargeName: '',
                desc: '',
                amount: '',
                currency: 'CAD'
            }
            this.calculateAddTotal();
        }
    }

    adddeductionExp() {
        if (this.deductionRowData.tripID != null && this.deductionRowData.chargeName != '' && this.deductionRowData.amount != '') {
            this.settlementData.deduction.push(this.deductionRowData);
            this.deductionRowData = {
                tripID: null,
                chargeName: '',
                desc: '',
                amount: '',
                currency: 'CAD'
            }
            this.calculateDedTotal();
        }
    }

    delTripAddData(index, type) {
        if (type === 'additional') {
            this.settlementData.addition.splice(index, 1);
            this.calculateAddTotal();
        } else {
            this.settlementData.deduction.splice(index, 1);
            this.calculateDedTotal();
        }
    }

    calculateAddTotal() {
        this.settlementData.additionTotal = 0;
        for (let i = 0; i < this.settlementData.addition.length; i++) {
            const element = this.settlementData.addition[i];
            this.settlementData.additionTotal += parseFloat(element.amount);
        }
        this.calculateFinalTotal();
    }

    calculateDedTotal() {
        this.settlementData.deductionTotal = 0;
        for (let i = 0; i < this.settlementData.deduction.length; i++) {
            const element = this.settlementData.deduction[i];
            this.settlementData.deductionTotal += parseFloat(element.amount);
        }
        this.calculateFinalTotal();
    }

    calculateFinalTotal() {
        this.settlementData.finalTotal = this.settlementData.paymentTotal + this.settlementData.additionTotal - this.settlementData.deductionTotal;
    }

    selectedTrip() {
        this.settlementData.tripIds = [];
        this.settlementData.miles.tripsLoaded = 0;
        this.settlementData.miles.tripsTotal = 0;
        this.settlementData.miles.tripsEmpty = 0;
        this.settlementData.miles.tripsTeam = 0;
        this.settlementData.miles.teamHours = 0;
        this.settlementData.miles.totalHours = 0;
        this.settlementData.miles.driverTotal = 0;
        this.settlementData.miles.driverLoaded = 0;
        this.settlementData.miles.driverEmpty = 0;
        this.settlementData.miles.driverHours = 0;
        this.settlementData.paymentTotal = 0;
        this.selectedTrips = [];
        this.settlementData.expenses = [];

        this.paymentCalculation(this.trips);
        if(this.settledTrips.length > 0) {
            this.paymentCalculation(this.settledTrips);
        }
    }

    paymentCalculation(trips) {
        for (let i = 0; i < trips.length; i++) {
            const element = trips[i];
            if (element.selected) {
                if(!this.settlementData.tripIds.includes(element.tripID)) {
                    this.settlementData.tripIds.push(element.tripID);
                }
                
                this.selectedTrips.push(element);

                for (let t = 0; t < element.tripPlanning.length; t++) {
                    const plan = element.tripPlanning[t];
                    this.settlementData.miles.tripsTotal += parseFloat(plan.miles);

                    if (plan.mileType == 'loaded') {
                        this.settlementData.miles.tripsLoaded += parseFloat(plan.miles);
                    } else if (plan.mileType == 'empty') {
                        this.settlementData.miles.tripsEmpty += parseFloat(plan.miles);
                    }

                    // selected driver miles and payment calculation
                    if (plan.driverID === this.driverId) {
                        this.settlementData.miles.driverTotal += parseFloat(plan.miles);
                        if (plan.mileType == 'loaded') {
                            this.settlementData.miles.driverLoaded += parseFloat(plan.miles);
                        } else if (plan.mileType == 'empty') {
                            this.settlementData.miles.driverEmpty += parseFloat(plan.miles);
                        }
                        // driver_hours will be from ELD
                        this.settlementData.miles.driverHours += parseFloat('10');

                        let paymentInfo = this.driverDetail.paymentDetails;
                        if (paymentInfo.paymentType === 'Pay Per Mile') {
                            let loadedMilesPayment = this.settlementData.miles.driverLoaded * parseFloat(paymentInfo.loadedMiles);
                            let emptyMilesPayment = this.settlementData.miles.driverEmpty * parseFloat(paymentInfo.emptyMiles);

                            this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
                        } else if (paymentInfo.paymentType === 'Pay Per Hour') {
                            this.settlementData.paymentTotal = this.settlementData.miles.driverHours * parseFloat(paymentInfo.rate);
                        }
                    }

                    // team_miles, total_hours and team_hours will be from ELD
                    if (element.driverIDs.length > 0) {
                        this.settlementData.miles.tripsTeam += parseFloat('10');
                        this.settlementData.miles.teamHours += parseFloat('2');
                    }
                    this.settlementData.miles.totalHours += parseFloat('2');
                }

                // Expenses will also come from ELD
                let expObj = {
                    tripID: element.tripID,
                    expName: `Expense ${i + 1}`,
                    desc: '-',
                    amount: '50',
                    currency: 'CAD'
                }
                this.settlementData.expenses.push(expObj);
            }
        }
        this.calculateFinalTotal();
    }

    addRecord() {
        this.submitDisabled = true;
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        this.accountService.postData('settlement', this.settlementData).subscribe({
            complete: () => { },
            error: (err: any) => {
                from(err.error)
                    .pipe(
                        map((val: any) => {
                            val.message = val.message.replace(/".*"/, 'This Field');
                            this.errors[val.context.key] = val.message;
                        })
                    )
                    .subscribe({
                        complete: () => {
                            this.submitDisabled = false;
                            // this.throwErrors();
                        },
                        error: () => {
                            this.submitDisabled = false;
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.submitDisabled = false;
                this.response = res;
                this.toaster.success('Settlement added successfully.');
                this.router.navigateByUrl('/accounts/settlements/list');
            },
        });
    }

    fetchSettlementDetail() {
        this.accountService.getData(`settlement/detail/${this.settlementID}`)
            .subscribe((result: any) => {
                this.settlementData = result[0];
                if (this.settlementData.tripIds.length > 0) {
                    this.oldTrips = this.settlementData.tripIds;
                    let stldTrips = encodeURIComponent(JSON.stringify(this.settlementData.tripIds));
                    this.fetchSettledTrips(stldTrips);
                }
                if(this.settlementData.fromDate == undefined) {
                    this.settlementData.fromDate = null;
                }
                if(this.settlementData.toDate == undefined) {
                    this.settlementData.toDate = null;
                }
                this.fetchTrips();
                if(this.settlementData.type === 'driver') {
                    this.fetchDriverDetail(this.settlementData.entityId);
                }
            })
    }

    fetchSettledTrips(tripIds) {
        this.apiService.getData(`trips/driver/settled?entities=${tripIds}`)
            .subscribe((result: any) => {

                this.settledTrips = result;

                for (let i = 0; i < this.settledTrips.length; i++) {
                    const element = this.settledTrips[i];
                    element.pickupLocation = '';
                    element.dropLocation = '';
                    element.carrID = [];
                    let pickCount = 1;
                    let dropCount = 1;
                    element.selected = true;
                    this.selectedTrips.push(element);

                    for (let j = 0; j < element.tripPlanning.length; j++) {
                        const plan = element.tripPlanning[j];

                        if (plan.type == 'Pickup') {
                            element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                            pickCount++;
                        }

                        if (plan.type == 'Delivery') {
                            element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                            dropCount++;
                        }

                        if (plan.carrierID !== '') {
                            if (!element.carrID.includes(plan.carrierID)) {
                                element.carrID.push(plan.carrierID);
                            }
                        }
                    }
                }

                let stlObj = result.reduce((a: any, b: any) => {
                    return a[b['tripID']] = (b['isDeleted'] == 1) ? b['tripNo'] + '  - Deleted' : b['tripNo'], a;
                }, {});
                this.tripsObject = _.merge(this.tripsObject, stlObj);
            })
    }

    remStldTrip(tripID, index) {
        if (confirm('Are you sure you want to remove the selected trip?') === true) {
            //  Function to remove specific trip
            let delTripIndex = this.settlementData.tripIds.indexOf(tripID);
            this.settlementData.tripIds.splice(delTripIndex, 1);
            this.settledTrips[index].selected = false;
            let trpData = this.settledTrips[index];
            this.trips.push(trpData);
            this.settledTrips.splice(index, 1);

            this.settlementData.expenses.map((v, expIndex)=> {
                if(v.tripID == tripID) {
                    this.settlementData.expenses.splice(expIndex,1);
                }
            });

            this.settlementData.addition.map((v, addIndex) => {
                if(v.tripID == tripID) {
                    this.settlementData.addition.splice(addIndex,1);
                }
            })

            this.settlementData.deduction.map((v, dedIndex) => {
                if(v.tripID == tripID) {
                    this.settlementData.deduction.splice(dedIndex,1);
                }
            })

            this.calculateAddTotal();
            this.calculateDedTotal();
            this.selectedTrip();
            this.paymentCalculation(this.settledTrips);

            this.accountService.putData(`settlement/un-settle/trip/${this.settlementID}?entity=${tripID}`, this.settlementData).subscribe({
                complete: () => { },
                error: (err: any) => {
                    from(err.error)
                        .pipe(
                            map((val: any) => {
                                val.message = val.message.replace(/".*"/, 'This Field');
                                this.errors[val.context.key] = val.message;
                            })
                        )
                        .subscribe({
                            complete: () => {
                                this.submitDisabled = false;
                                // this.throwErrors();
                            },
                            error: () => {
                                this.submitDisabled = false;
                            },
                            next: () => {
                            },
                        });
                },
                next: (res) => {
                    this.submitDisabled = false;
                    this.response = res;
                    this.toaster.success('Trip removed successfully.');
                },
            });
        }
    }

    updateRecord() {
        this.submitDisabled = true;
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        let newAddedTrips = _.difference(this.settlementData.tripIds , this.oldTrips);
        this.settlementData['new'] = newAddedTrips;

        this.accountService.putData(`settlement/update/${this.settlementID}`, this.settlementData).subscribe({
            complete: () => { },
            error: (err: any) => {
                from(err.error)
                    .pipe(
                        map((val: any) => {
                            val.message = val.message.replace(/".*"/, 'This Field');
                            this.errors[val.context.key] = val.message;
                        })
                    )
                    .subscribe({
                        complete: () => {
                            this.submitDisabled = false;
                            // this.throwErrors();
                        },
                        error: () => {
                            this.submitDisabled = false;
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.submitDisabled = false;
                this.response = res;
                this.toaster.success('Settlement updated successfully.');
                this.router.navigateByUrl('/accounts/settlements/list');
            },
        });
    }
}
