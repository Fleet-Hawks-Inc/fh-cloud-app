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
import { indexOf } from 'lodash';
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
        trpData: [],
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
        fuelAdd: 0,
        fuelDed: 0,
        status: 'unpaid',
        paymentLinked: false,
        pendingPayment: 0,
        paymentInfo:{
            lMiles: 0,
            lMileTeam: 0,
            eMileTeam: 0,
            rate: 0,
            eMiles: 0,
            pRate: 0,
            dRate: 0,
            pType: '',
            // drivers: [],
        },
        fuelIds:[],
        fuelData:[]
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
    categories =  [];
    tripExpenses = [];
    finalTripExpenses = [];
    editDisabled = false;
    driversObj = [];
    drvrPay = 0;
    teamMiles = 0;
    ownDelCouunt = 0;
    ownerLoadedM = 0;
    ownerEmptyM = 0;
    delvCount = 0;
    vehicleIds = [];
    fuelEnteries = [];
    constructor(private listService: ListService, private route: ActivatedRoute,private location: Location, private router: Router, private toaster: ToastrService, private accountService: AccountService, private apiService: ApiService) { }

    ngOnInit() {
        this.settlementID = this.route.snapshot.params['settlementID'];
        if (this.settlementID) {
            this.fetchSettlementDetail();
        }
        this.fetchDrivers();
        this.fetchAllDrivers();
        this.fetchCarriers();
        this.fetchOwnerOperators();
        this.fetchVehicles();
        this.fetchAssets();
        this.fetchOrders();
        this.fetchExpenseCategories();
    }

    fetchDrivers() {
        this.apiService.getData(`drivers/settlements/get/list`)
            .subscribe((result: any) => {
                this.drivers = result;
            })
    }

    fetchAllDrivers() {
        this.apiService.getData(`drivers/get/list`)
            .subscribe((result: any) => {
                this.driversObj = result;
            })
    }

    fetchDriverDetail(driverID) {
        if(driverID != undefined) {
            this.driverId = driverID;
            this.apiService.getData(`drivers/${driverID}`)
                .subscribe((result: any) => {
                    this.driverDetail = result.Items[0];
                    if(this.driverDetail.paymentDetails) {
                        let paymentInfo = this.driverDetail.paymentDetails;
                        this.settlementData.paymentInfo.pType = paymentInfo.paymentType;
                        this.settlementData.paymentInfo.lMileTeam = (paymentInfo.loadedMilesTeam) ? paymentInfo.loadedMilesTeam : 0;
                        this.settlementData.paymentInfo.eMileTeam = (paymentInfo.emptyMilesTeam) ? paymentInfo.emptyMilesTeam : 0;
                        this.settlementData.paymentInfo.lMiles = (paymentInfo.loadedMiles) ? paymentInfo.loadedMiles : 0;
                        this.settlementData.paymentInfo.eMiles = (paymentInfo.emptyMiles) ? paymentInfo.emptyMiles : 0;
                        this.settlementData.paymentInfo.rate = (paymentInfo.rate) ? paymentInfo.rate : 0;
                        this.settlementData.paymentInfo.dRate = (paymentInfo.deliveryRate) ? paymentInfo.deliveryRate : 0;
                    }
                })
        }
        
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
                // this.fetchExpenses(this.trips);
                if(result.Items.length === 0) {
                    this.tripMsg = Constants.NO_RECORDS_FOUND;
                }
                let entStat = `${this.settlementData.entityId}:false`;

                for (let i = 0; i < this.trips.length; i++) {
                    const element = this.trips[i];
                    element.pickupLocation = '';
                    element.dropLocation = '';
                    element.carrID = [];
                    let pickCount = 1;
                    let dropCount = 1;
                    element.selected = false;
                    element.subSelected = false;
                    element.splitArr = [];
                    element.indeterminate = false;

                    for (let j = 0; j < element.tripPlanning.length; j++) {
                        const plan = element.tripPlanning[j];

                        if(this.settlementData.type  === 'driver' || this.settlementData.type === 'carrier') {
                            if(this.settlementData.entityId === plan.driverID || this.settlementData.entityId === plan.coDriverID || this.settlementData.entityId === plan.carrierID) {
                                if (plan.type == 'Pickup') {
                                    element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                                    pickCount++;
                                }
        
                                if (plan.type == 'Delivery') {
                                    element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                                    dropCount++;
                                }
                            }
                        } else if(this.settlementData.type === 'owner_operator') {
                            if(this.operatorDriversList.includes(plan.driverID) || this.operatorDriversList.includes(plan.coDriverID)) {
                                if (plan.type == 'Pickup') {
                                    element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                                    pickCount++;
                                }
        
                                if (plan.type == 'Delivery') {
                                    element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                                    dropCount++;
                                }
                            }
                        }

                        if (plan.carrierID !== '') {
                            if (!element.carrID.includes(plan.carrierID)) {
                                element.carrID.push(plan.carrierID);
                            }
                        }
                    }

                    if(element.split && element.split.length > 0) {
                        element.split.map((main) => {
                            let arrr = {
                                selected: false,
                                trips: []
                            };
                            if(main.plan) {
                                main.plan.map((c) => {
                                    if(this.settlementData.type === 'driver' || this.settlementData.type === 'carrier') {
                                        if(main.stlStatus.includes(entStat)) {
    
                                            if(this.settlementData.type === 'driver') {
                                                element.tripPlanning.map((trp) => {
                                                    if(c === trp.planID) {
                                                        if(this.settlementData.entityId === trp.driverID || this.settlementData.entityId === trp.coDriverID) {
                                                            trp.planLoc =  this.setTripLoc(trp);
                                                            arrr.trips.push(trp);
                                                        }
                                                    }
                                                })
                                            } else if(this.settlementData.type === 'carrier') {
                                                element.tripPlanning.map((trp) => {
                                                    if(c === trp.planID) {
                                                        if(this.settlementData.entityId === trp.carrierID) {
                                                            trp.planLoc =  this.setTripLoc(trp);
                                                            arrr.trips.push(trp);
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    } else if(this.settlementData.type === 'owner_operator') {
                                        let exstPlanIDs = [];
                                        for (let index = 0; index < this.operatorDriversList.length; index++) {
                                            const drvr = this.operatorDriversList[index];
                                            entStat = `${drvr}:false`;
                                            if(main.stlStatus.includes(entStat)) {
                                                element.tripPlanning.map((trp) => {
                                                    if(c === trp.planID) {
                                                        if(!exstPlanIDs.includes(trp.planID)) {
                                                            exstPlanIDs.push(trp.planID);
                                                            if(this.operatorDriversList.includes(trp.driverID) || this.operatorDriversList.includes(trp.coDriverID)) {
                                                                trp.planLoc =  this.setTripLoc(trp);
                                                                arrr.trips.push(trp);
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    
                                })
                            }
                            
                            if(arrr.trips.length > 0) {
                                element.splitArr.push(arrr);
                            }
                            
                        })
                    }
                }
                let stlObj = result.Items.reduce((a: any, b: any) => {
                    return a[b['tripID']] = (b['isDeleted'] == 1) ? b['tripNo'] + '  - Deleted' : b['tripNo'], a;
                }, {});

                this.tripsObject = _.merge(this.tripsObject, stlObj);
            })
    }

    setTripLoc(trp) {
        let planLoc = '';
        if(trp.locMan) {
            planLoc = `${trp.locData.addr}, ${trp.locData.ctName}, ${trp.locData.sName}, ${trp.locData.cName} ${trp.locData.zip}`;
        } else {
            planLoc = trp.location;
        }

        return planLoc;
    }

    fetchExpenseCategories() {
      this.accountService.getData(`expense/categories/list`)
        .subscribe((result: any) => {
          this.categories = result;
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
        if(this.settlementData.type == 'driver' || this.settlementData.type == 'owner_operator') {
            this.settlementData.subTotal = this.settlementData.subTotal + this.settlementData.fuelAdd - this.settlementData.fuelDed;
        }
        if(this.settlementData.type == 'carrier') {

            if(this.settlementData.taxObj.carrLocalTax != 0) {
              this.settlementData.taxObj.carrLocalAmount = this.settlementData.subTotal*this.settlementData.taxObj.carrLocalTax/100;
            }
            if(this.settlementData.taxObj.carrFedTax != 0) {
              this.settlementData.taxObj.carrFedAmount = this.settlementData.subTotal*this.settlementData.taxObj.carrFedTax/100;
            }
            this.settlementData.taxObj.carrLocalAmount = (this.settlementData.taxObj.carrLocalAmount) ? this.settlementData.taxObj.carrLocalAmount : 0;
            this.settlementData.taxObj.carrFedAmount = (this.settlementData.taxObj.carrFedAmount) ? this.settlementData.taxObj.carrFedAmount : 0;
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
        } else {
            this.submitDisabled = false;
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

    resetCal() {
        this.settlementData.tripIds = [];
        this.settlementData.trpData = [];
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
        this.settlementData.miles.drivers.map((v) => {
            v.total = 0;
            v.loaded = 0;
            v.empty = 0;
            v.hours = 0;
            v.payment = 0;
        })
    }

    selectedTrip(tripID, sub = '') {
        this.resetCal();
        if(sub != '') {
            this.subTrpStat(tripID);
        }
        this.paymentCalculation(this.trips);
        console.log('this.settledTrips.length', this.settledTrips.length);
        if(this.settledTrips.length > 0) {
            console.log('here in stl count');
            this.paymentCalculation(this.settledTrips);
        }
    }

    async paymentCalculation(trips) {
        this.drvrPay = 0;
        this.teamMiles = 0;
        this.ownDelCouunt = 0;
        let subTripCount = 0;
        this.delvCount = 0;
        for (let i = 0; i < trips.length; i++) {
            const element = trips[i];
            subTripCount = 0;
            let tripSubs = 0;
            // if(element.vehicleID) {
            //     if (!this.vehicleIds.includes(element.vehicleID)){
            //         this.vehicleIds.push(element.vehicleID);
            //     }
            // }
            if(trips[i].splitArr) {
                tripSubs = trips[i].splitArr.length;
            }
            console.log('element', element);
            if(element.splitArr) {
                element.splitArr.map((v) => {
                    if(v.selected) {
                        subTripCount++;
                    }
                })
            }
            console.log('subTripCount', subTripCount);
            if (element.selected && subTripCount == 0) {
                if (!this.settlementData.tripIds.includes(element.tripID)) {
                    this.settlementData.tripIds.push(element.tripID);
                    let obj = {
                        id: element.tripID,
                        plan: [],
                    }
                    this.settlementData.trpData.push(obj);
                }
                this.selectedTrips.push(element);
                this.wholeTripPlanCalculation(element);

            } else if (subTripCount > 0) {
                if(element.indeterminate || element.selected) {
                    if (!this.settlementData.tripIds.includes(element.tripID)) {
                        this.settlementData.tripIds.push(element.tripID);
                        let obj = {
                            id: element.tripID,
                            plan: [],
                        }
                        this.settlementData.trpData.push(obj);
                    }
                    this.selectedTrips.push(element);
                    this.subTripPlanCalculation(element, element.tripID);
                }
            }

            console.log('this.vehicleIds', this.vehicleIds);
        }

        await this.fetchFuelExpenses();
    }

    wholeTripPlanCalculation(element) {
        if (this.settlementData.type === 'driver' || this.settlementData.type === 'carrier') {
            for (let t = 0; t < element.tripPlanning.length; t++) {
                const plan = element.tripPlanning[t];
                this.driverCarrMilesCal(plan);

                if(plan.vehicleID) {
                    if (!this.vehicleIds.includes(plan.vehicleID)){
                        this.vehicleIds.push(plan.vehicleID);
                    }
                }
            }
            this.driverCarrPaymentCal();
            this.calculateFinalTotal();
        } else if(this.settlementData.type === 'owner_operator') {
            element.tripPlanning.map((plan) => {
                if(this.operatorDriversList.includes(plan.driverID) || this.operatorDriversList.includes(plan.coDriverID)) {
                    if (plan.type === 'Delivery') {
                        this.ownDelCouunt += 1;
                    }
                    if(plan.vehicleID) {
                        if (!this.vehicleIds.includes(plan.vehicleID)){
                            this.vehicleIds.push(plan.vehicleID);
                        }
                    }
                }
            })
            for (let index = 0; index < this.settlementData.miles.drivers.length; index++) {
                const oprElement = this.settlementData.miles.drivers[index];
                let paymentInfor = oprElement.paymentDetails;
                let driverDeliveryCount = 0;
                oprElement.loaded = 0;
                oprElement.empty = 0;
                this.drvrPay = 0;
                // if foll calculation is updated then also update in fnc. subTripPlanCalculation
                for (let t = 0; t < element.tripPlanning.length; t++) {
                    const plan = element.tripPlanning[t];
                    if(plan.driverID === oprElement.driverID || plan.coDriverID === oprElement.driverID) {
                        if(plan.type === 'Delivery') {
                            driverDeliveryCount += 1;
                        }
                        
                        this.settlementData.miles.tripsTotal += Number(plan.miles);
                        if (plan.mileType === 'loaded') {
                            this.settlementData.miles.tripsLoaded += Number(plan.miles);
                        } else if (plan.mileType === 'empty') {
                            this.settlementData.miles.tripsEmpty += Number(plan.miles);
                        }
            
                        oprElement.total += Number(plan.miles);
                        if (plan.mileType === 'loaded') {
                            oprElement.loaded += Number(plan.miles);
                            this.ownerLoadedM += Number(plan.miles);
                        } else if (plan.mileType === 'empty') {
                            oprElement.empty += Number(plan.miles);
                            this.ownerEmptyM += Number(plan.miles);
                        }
                    
                    }
                    
                }
                // this.oprDriverPaymentCalc(paymentInfor, oprElement, driverDeliveryCount);
                paymentInfor.driverID = oprElement.driverID;
                // this.settlementData.paymentInfo.drivers.push(paymentInfor);
                if (paymentInfor.paymentType === 'Pay Per Mile') {
                    paymentInfor.loadedMiles = (paymentInfor.loadedMiles) ? paymentInfor.loadedMiles : 0;
                    paymentInfor.emptyMiles = (paymentInfor.emptyMiles) ? paymentInfor.emptyMiles : 0;
                    paymentInfor.rate = (paymentInfor.rate) ? paymentInfor.rate : 0;
                    paymentInfor.deliveryRate = (paymentInfor.deliveryRate) ? paymentInfor.deliveryRate : 0;
                    let loadedMilesPayment = oprElement.loaded * Number(paymentInfor.loadedMiles);
                    let emptyMilesPayment = oprElement.empty * Number(paymentInfor.emptyMiles);
                    this.drvrPay = loadedMilesPayment + emptyMilesPayment;
                } else if (paymentInfor.paymentType === 'Pay Per Hour') {
                    this.settlementData.paymentTotal = oprElement.hours * Number(paymentInfor.rate);
                } else if (paymentInfor.paymentType === 'Pay Per Delivery') {
                    this.settlementData.paymentTotal = driverDeliveryCount * Number(paymentInfor.deliveryRate);
                }
                oprElement.payment += this.drvrPay;
            }

            // final payment will be according to owner operator values
            if(this.contactDetail) {
                this.oprFinalCal();
            }
        }
    }

    oprFinalCal() {
        if (this.settlementData.paymentInfo.pType === 'Pay Per Mile') {
            let loadedMilesPayment = 0;
            let emptyMilesPayment = 0;
            loadedMilesPayment = this.settlementData.miles.tripsLoaded * Number(this.settlementData.paymentInfo.lMiles);
            emptyMilesPayment = this.settlementData.miles.tripsEmpty * Number(this.settlementData.paymentInfo.eMiles);

            this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
        } else if (this.settlementData.paymentInfo.pType === 'Pay Per Hour') {
            this.settlementData.paymentTotal = this.settlementData.miles.totalHours * Number(this.settlementData.paymentInfo.pRate);
        } else if (this.settlementData.paymentInfo.pType === 'Pay Per Delivery') {
            this.settlementData.paymentTotal = this.ownDelCouunt * Number(this.settlementData.paymentInfo.dRate);
        }
        this.calculateFinalTotal();
    }

    driverCarrMilesCal(plan) {
        console.log('plannn',plan);
        this.settlementData.miles.tripsTotal += Number(plan.miles);

        if (plan.coDriverID) {
            if (plan.driverID === this.driverId || plan.coDriverID === this.driverId) {
                this.teamMiles += Number(plan.miles);
                this.settlementData.miles.tripsTeam = Number(this.teamMiles.toFixed(2));
            }
        }

        if(this.settlementData.type != 'carrier') {
            if (plan.mileType === 'loaded') {
                this.settlementData.miles.tripsLoaded += Number(plan.miles);
            } else if (plan.mileType === 'empty') {
                this.settlementData.miles.tripsEmpty += Number(plan.miles);
            }

            if (plan.type === 'Delivery') {
                this.delvCount += 1;
            }
        } else {
            if(plan.carrierID == this.settlementData.entityId) {
                if (plan.mileType === 'loaded') {
                    this.settlementData.miles.tripsLoaded += Number(plan.miles);
                } else if (plan.mileType === 'empty') {
                    this.settlementData.miles.tripsEmpty += Number(plan.miles);
                }

                if (plan.type === 'Delivery') {
                    this.delvCount += 1;
                }
            }
        }

        // selected driver miles calculation
        if (plan.driverID === this.driverId || plan.coDriverID === this.driverId) {
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

    driverCarrPaymentCal() {
        console.log('this.settlementData.paymentInfo', this.settlementData.paymentInfo);
        if (this.settlementData.type === 'driver') {
            // driver_hours will be from ELD
            this.settlementData.miles.driverHours = 0;
            if (this.settlementData.paymentInfo.pType === 'Pay Per Mile') {
                let loadedMilesPayment = this.settlementData.miles.driverLoaded * Number(this.settlementData.paymentInfo.lMiles) + this.settlementData.miles.driverLoadedTeam * Number(this.settlementData.paymentInfo.lMileTeam);
                let emptyMilesPayment = this.settlementData.miles.driverEmpty * Number(this.settlementData.paymentInfo.eMiles) + this.settlementData.miles.driverEmptyTeam * Number(this.settlementData.paymentInfo.eMileTeam);
                this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;

            } else if (this.settlementData.paymentInfo.pType === 'Pay Per Hour') {
                this.settlementData.paymentTotal = this.settlementData.miles.driverHours * Number(this.settlementData.paymentInfo.rate);

            } else if (this.settlementData.paymentInfo.pType === 'Pay Per Delivery') {
                this.settlementData.paymentTotal = this.delvCount * Number(this.settlementData.paymentInfo.dRate);
            }
            this.settlementData.miles.totalHours = 0;

        } else if (this.settlementData.type === 'carrier') {
            if (this.settlementData.paymentInfo.pType === 'Pay Per Mile') {
                let loadedMilesPayment = 0;
                let emptyMilesPayment = 0;
                loadedMilesPayment = this.settlementData.miles.tripsLoaded * Number(this.settlementData.paymentInfo.lMiles);
                emptyMilesPayment = this.settlementData.miles.tripsEmpty * Number(this.settlementData.paymentInfo.eMiles);

                this.settlementData.paymentTotal = loadedMilesPayment + emptyMilesPayment;
            } else if (this.settlementData.paymentInfo.pType === 'Pay Per Hour') {
                this.settlementData.paymentTotal = this.settlementData.miles.totalHours * Number(this.settlementData.paymentInfo.pRate);
            } else if (this.settlementData.paymentInfo.pType === 'Pay Per Delivery') {
                this.settlementData.paymentTotal = this.delvCount * Number(this.settlementData.paymentInfo.dRate);
            }
        }
    }

    subTripPlanCalculation(tripData, tripID) { 
        let planIds = [];
        for (let index = 0; index < tripData.splitArr.length; index++) {
            const sub = tripData.splitArr[index];
            if(sub.selected) {
                if (this.settlementData.type === 'driver' || this.settlementData.type === 'carrier') {
                    for (let j = 0; j < sub.trips.length; j++) {
                        const plan = sub.trips[j];
                        if(!planIds.includes(plan.planID)) {
                            planIds.push(plan.planID);
                            if(plan.vehicleID) {
                                if (!this.vehicleIds.includes(plan.vehicleID)){
                                    this.vehicleIds.push(plan.vehicleID);
                                }
                            }
                            this.settlementData.trpData.map((k) => {
                                if(k.id === tripID) {
                                    k.plan.push(plan.planID)
                                }
                            })
                        }
                        this.driverCarrMilesCal(plan);
                    }
                    this.driverCarrPaymentCal();
                } else if(this.settlementData.type === 'owner_operator') {
                    sub.trips.map((plan) => {
                        if(this.operatorDriversList.includes(plan.driverID) || this.operatorDriversList.includes(plan.coDriverID)) {
                            if(!planIds.includes(plan.planID)) {
                                planIds.push(plan.planID);
                                this.settlementData.trpData.map((k) => {
                                    if(k.id === tripID) {
                                        k.plan.push(plan.planID)
                                    }
                                })
                                if(plan.vehicleID) {
                                    if (!this.vehicleIds.includes(plan.vehicleID)){
                                        this.vehicleIds.push(plan.vehicleID);
                                    }
                                }
                            }
                            if (plan.type === 'Delivery') {
                                this.ownDelCouunt += 1;
                            }
                        }
                    })

                    // if foll calculation is updated then also update in fnc. wholeTripPlanCalculation
                    for (let index = 0; index < this.settlementData.miles.drivers.length; index++) {
                        const oprElement = this.settlementData.miles.drivers[index];
                        let paymentInfor = oprElement.paymentDetails;
                        let driverDeliveryCount = 0;
                        oprElement.loaded = 0;
                        oprElement.empty = 0;
                        this.drvrPay = 0;
                        if(sub.selected) {
                            for (let j = 0; j < sub.trips.length; j++) {
                                const plan = sub.trips[j];

                                if(plan.driverID === oprElement.driverID || plan.coDriverID === oprElement.driverID) {
                                    if(plan.type === 'Delivery') {
                                        driverDeliveryCount += 1;
                                    }
                                    
                                    this.settlementData.miles.tripsTotal += Number(plan.miles);
                                    if (plan.mileType === 'loaded') {
                                        this.settlementData.miles.tripsLoaded += Number(plan.miles);
                                    } else if (plan.mileType === 'empty') {
                                        this.settlementData.miles.tripsEmpty += Number(plan.miles);
                                    }
                        
                                    oprElement.total += Number(plan.miles);
                                    if (plan.mileType === 'loaded') {
                                        oprElement.loaded += Number(plan.miles);
                                        this.ownerLoadedM += Number(plan.miles);
                                    } else if (plan.mileType === 'empty') {
                                        oprElement.empty += Number(plan.miles);
                                        this.ownerEmptyM += Number(plan.miles);
                                    }
                                
                                }
                                
                            }
                            // this.oprDriverPaymentCalc(paymentInfor, oprElement, driverDeliveryCount);
                            paymentInfor.driverID = oprElement.driverID;
                            // this.settlementData.paymentInfo.drivers.push(paymentInfor);
                            if (paymentInfor.paymentType === 'Pay Per Mile') {
                                paymentInfor.loadedMiles = (paymentInfor.loadedMiles) ? paymentInfor.loadedMiles : 0;
                                paymentInfor.emptyMiles = (paymentInfor.emptyMiles) ? paymentInfor.emptyMiles : 0;
                                paymentInfor.rate = (paymentInfor.rate) ? paymentInfor.rate : 0;
                                paymentInfor.deliveryRate = (paymentInfor.deliveryRate) ? paymentInfor.deliveryRate : 0;
                                let loadedMilesPayment = oprElement.loaded * Number(paymentInfor.loadedMiles);
                                let emptyMilesPayment = oprElement.empty * Number(paymentInfor.emptyMiles);
                                this.drvrPay = loadedMilesPayment + emptyMilesPayment;
                            } else if (paymentInfor.paymentType === 'Pay Per Hour') {
                                this.settlementData.paymentTotal = oprElement.hours * Number(paymentInfor.rate);
                            } else if (paymentInfor.paymentType === 'Pay Per Delivery') {
                                this.settlementData.paymentTotal = driverDeliveryCount * Number(paymentInfor.deliveryRate);
                            }
                            oprElement.payment += this.drvrPay;
                        }
                    }
        
                    // final payment will be according to owner operator values
                    if(this.contactDetail) {
                        this.oprFinalCal();
                    }
                }
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
                if(this.settlementData.type === 'driver') {
                    this.driverId = this.settlementData.entityId;
                }
                this.editDisabled = true;
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
                    // if(this.settlementData.type === 'driver') {
                    //     this.fetchDriverDetail(this.settlementData.entityId);
                    // }
                } else if (this.settlementData.type === 'owner_operator') {
                    this.fetchOwnerOperatorDrivers(this.settlementData.entityId);
                }
            })
    }

    fetchSettledTrips(tripIds) {
        this.apiService.getData(`trips/driver/settled?entities=${tripIds}`)
            .subscribe((result: any) => {

                this.settledTrips = result;
                console.log('this.settledTrips', this.settledTrips);
                for (let i = 0; i < this.settledTrips.length; i++) {
                    const element = this.settledTrips[i];
                    element.pickupLocation = '';
                    element.dropLocation = '';
                    element.carrID = [];
                    let pickCount = 1;
                    let dropCount = 1;
                    element.selected = true;
                    element.splitArr = [];
                    this.selectedTrips.push(element);

                    for (let j = 0; j < element.tripPlanning.length; j++) {
                        const plan = element.tripPlanning[j];

                        if(this.settlementData.type  === 'driver' || this.settlementData.type === 'carrier') {
                            if(this.settlementData.entityId === plan.driverID || this.settlementData.entityId === plan.coDriverID || this.settlementData.entityId === plan.carrierID) {
                                if (plan.type == 'Pickup') {
                                    element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                                    pickCount++;
                                }
        
                                if (plan.type == 'Delivery') {
                                    element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                                    dropCount++;
                                }
                            }
                        } else if(this.settlementData.type === 'owner_operator') {
                            if(this.operatorDriversList.includes(plan.driverID) || this.operatorDriversList.includes(plan.coDriverID)) {
                                if (plan.type == 'Pickup') {
                                    element.pickupLocation += `${pickCount}) ${plan.location} <br>`;
                                    pickCount++;
                                }
        
                                if (plan.type == 'Delivery') {
                                    element.dropLocation += `${dropCount}) ${plan.location} <br>`;
                                    dropCount++;
                                }
                            }
                        }

                        if (plan.carrierID !== '') {
                            if (!element.carrID.includes(plan.carrierID)) {
                                element.carrID.push(plan.carrierID);
                            }
                        }
                    }

                    if(this.settlementData.trpData) {
                        for (let k = 0; k < this.settlementData.trpData.length; k++) {
                            const element2 = this.settlementData.trpData[k];
                            let arrr = {
                                selected: true,
                                trips: []
                            };

                            element.tripPlanning.map((l) => {
                                if(element2.plan.includes(l.planID)) {
                                    l.planLoc =  this.setTripLoc(l);
                                    arrr.trips.push(l);
                                }
                            })

                            if(arrr.trips.length > 0) {
                                element.splitArr.push(arrr);
                            }
                        }
                    }
                }
                // console.log('this.settledTrips', this.settledTrips);

                let stlObj = result.reduce((a: any, b: any) => {
                    return a[b['tripID']] = (b['isDeleted'] == 1) ? b['tripNo'] + '  - Deleted' : b['tripNo'], a;
                }, {});
                this.tripsObject = _.merge(this.tripsObject, stlObj);
            })
    }

    fetchExpenses(tripID, index) {
        if(this.trips[index].selected || this.trips[index].indeterminate) {
            this.accountService.getData(`expense/trip-expenses/${tripID}`).subscribe((result: any) => {
                for (const exp of result) {
                    const expobj = {
                        tripID: exp.tripID,
                        categoryID: exp.categoryID,
                        notes: exp.notes,
                        amount: exp.amount,
                        currency: exp.currency,
                    };
                    this.finalTripExpenses.push(expobj);
                }
            });
        } else {
            this.removeExpenses(tripID);
        }
    }

    filterExpenses(tripID: any) {
        this.finalTripExpenses = this.tripExpenses.filter((e: any) => {
            return e.tripID === tripID;
        });
    }

    removeExpenses(tripID: any) {
        let remTripInd = [];
        this.finalTripExpenses.map((v) => {
            if(v.tripID === tripID) {
                let ind = this.finalTripExpenses.indexOf(v);
                remTripInd.push(ind);
            }
        })

        for (var i = remTripInd.length -1; i >= 0; i--) {
            this.finalTripExpenses.splice(remTripInd[i], 1)
        }
    }

    remStldTrip(tripID, index) {
        console.log('this.settlementData', this.settlementData);
        if (confirm('Are you sure you want to remove the selected trip?') === true) {
            //  Function to remove specific trip
            let delTripIndex = this.settlementData.tripIds.indexOf(tripID);
            this.settlementData.tripIds.splice(delTripIndex, 1);
            this.settledTrips[index].selected = false;
            let trpData = this.settledTrips[index];
            this.trips.push(trpData);
            this.settledTrips.splice(index, 1);

            this.settlementData.trpData.map((k) => {
                if(k.id === tripID) {
                    let indd = this.settlementData.trpData.indexOf(k);
                    this.settlementData.trpData.splice(indd, 1);
                }
            })

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
            this.selectedTrip(tripID);
            this.paymentCalculation(this.settledTrips);
            console.log('this.settlementData', this.settlementData);
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
        if(carrierID != undefined) {
            this.apiService.getData(`contacts/detail/${carrierID}`)
            .subscribe((result: any) => {
                result.Items[0].data.map((v) => {
                    let curKey = Object.keys(v);
                    if(this.settlementData.type === 'carrier') {
                        if(curKey[0] === 'carrierData') {
                            this.contactDetail = v;
                            this.settlementData.taxObj.carrLocalTax = v.carrierData.lTax;
                            this.settlementData.taxObj.carrFedTax = v.carrierData.fTax;

                            let paymentInfo = this.contactDetail.carrierData;
                            this.settlementData.paymentInfo.pType = paymentInfo.pType;
                            this.settlementData.paymentInfo.lMiles = (paymentInfo.lm) ? paymentInfo.lm : 0;
                            this.settlementData.paymentInfo.eMiles = (paymentInfo.em) ? paymentInfo.em : 0;
                            this.settlementData.paymentInfo.pRate = (paymentInfo.pRate) ? paymentInfo.pRate : 0;
                            this.settlementData.paymentInfo.dRate = (paymentInfo.dr) ? paymentInfo.dr : 0;
                        }
                    } else if(this.settlementData.type === 'owner_operator') {
                        if(curKey[0] === 'opData') {
                            this.contactDetail = v;

                            let paymentInfo = this.contactDetail.opData;
                            this.settlementData.paymentInfo.pType = paymentInfo.pType;
                            this.settlementData.paymentInfo.lMiles = (paymentInfo.lm) ? paymentInfo.lm : 0;
                            this.settlementData.paymentInfo.eMiles = (paymentInfo.em) ? paymentInfo.em : 0;
                            this.settlementData.paymentInfo.pRate = (paymentInfo.pRate) ? paymentInfo.pRate : 0;
                            this.settlementData.paymentInfo.dRate = (paymentInfo.dr) ? paymentInfo.dr : 0;
                        }
                    }
                })
            })
        }
    }

    fetchOwnerOperatorDrivers(operatorID) {
        this.apiService.getData(`drivers/getby/operator/${operatorID}`)
            .subscribe((result: any) => {
                this.searchDisabled = false;
                let operatorDrivers = [];
                if(result.Items.length === 0) {
                    this.tripMsg = Constants.NO_RECORDS_FOUND;
                }
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
                    this.operatorDriversList = operatorDrivers;
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
            this.tripExpenses = [];
            this.fuelEnteries = [];
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
        this.resetAlldata();
    }

    resetAlldata() {
        this.trips = [];
        this.settlementData.deduction = [];
        this.settlementData.addition = [];
        this.settlementData.miles.drivers = [];
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
        this.settlementData.additionTotal = 0;
        this.settlementData.deductionTotal = 0;
        this.settlementData.taxObj = {
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
        };
        this.settlementData.paymentInfo = {
            lMiles: 0,
            lMileTeam: 0,
            eMileTeam: 0,
            rate: 0,
            eMiles: 0,
            pRate: 0,
            dRate: 0,
            pType: '',
            // drivers: [],
        };
        this.settlementData.paymentTotal = 0;
        this.settlementData.taxes = 0;
        this.settlementData.subTotal = 0;
        this.settlementData.finalTotal = 0;
        this.finalTripExpenses = [];
        this.tripExpenses = [];
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
        if(this.settlementData.finalTotal > 0) {
            this.submitDisabled = false;
        } else {
            this.submitDisabled = true;
        }
    }

    deductFromOwnerOperator() {
        this.settlementData.finalTotal = this.finalPayment;
        for (const element of this.settlementData.miles.drivers) {
            if(element.ownerDeduction) {
                this.settlementData.finalTotal -= Number(element.payment);
                this.settlementData.finalTotal = Number(this.settlementData.finalTotal.toFixed(2));
            }
        }

        if(this.settlementData.finalTotal > 0) {
            this.submitDisabled = false;
        } else {
            this.submitDisabled = true;
        }
    }
    
    selSubTrip(tripInd, subTripInd) {
        let selCount = 0;
        let subtripCount = 0;
        this.trips[tripInd].splitArr.map((v) => {
            subtripCount += 1; 
            if(v.selected) {
                selCount++;
            }
        })
        if(selCount > 0) {
            this.trips[tripInd].subSelected = true;
            if(selCount === subtripCount) {
                // this.trips[tripInd].indeterminate = false;
                this.trips[tripInd].selected = true;
            } else {
                this.trips[tripInd].indeterminate = true;
                this.trips[tripInd].selected = false;
            }
        } else {
            this.trips[tripInd].subSelected = false;
            this.trips[tripInd].indeterminate = false;
        }
        this.resetCal();
        this.paymentCalculation(this.trips);
        if(this.settledTrips.length > 0) {
            this.paymentCalculation(this.settledTrips);
        }
    }

    subTrpStat(tripIndex) {
        let data = this.trips[tripIndex];
        this.trips[tripIndex].indeterminate = false;
        if(data.selected) {
            this.trips[tripIndex].splitArr.map((v) => {
                v.selected = true;
            })
        } else {
            this.trips[tripIndex].splitArr.map((v) => {
                v.selected = false;
            })
        }
    }

    async fetchFuelExpenses() {
        let veh = encodeURIComponent(JSON.stringify(this.vehicleIds));
        let result = await this.apiService.getData(`fuelEntries/get/vehicle/enteries?vehicle=${veh}&start=${this.settlementData.fromDate}&end=${this.settlementData.toDate}`).toPromise();
        this.fuelEnteries = result;
        this.fuelEnteries.map((elem) => {
            elem.add = false;
            elem.subtract = false;
            elem.addDisabled = false;
            elem.subDisabled = false;
        });
    }

    selectedFuelEntry() {
        this.settlementData.fuelAdd = 0;
        this.settlementData.fuelDed = 0;
        this.settlementData.fuelIds = [];
        this.settlementData.fuelData = [];
        for(let i=0; i<this.fuelEnteries.length; i++) {
            const element = this.fuelEnteries[i];
            if(element.add) {
                this.settlementData.fuelAdd += Number(element.subTotal);
                element.subDisabled = true;
                if(!this.settlementData.fuelIds.includes(element.fuelID)) {
                    this.settlementData.fuelIds.push(element.fuelID);
                    let obj = {
                        fuelID: element.fuelID,
                        amount: Number(element.subTotal),
                        action: 'add',
                    };
                    this.settlementData.fuelData.push(obj);
                }
            } else {
                element.subDisabled = false;
            }

            if(element.subtract) {
                this.settlementData.fuelDed += Number(element.subTotal);
                element.addDisabled = true;
                if(!this.settlementData.fuelIds.includes(element.fuelID)) {
                    this.settlementData.fuelIds.push(element.fuelID);
                    let obj = {
                        fuelID: element.fuelID,
                        amount: Number(element.subTotal),
                        action: 'sub',
                    };
                    this.settlementData.fuelData.push(obj);
                }
            } else {
                element.addDisabled = false;
            }
        }
        this.calculateFinalTotal();
        console.log('this.settlementData', this.settlementData);
    }
}
