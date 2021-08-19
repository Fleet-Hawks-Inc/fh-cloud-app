import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService, ApiService, ListService } from '../../../../services';
import Constants from '../../../fleet/constants';
import { Location } from '@angular/common';
@Component({
    selector: 'app-add-settlement',
    templateUrl: './add-settlement.component.html',
    styleUrls: ['./add-settlement.component.css']
})
export class AddSettlementComponent implements OnInit {

    tripMsg = Constants.NO_RECORDS_FOUND;
    noRecordMsg: string = Constants.NO_RECORDS_FOUND;
    settlementData = {
        type: null,
        entityId: null,
        setNo: '',
        txnDate: moment().format('YYYY-MM-DD'),
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
            totalHours: 0,
            drivers: [],
            driverLoadedTeam: 0,
            driverEmptyTeam: 0,
        },
        expenses: [],
        addition: [],
        deduction: [],
        additionTotal: 0,
        deductionTotal: 0,
        taxObj: {
            gstPrcnt:0,
            pstPrcnt:0,
            hstPrcnt:0,
            gstAmount:0,
            pstAmount:0,
            hstAmount:0,
            carrLocalTax:0,
            carrLocalAmount: 0,
            carrFedTax: 0,
            carrFedAmount: 0,
        },
        paymentTotal: 0,
        taxes:0,
        subTotal: 0,
        finalTotal:0,
        status: 'unpaid',
        paymentLinked: false,
        pendingPayment: 0,
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
    submitDisabled = false;
    settlementID;
    settledTrips = [];
    oldTrips = [];
    contactDetail;
    operatorDrivers = '';
    operatorDriversList = [];
    searchDisabled = false;
    finalPayment = 0;
    expenses = [];
    constructor(private listService: ListService, private route: ActivatedRoute,private location: Location, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

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
    cancel() {
      this.location.back(); // <-- go back to previous location on cancel
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
        this.apiService.getData(`trips/driver/unsettled?type=${this.settlementData.type}&entityID=${this.settlementData.entityId}&startDate=${this.settlementData.fromDate}&endDate=${this.settlementData.toDate}&operatorDrivers=${this.operatorDrivers}`)
            .subscribe((result: any) => {
                this.searchDisabled = false;
                this.trips = result.Items;
                if(result.Items.length === 0) {
                    this.tripMsg = Constants.NO_RECORDS_FOUND;
                }
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
            this.settlementData.additionTotal += Number(element.amount);
        }
        this.calculateFinalTotal();
    }

    calculateDedTotal() {
        this.settlementData.deductionTotal = 0;
        for (let i = 0; i < this.settlementData.deduction.length; i++) {
            const element = this.settlementData.deduction[i];
            this.settlementData.deductionTotal += Number(element.amount);
        }
        this.calculateFinalTotal();
    }

    calculateFinalTotal() {
        this.settlementData.taxes = 0;
        this.settlementData.subTotal = this.settlementData.paymentTotal + this.settlementData.additionTotal - this.settlementData.deductionTotal;
        if(this.settlementData.type == 'carrier') {

            if(this.settlementData.taxObj.carrLocalTax != 0) {
              this.settlementData.taxObj.carrLocalAmount = this.settlementData.subTotal*this.settlementData.taxObj.carrLocalTax/100;
            }
            if(this.settlementData.taxObj.carrFedTax != 0) {
              this.settlementData.taxObj.carrFedAmount = this.settlementData.subTotal*this.settlementData.taxObj.carrFedTax/100;
            }
            this.settlementData.taxes = this.settlementData.taxObj.carrLocalAmount + this.settlementData.taxObj.carrFedAmount;
            let midTerm  = this.settlementData.subTotal - Number(this.settlementData.taxes);
            this.settlementData.finalTotal = +midTerm.toFixed(2);
        } else if(this.settlementData.type == 'owner_operator') {
            this.settlementData.finalTotal = +this.settlementData.subTotal.toFixed(2);
            this.calculateTaxes();
        } else {
            this.settlementData.finalTotal = +this.settlementData.subTotal.toFixed(2);
        }

        if(this.settlementData.finalTotal == 0) {
            this.submitDisabled = true;
        }
        this.limitDecimals();
    }

    limitDecimals() {
        this.settlementData.miles.driverTotal = Number(this.settlementData.miles.driverTotal.toFixed(2));
        this.settlementData.miles.driverLoaded = Number(this.settlementData.miles.driverLoaded.toFixed(2));
        this.settlementData.miles.driverEmpty = Number(this.settlementData.miles.driverEmpty.toFixed(2));
        this.settlementData.miles.tripsTeam = Number(this.settlementData.miles.tripsTeam.toFixed(2));
        this.settlementData.miles.tripsTotal = Number(this.settlementData.miles.tripsTotal.toFixed(2));
        this.settlementData.miles.tripsLoaded = Number(this.settlementData.miles.tripsLoaded.toFixed(2));
        this.settlementData.miles.tripsEmpty = Number(this.settlementData.miles.tripsEmpty.toFixed(2));
        this.settlementData.additionTotal = Number(this.settlementData.additionTotal.toFixed(2));
        this.settlementData.deductionTotal = Number(this.settlementData.deductionTotal.toFixed(2));
        this.settlementData.paymentTotal = Number(this.settlementData.paymentTotal.toFixed(2));
        this.settlementData.taxes = Number(this.settlementData.taxes.toFixed(2));
        this.settlementData.subTotal = Number(this.settlementData.subTotal.toFixed(2));
        this.settlementData.finalTotal = Number(this.settlementData.finalTotal.toFixed(2));
        this.settlementData.pendingPayment = Number(this.settlementData.pendingPayment.toFixed(2));
        this.settlementData.taxObj.gstPrcnt = Number(this.settlementData.taxObj.gstPrcnt.toFixed(2));
        this.settlementData.taxObj.pstPrcnt = Number(this.settlementData.taxObj.pstPrcnt.toFixed(2));
        this.settlementData.taxObj.hstPrcnt = Number(this.settlementData.taxObj.hstPrcnt.toFixed(2));
        this.settlementData.taxObj.gstAmount = Number(this.settlementData.taxObj.gstAmount.toFixed(2));
        this.settlementData.taxObj.pstAmount = Number(this.settlementData.taxObj.pstAmount.toFixed(2));
        this.settlementData.taxObj.hstAmount = Number(this.settlementData.taxObj.hstAmount.toFixed(2));
        this.settlementData.taxObj.carrLocalTax = (this.settlementData.taxObj.carrLocalTax)? Number(this.settlementData.taxObj.carrLocalTax) : 0;
        this.settlementData.taxObj.carrFedTax = (this.settlementData.taxObj.carrFedTax) ? Number(this.settlementData.taxObj.carrFedTax) : 0;
        this.settlementData.taxObj.carrLocalAmount = Number(this.settlementData.taxObj.carrLocalAmount.toFixed(2));
        this.settlementData.taxObj.carrFedTax = (this.settlementData.taxObj.carrFedTax) ? Number(this.settlementData.taxObj.carrFedTax) : 0;
        this.settlementData.taxObj.carrFedAmount = Number(this.settlementData.taxObj.carrFedAmount.toFixed(2));
        this.finalPayment = this.settlementData.finalTotal;

        if (this.settlementData.type === 'owner_operator') {
            this.deductFromOwnerOperator();
        }
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
        this.settlementData.miles.driverLoadedTeam = 0;
        this.settlementData.miles.driverEmptyTeam = 0;
        this.selectedTrips = [];
        this.settlementData.expenses = [];
        this.settlementData.miles.drivers.map((v) => {
            v.total = 0;
            v.loaded = 0;
            v.empty = 0;
            v.hours = 0;
            v.payment = 0;
        })

        this.paymentCalculation(this.trips);
        if(this.settledTrips.length > 0) {
            this.paymentCalculation(this.settledTrips);
        }
    }

    paymentCalculation(trips) {
        let drvrPay = 0;
        let teamMiles = 0;
        for (let i = 0; i < trips.length; i++) {
            const element = trips[i];
            let deliveryCount = 0;
            if (element.selected) {
                if (!this.settlementData.tripIds.includes(element.tripID)) {
                    this.settlementData.tripIds.push(element.tripID);
                }
console.log('this.settlementData.tripIds', this.settlementData.tripIds);
this.fetchExpenses(this.settlementData.tripIds);
                this.selectedTrips.push(element);

                if (this.settlementData.type === 'driver' || this.settlementData.type === 'carrier') {
                    for (let t = 0; t < element.tripPlanning.length; t++) {
                        const plan = element.tripPlanning[t];
                        this.settlementData.miles.tripsTotal += Number(plan.miles);

                        if (plan.coDriverID) {
                            teamMiles += Number(plan.miles);
                            this.settlementData.miles.tripsTeam = Number(teamMiles.toFixed(2));
                        }

                        if (plan.mileType === 'loaded') {
                            this.settlementData.miles.tripsLoaded += Number(plan.miles);
                        } else if (plan.mileType === 'empty') {
                            this.settlementData.miles.tripsEmpty += Number(plan.miles);
                        }

                        if (plan.type === 'Delivery') {
                            deliveryCount += 1;
                        }

                        // selected driver miles calculation
                        if (plan.driverID === this.driverId) {
                            this.settlementData.miles.driverTotal += Number(plan.miles);
                            if (plan.mileType === 'loaded') {
                                if (plan.coDriverID) {
                                    this.settlementData.miles.driverLoadedTeam += Number(plan.miles);
                                } else {
                                    this.settlementData.miles.driverLoaded += Number(plan.miles);
                                }
                            } else if (plan.mileType === 'empty') {
                                if (plan.coDriverID) {
                                    this.settlementData.miles.driverEmptyTeam += Number(plan.miles);
                                } else {
                                    this.settlementData.miles.driverEmpty += Number(plan.miles);
                                }
                            }
                        }
                    }

                    if (this.settlementData.type === 'driver') {
                        // driver_hours will be from ELD
                        this.settlementData.miles.driverHours = 0;

                        let paymentInfo = this.driverDetail.paymentDetails;
                        paymentInfo.loadedMilesTeam = (paymentInfo.loadedMilesTeam) ? paymentInfo.loadedMilesTeam : 0;
                        paymentInfo.emptyMilesTeam = (paymentInfo.emptyMilesTeam) ? paymentInfo.emptyMilesTeam : 0;
                        paymentInfo.loadedMiles = (paymentInfo.loadedMiles) ? paymentInfo.loadedMiles : 0;
                        paymentInfo.emptyMiles = (paymentInfo.emptyMiles) ? paymentInfo.emptyMiles : 0;
                        paymentInfo.rate = (paymentInfo.rate) ? paymentInfo.rate : 0;
                        paymentInfo.deliveryRate = (paymentInfo.deliveryRate) ? paymentInfo.deliveryRate : 0;

                        if (paymentInfo.paymentType === 'Pay Per Mile') {
                            let loadedMilesPayment = 0;
                            let emptyMilesPayment = 0;

                            // if (element.driverIDs.length > 1) {
                            //     // calculate according to team mile rate
                            //     loadedMilesPayment = this.settlementData.miles.driverLoaded * Number(paymentInfo.loadedMilesTeam);
                            //     emptyMilesPayment = this.settlementData.miles.driverEmpty * Number(paymentInfo.emptyMilesTeam);
                            // } else {
                                //  calculated according to simple miles rate
                                // loadedMilesPayment = this.settlementData.miles.driverLoaded * Number(paymentInfo.loadedMiles);
                                // emptyMilesPayment = this.settlementData.miles.driverEmpty * Number(paymentInfo.emptyMiles);
                                loadedMilesPayment = this.settlementData.miles.driverLoaded * Number(paymentInfo.loadedMiles) + this.settlementData.miles.driverLoadedTeam * Number(paymentInfo.loadedMilesTeam);
                                emptyMilesPayment = this.settlementData.miles.driverEmpty * Number(paymentInfo.emptyMiles) + this.settlementData.miles.driverEmptyTeam * Number(paymentInfo.emptyMilesTeam);
                            // }
                            this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
                        } else if (paymentInfo.paymentType === 'Pay Per Hour') {
                            this.settlementData.paymentTotal = this.settlementData.miles.driverHours * Number(paymentInfo.rate);
                        } else if (paymentInfo.paymentType === 'Pay Per Delivery') {
                            this.settlementData.paymentTotal = deliveryCount * Number(paymentInfo.deliveryRate);
                        }

                        // total_hours and team_hours will be from ELD
                        if (element.driverIDs.length > 1) {
                            // this.settlementData.miles.tripsTeam = teamMiles;
                            this.settlementData.miles.teamHours = 0;
                        }
                        this.settlementData.miles.totalHours = 0;

                    } else if (this.settlementData.type === 'carrier') {
                        let paymentInfo = this.contactDetail.paymentDetails;
                        paymentInfo.loadedMiles = (paymentInfo.loadedMiles) ? paymentInfo.loadedMiles : 0;
                        paymentInfo.emptyMiles = (paymentInfo.emptyMiles) ? paymentInfo.emptyMiles : 0;
                        paymentInfo.payrollRate = (paymentInfo.payrollRate) ? paymentInfo.payrollRate : 0;
                        paymentInfo.deliveryRate = (paymentInfo.deliveryRate) ? paymentInfo.deliveryRate : 0;
                        if (paymentInfo.payrollType === 'Pay Per Mile') {
                            let loadedMilesPayment = 0;
                            let emptyMilesPayment = 0;
                            loadedMilesPayment = this.settlementData.miles.tripsLoaded * Number(paymentInfo.loadedMiles);
                            emptyMilesPayment = this.settlementData.miles.tripsEmpty * Number(paymentInfo.emptyMiles);

                            this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
                        } else if (paymentInfo.payrollType === 'Pay Per Hour') {
                            this.settlementData.paymentTotal = this.settlementData.miles.totalHours * Number(paymentInfo.payrollRate);
                        } else if (paymentInfo.payrollType === 'Pay Per Delivery') {
                            this.settlementData.paymentTotal = deliveryCount * Number(paymentInfo.deliveryRate);
                        }
                        // ELD data
                        // this.settlementData.miles.totalHours += Number('2');
                    }
                } else if(this.settlementData.type === 'owner_operator') {
                    let loadedM = 0;
                    let emptyM = 0;
                    for (let index = 0; index < this.settlementData.miles.drivers.length; index++) {
                        const oprElement = this.settlementData.miles.drivers[index];
                        let paymentInfor = oprElement.paymentDetails;
                        let driverDeliveryCount = 0;
                        oprElement.loaded = 0;
                        oprElement.empty = 0;
                        drvrPay = 0;
                        for (let t = 0; t < element.tripPlanning.length; t++) {
                            const plan = element.tripPlanning[t];

                            // driver's miles
                            if(plan.driverID === oprElement.driverID) {
                                this.settlementData.miles.tripsTotal += Number(plan.miles);
                                if (plan.mileType === 'loaded') {
                                    this.settlementData.miles.tripsLoaded += Number(plan.miles);
                                } else if (plan.mileType === 'empty') {
                                    this.settlementData.miles.tripsEmpty += Number(plan.miles);
                                }
                                if (plan.type === 'Delivery') {
                                    driverDeliveryCount += 1;
                                }

                                oprElement.total += Number(plan.miles);
                                if (plan.mileType === 'loaded') {
                                    oprElement.loaded += Number(plan.miles);
                                    loadedM += Number(plan.miles);
                                } else if (plan.mileType === 'empty') {
                                    oprElement.empty += Number(plan.miles);
                                    emptyM += Number(plan.miles);
                                }


                            }
                        }
                        if (paymentInfor.paymentType === 'Pay Per Mile') {
                            paymentInfor.loadedMiles = (paymentInfor.loadedMiles) ? paymentInfor.loadedMiles : 0;
                            paymentInfor.emptyMiles = (paymentInfor.emptyMiles) ? paymentInfor.emptyMiles : 0;
                            paymentInfor.rate = (paymentInfor.rate) ? paymentInfor.rate : 0;
                            paymentInfor.deliveryRate = (paymentInfor.deliveryRate) ? paymentInfor.deliveryRate : 0;
                            let loadedMilesPayment = oprElement.loaded * Number(paymentInfor.loadedMiles);
                            let emptyMilesPayment = oprElement.empty * Number(paymentInfor.emptyMiles);
                            drvrPay = loadedMilesPayment + emptyMilesPayment;
                        } else if (paymentInfor.paymentType === 'Pay Per Hour') {
                            this.settlementData.paymentTotal = oprElement.hours * Number(paymentInfor.rate);
                        } else if (paymentInfor.paymentType === 'Pay Per Delivery') {
                            this.settlementData.paymentTotal = driverDeliveryCount * Number(paymentInfor.deliveryRate);
                        }
                        oprElement.payment += drvrPay;
                    }
                    // let driverPayments = this.settlementData.miles.drivers.map(driver => driver.payment);
                    // this.settlementData.paymentTotal = _.sum(driverPayments);

                    // final payment willl be according to owner operator values
                    if(this.contactDetail) {
                        let paymentInfo = this.contactDetail.paymentDetails;

                        paymentInfo.loadedMiles = (paymentInfo.loadedMiles) ? paymentInfo.loadedMiles : 0;
                        paymentInfo.emptyMiles = (paymentInfo.emptyMiles) ? paymentInfo.emptyMiles : 0;
                        paymentInfo.payrollRate = (paymentInfo.payrollRate) ? paymentInfo.payrollRate : 0;
                        paymentInfo.deliveryRate = (paymentInfo.deliveryRate) ? paymentInfo.deliveryRate : 0;
                        if (paymentInfo.payrollType === 'Pay Per Mile') {
                            let loadedMilesPayment = 0;
                            let emptyMilesPayment = 0;
                            loadedMilesPayment = this.settlementData.miles.tripsLoaded * Number(paymentInfo.loadedMiles);
                            emptyMilesPayment = this.settlementData.miles.tripsEmpty * Number(paymentInfo.emptyMiles);

                            this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
                        } else if (paymentInfo.payrollType === 'Pay Per Hour') {
                            this.settlementData.paymentTotal = this.settlementData.miles.totalHours * Number(paymentInfo.payrollRate);
                        } else if (paymentInfo.payrollType === 'Pay Per Delivery') {
                            this.settlementData.paymentTotal = deliveryCount * Number(paymentInfo.deliveryRate);
                        }
                    }
                }

                // Expenses will also come from ELD
                // let expObj = {
                //     tripID: element.tripID,
                //     expName: `Expense ${i + 1}`,
                //     desc: '-',
                //     amount: '50',
                //     currency: 'CAD'
                // }
                // this.settlementData.expenses.push(expObj);
            }
        }

        this.calculateFinalTotal();
    }

    addRecord() {
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        if(this.settlementData.finalTotal <= 0) {
            this.toaster.error('Total should not be zero.');
            return false;
        }
        if(this.settlementData.type === 'owner_operator') {
            this.settlementData.miles.drivers.map((v) => {
                delete v.paymentDetails;
            })
        }
        this.submitDisabled = true;
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
                this.cancel();
            },
        });
    }

    fetchSettlementDetail() {
        this.accountService.getData(`settlement/detail/${this.settlementID}`)
            .subscribe((result: any) => {
                this.settlementData = result[0];
                if(result[0].taxObj == undefined) {
                    result[0].taxObj = {
                        gstPrcnt: 0,
                        pstPrcnt: 0,
                        hstPrcnt: 0,
                        gstAmount: 0,
                        pstAmount: 0,
                        hstAmount: 0,
                        carrLocalTax: 0,
                        carrFedTax: 0,
                        carrLocalAmount: 0,
                        carrFedAmount: 0,
                    };
                }
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
                if(this.settlementData.type === 'owner_operator') {
                    for (let i = 0; i < this.settlementData.miles.drivers.length; i++) {
                        const element = this.settlementData.miles.drivers[i];
                        this.operatorDriversList.push(element.driverId);
                    }
                }

                if(this.settlementData.type === 'driver' || this.settlementData.type === 'carrier') {
                    this.fetchTrips();
                    if(this.settlementData.type === 'driver') {
                        this.fetchDriverDetail(this.settlementData.entityId);
                    }
                } else if (this.settlementData.type === 'owner_operator') {
                    this.fetchOwnerOperatorDrivers(this.settlementData.entityId);
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
    fetchExpenses(trips: any) {
      this.accountService.getData(`expense/trip-expenses/${trips}`).subscribe((result: any) => {

        // this.expenses = result.filter((e: any) => {
        //   return e.tripID === this.tripID;
        // });
        // for (const element of this.expenses) {
        //   this.totalExp = this.totalExp + element.amount;
        // }
      });
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

        if(this.settlementData.type === 'owner_operator') {
            this.settlementData.miles.drivers.map((v) => {
                delete v.paymentDetails;
            })
        }
        this.settlementData.pendingPayment = this.settlementData.finalTotal;

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
                this.cancel();
            },
        });
    }

    fetchCarrierDetails(carrierID) {
        this.apiService.getData(`contacts/detail/${carrierID}`)
            .subscribe((result: any) => {
                this.contactDetail = result.Items[0];

                this.settlementData.taxObj.carrLocalTax = result.Items[0].paymentDetails.localTax;
                this.settlementData.taxObj.carrFedTax = result.Items[0].paymentDetails.federalTax;
            })
    }

    fetchOwnerOperatorDrivers(operatorID) {
        this.apiService.getData(`drivers/getby/operator/${operatorID}`)
            .subscribe((result: any) => {
                this.searchDisabled = false;
                let operatorDrivers = [];
                for (let i = 0; i < result.Items.length; i++) {
                    const element = result.Items[i];
                    if (!this.settlementID) {
                        const obj = {
                            total: 0,
                            loaded: 0,
                            empty: 0,
                            hours: 0,
                            driverID: element.driverID,
                            paymentDetails: element.paymentDetails,
                            ownerDeduction: false,
                        }
                        operatorDrivers.push(element.driverID);
                        this.settlementData.miles.drivers.push(obj);
                    } else {
                        this.settlementData.miles.drivers.map((v) => {
                            if(v.driverID === element.driverID) {
                                v.paymentDetails = element.paymentDetails;
                                operatorDrivers.push(element.driverID);
                            }
                        })
                    }
                }
                if(operatorDrivers.length > 0) {
                    this.searchDisabled = true;
                    this.operatorDrivers = encodeURIComponent(JSON.stringify(operatorDrivers));
                    this.fetchTrips();
                }
            })
    }

    searchFnc() {
        if(this.settlementData.entityId) {
            this.settlementData.miles = {
                tripsTotal: 0,
                driverTotal: 0,
                tripsLoaded: 0,
                driverLoaded: 0,
                tripsEmpty: 0,
                driverEmpty: 0,
                tripsTeam: 0,
                driverHours: 0,
                teamHours: 0,
                totalHours: 0,
                drivers: [],
                driverLoadedTeam: 0,
                driverEmptyTeam: 0,
            };
            this.operatorDrivers  = '';
            this.searchDisabled = true;
            this.tripMsg = Constants.FETCHING_DATA;
            if(this.settlementData.type == 'driver' || this.settlementData.type == 'carrier') {
                this.fetchTrips();
            } else if(this.settlementData.type == 'owner_operator') {
                this.fetchOwnerOperatorDrivers(this.settlementData.entityId);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    resetFormValues() {
        this.settlementData.entityId = null;
        this.trips = [];
        this.settlementData.deduction = [];
        this.settlementData.expenses = [];
        this.settlementData.addition = [];
        this.settlementData.miles.drivers = [];
        this.tripMsg = Constants.NO_RECORDS_FOUND;
    }

    calculateTaxes() {
        if(this.settlementData.taxObj.gstPrcnt > 0) {
            this.settlementData.taxObj.gstAmount = this.settlementData.taxObj.gstPrcnt*this.settlementData.subTotal/100;
        }
        if(this.settlementData.taxObj.pstPrcnt > 0) {
            this.settlementData.taxObj.pstAmount = this.settlementData.taxObj.pstPrcnt*this.settlementData.subTotal/100;
        }
        if(this.settlementData.taxObj.hstPrcnt > 0) {
            this.settlementData.taxObj.hstAmount = this.settlementData.taxObj.hstPrcnt*this.settlementData.subTotal/100;
        }
        this.settlementData.taxes = Number(this.settlementData.taxObj.gstAmount) + Number(this.settlementData.taxObj.pstAmount) + Number(this.settlementData.taxObj.hstAmount);
        this.settlementData.finalTotal = this.settlementData.subTotal - Number(this.settlementData.taxObj.gstAmount) - Number(this.settlementData.taxObj.pstAmount) - Number(this.settlementData.taxObj.hstAmount);
    }

    deductFromOwnerOperator() {
        this.settlementData.finalTotal = this.finalPayment;
        for (const element of this.settlementData.miles.drivers) {
            if(element.ownerDeduction) {
                this.settlementData.finalTotal -= Number(element.payment);
                this.settlementData.finalTotal = Number(this.settlementData.finalTotal.toFixed(2));
            }
        }
    }
}
