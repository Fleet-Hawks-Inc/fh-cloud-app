import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import {Auth} from 'aws-amplify';
import * as moment from "moment";
import { Location } from '@angular/common';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import { v4 as uuidv4 } from 'uuid';
import { split } from 'lodash';


declare var $: any;

@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
    styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

    newCoords = [];
    public searchResults: any;
    public searchResults1: any;
    actualMiles=0;
    public selectedVehicleSpecs=[];
    public optionalSpec={
        height:400
    };
    public saveCords:any;
    private readonly search: any;
    public searchTerm = new Subject<string>();
    carriers = [];
    routes = [];
    constructor(private apiService: ApiService, private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,
        private location: Location, private hereMap: HereMapService) { }
    public orderMiles={
        calculateBy:'manual',
        totalMiles:0
    }
    permanentRoutes = []
    errors = {};
    trips = [];
    vehicles = [];
    assets = [];
    drivers = [];
    codrivers = [];
    tripData = {
        tripNo: '',
        orderNo: '',
        routeID: null,
        bol: '',
        reeferTemperature: '',
        reeferTemperatureUnit: null,
        orderId: [],
        orderType: 'FTL',
        tripPlanning: [],
        notifications: {
            changeRoute: false,
            pickUp: false,
            dropOff: false,
            tripToDriver: false,
            tripToDispatcher: false,
        },
        tripStatus: 'confirmed',
        dateCreated: <any>'',
        driverIDs: [],
        vehicleIDs: [],
        assetIDs: [],
        stlStatus: [],
        carrierIDs: [],
        loc: '',
        mapFrom: 'order',
        iftaMiles: [],
        split:[],
    };
    ltlOrders = [];
    ftlOrders = [];

    selectedAssets = [];
    form;
    OrderIDs = [];
    temporaryOrderIDs = [];
    temporaryOrderNumber = [];
    typeOptions = ['Start','Pickup', 'Delivery', 'Stop', 'Enroute', 'Relay', 'Switch', 'Yard'];
    ftlOptions: any = {};
    ltlOptions: any = {};
    assetModalData: any = {};
    textFieldValues = {
        type: null,
        date: null,
        pickupTime: null,
        dropTime: null,
        actualPickupTime: null,
        actualDropTime: null,
        name: '',
        locData: {},
        mileType: null,
        miles: 0,
        vehicleName: '',
        vehicleID: '',
        driverName: '',
        driverUsername: '',
        coDriverName: '',
        coDriverUsername: '',
        carrierName: '',
        carrierID: null,
        trailer: {},
        trailerName: '',
        driverID: '',
        coDriverID: '',
        locationName: '',
        locMan: false,
        lat: '',
        lng: ''
    };
    tempTextFieldValues: any = {
        trailer: [],
        coDriverUsername: '',
        driverUsername: '',
        vehicleID: '',
        driverID: '',
        coDriverID: ''
    };
    countries = [];
    states = [];
    cities = [];
    tempLocation = {
        countryID: '',
        countryName: '',
        stateID: '',
        stateName: '',
        cityID: '',
        cityName: '',
        address1: '',
        address2: '',
        zipcode: '',
        locationName: '',
        type: '',
        index: ''
    };

    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error: string = '';
    Success: string = '';
    mapView: boolean = false;

    // edit loc variables
    selectedLocationCountryId = '';
    selectedLocationStateId = '';
    selectedLocationCityId = '';
    selectedLocationAddress1 = '';
    selectedLocationAddress2 = '';
    selectedLocationAddress3 = '';

    assetDataVehicleID = null;
    assetDataDriverUsername = null;
    assetDataCoDriverUsername = null;
    informationAsset = [];
    allFetchedOrders = [];
    shippersObjects = [];
    receiversObjects = [];
    ordersPlan = [];
    customersObjects = [];
    orderNo = '';
    tripID = '';
    pageTitle = '';
    driversObjects = [];
    assetsObjects = [];
    vehiclesObjects = [];
    carriersObject = [];
    currentUser:any = '';
    OldOrderIDs = [];
    dateCreated = moment().format('YYYY-MM-DD');
    mapOrderActive = 'active';
    mapRouteActive = '';
    mapOrderActiveDisabled = false;
    mapRouteActiveDisabled = false;
    submitDisabled = false;
    orderStops = [];
    isEdit = false;
    tripNoDisabled = false;
    dateMinLimit = { year: 1950, month: 1, day: 1 };
    date = new Date();
    futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
    splitArr = [];
    locObj = {
        addr: '',
        cCode: null,
        sCode: null,
        cName: '',
        sName: '',
        ctName: null,
        zipCode: '',
        type: '',
        index: '',
    }
    locDisabled = false;
    dummySplitArr = [];
    disableSplit = false;

    async ngOnInit() {

        this.tripID = this.route.snapshot.params['tripID'];
        if (this.tripID != undefined) {
            this.pageTitle = 'Edit Trip';
        } else {
            this.pageTitle = 'Add Trip';
        }
        this.fetchOrders();
        this.fetchCustomerByIDs();
        this.fetchCarriers();
        this.fetchRoutes();
        this.mapShow();
        this.fetchVehicles();
        this.fetchAssets();
        this.fetchDrivers();
        this.searchLocation();
        this.getCurrentuser();
        this.fetchCountries();

        if (this.tripID != undefined) {
           await this.fetchTripDetail();
        }

        $(document).ready(() => {
            // this.form = $('#form_').validate();
        });
    }

    fetchCarriers() {
        this.apiService.getData('contacts/get/type/carrier')
            .subscribe((result: any) => {
                this.carriers = result;


                this.carriersObject = result.reduce((a: any, b: any) => {
                    return a[b['contactID']] = (b['isDeleted'] == 1) ? b['companyName'] + '  - Deleted' : b['companyName'], a;
                }, {});
            })
    }

    drop(event: CdkDragDrop<string[]>) {
        this.ArrayShuffle(this.trips, event.previousIndex, event.currentIndex);
        moveItemInArray(this.trips, event.previousIndex, event.currentIndex);
    }

    async ArrayShuffle(array, previousIndex, currentIndex) {
       var prevValOnIndex = array[previousIndex];
        var newArr = [];
        let locations = [];
        var j = 0;
        for (const i of array) {
            if ((currentIndex) === j) {
                await newArr.push(prevValOnIndex)
                j = j + 1;
            } else {
                await newArr.push(array[j]);
                j = j + 1;
            }
        }
        newArr.map(function(v){
            if(v.locationName != undefined && v.locationName != '') {
                v.miles = 0;
                locations.push(v.locationName)
            }
        })

        if(locations.length > 0) {
            this.resetMap();
        }

        this.actualMiles = 0;
        this.getMiles();
    }
    cancel() {
      this.location.back(); // <-- go back to previous location on cancel
    }
    async addRow() {
        if (this.textFieldValues.type !== '' && this.textFieldValues.locationName !== '') {

            if(this.trips.length > 0) {
                let endingPoint = this.textFieldValues['lng'] + "," + this.textFieldValues['lat'];
                this.getSingleRowMiles(endingPoint, this.trips.length);
            }

            this.textFieldValues[`planID`] = uuidv4();
            this.textFieldValues[`splitDone`] = false;
            this.trips.push(this.textFieldValues);
            this.disableSplit = false;
            this.textFieldValues = {
                type: null,
                date: null,
                pickupTime: null,
                dropTime: null,
                actualPickupTime: null,
                actualDropTime: null,
                name: '',
                locData: {},
                locationName: '',
                lat: '',
                lng: '',
                mileType: null,
                miles: 0,
                vehicleName: '',
                vehicleID: '',
                driverName: '',
                driverUsername: '',
                coDriverName: '',
                coDriverUsername: '',
                carrierName: '',
                carrierID: null,
                trailer: {},
                trailerName: '',
                driverID: '',
                coDriverID: '',
                locMan: false,
            };
            this.emptyAssetModalFields();
            this.selectedAssets = [];

            let locations = [];
            for (let k = 0; k < this.trips.length; k++) {
                const element = this.trips[k];
                if(element.locationName != '' && element.locationName != undefined){
                    locations.push(element.locationName);
                }
            }
            if(locations.length > 1) {
                this.resetMap()
            }

        } else {
            this.toastr.error('Please fill type and location to add trip plan.');
            return false;
        }
    }

    delRow(index) {
        this.trips.splice(index, 1);

        let locations = [];
        for(const tripp of this.trips) {
            if(tripp.locationName != undefined && tripp.locationName != '') {
                locations.push(tripp.locationName)
            }
        }

        if(locations.length > 0) {
            this.actualMiles = 0;
            this.getMiles();
        }
    }

    emptyAssetModalFields() {
        // empty the values of asset modal and temp_text_fields after adding
        this.tempTextFieldValues.vehicleName = '';
        this.tempTextFieldValues.vehicleID = null;
        this.tempTextFieldValues.trailer = [];
        this.tempTextFieldValues.driverName = '';
        this.tempTextFieldValues.driverUsername = '';
        this.tempTextFieldValues.coDriverName = '';
        this.tempTextFieldValues.coDriverUsername = '';
        this.tempTextFieldValues.trailerName = '';

        this.emptyAsigneeModal();
    }

    showEditRow(index) {
        let editRowValues = this.trips[index];
        if(this.trips[index].driverID == undefined) {
            this.trips[index].driverID = '';
        }
        if(this.trips[index].coDriverID == undefined) {
            this.trips[index].coDriverID = '';
        }
        if(this.trips[index].vehicleID == undefined) {
            this.trips[index].vehicleID = '';
        }
        if(this.trips[index].assetID == undefined) {
            this.trips[index].assetID = [];
        }
        if(this.trips[index].driverID === '' && this.trips[index].coDriverID === '' && this.trips[index].vehicleID === '' && this.trips[index].assetID.length === 0) {
            this.trips[index].disablecarr = false;
        } else {
            this.trips[index].disablecarr = true;
        }
        $("#editCell1" + index).val(editRowValues.type);
        $("#editCell5" + index).val(editRowValues.mileType);
        $("#editCell11" + index).val(editRowValues.carrierID);
        $("#editCell4" + index).val(editRowValues.locationName);
        $(".labelRow" + index).css('display', 'none');
        $('.editRow' + index).removeClass('rowStatus');
    }

    editRow(index) {
        if ($('#editCell3' + index).val() != '' && $('#editCell3' + index).val() != null && $('#editCell3' + index).val() != undefined) {
            this.trips[index].name = $('#editCell3' + index).val();
        }
        this.trips[index].miles = $('#editCell6' + index).val();
        this.trips[index].time = $('#editCell12' + index).val();
        this.trips[index].pickupTime = $('#editCell13' + index).val();
        this.trips[index].dropTime = $('#editCell14' + index).val();
        this.trips[index].actualPickupTime = $('#editCell15' + index).val();
        this.trips[index].actualDropTime = $('#editCell16' + index).val();
        $(".labelRow" + index).css('display', '');
        $('.editRow' + index).addClass('rowStatus');
        this.getVehicles();
    }

    closeEditRow(index) {
        $(".labelRow" + index).css('display', '');
        $(".editRow" + index).addClass('rowStatus');
    }

    fetchRoutes() {
        this.spinner.show();
        this.apiService.getData('routes').subscribe({
            complete: () => { },
            error: () => { },
            next: (result: any) => {
                this.spinner.hide();
                this.permanentRoutes = result['Items'];
            }
        })
    }

    mapShow() {
        this.hereMap.mapSetAPI();
        this.hereMap.mapInit();
    }

    showMOdal() {
        $("#orderModal").modal('show');
    }

    emptyAsigneeModal() {
        this.assetDataVehicleID = null;
        this.informationAsset = [];
        this.assetDataDriverUsername = null;
        this.assetDataCoDriverUsername = null;
        $(".vehicleClass").removeClass('td_border');
        $(".assetClass").removeClass('td_border');
        $(".driverClass").removeClass('td_border');
        $(".codriverClass").removeClass('td_border');
    }

    showAssetModal(type, index) {
        this.emptyAsigneeModal();

        if (type === 'add') {
            if ($('#cell11').val() == '') {
                this.tempTextFieldValues.type = 'add';
                this.tempTextFieldValues.index = '';
                $('#assetModal').modal('show');
            } else {
                return false;
            }

        } else {
            if ($('#editCell11'+index).val() !== '') {
                return false;
            } else {
                this.tempTextFieldValues.type = 'edit';
                this.tempTextFieldValues.index = index;
                let editRowValues = this.trips[index];
                this.assetDataVehicleID = editRowValues.vehicleID;
                this.informationAsset = [];
                this.assetDataDriverUsername = editRowValues.driverUsername;
                this.assetDataCoDriverUsername = editRowValues.coDriverUsername;

                // set temp fields value
                this.tempTextFieldValues.vehicleName = editRowValues.vehicleName;
                this.tempTextFieldValues.vehicleID = editRowValues.vehicleID;
                this.tempTextFieldValues.driverID = editRowValues.driverID;
                this.tempTextFieldValues.coDriverID = editRowValues.coDriverID;
                this.tempTextFieldValues.driverName = editRowValues.driverName;
                this.tempTextFieldValues.driverUsername = editRowValues.driverUsername;
                this.tempTextFieldValues.coDriverName = editRowValues.coDriverName;
                this.tempTextFieldValues.coDriverUsername = editRowValues.coDriverUsername;
                this.tempTextFieldValues.trailerName = editRowValues.trailerName;

                $("#veh_" + editRowValues.vehicleID).addClass('td_border');
                $("#drivr_" + editRowValues.driverID).addClass('td_border');
                $("#codrivr_" + editRowValues.coDriverID).addClass('td_border');

                // set selected asset values
                if (editRowValues.trailer != undefined) {
                    for (let i = 0; i < editRowValues.trailer.length; i++) {
                        const element = editRowValues.trailer[i];
                        this.informationAsset.push(element.id);

                        let objj = {
                            id: element.id,
                            name: element.name
                        }
                        this.tempTextFieldValues.trailer.push(objj);
                        $("#asset_" + element.id).addClass('td_border');
                    }
                }

                $('#assetModal').modal('show');
            }
        }
    }

    selectOrderIDS(type) {
        this.temporaryOrderIDs = [];
        this.temporaryOrderNumber = [];
        let current = this;
        if (type === 'ftl') {
            $('input[name="ltlOrderIds"]').prop('checked', false);
            $('input[name="checkUncheckltl"]').prop('checked', false);
            $('input[name="ftlOrderIds"]:checked').each(function () {
                $('input[name="checkUncheckftl"]').prop('checked', true);
                current.temporaryOrderIDs.push(this.id);
                current.temporaryOrderNumber.push(this.value);
            });
        } else if (type === 'ltl') {
            $('input[name="ftlOrderIds"]').prop('checked', false);
            $('input[name="checkUncheckftl"]').prop('checked', false);
            $('input[name="ltlOrderIds"]:checked').each(function () {
                $('input[name="checkUncheckltl"]').prop('checked', true);
                current.temporaryOrderIDs.push(this.id);
                current.temporaryOrderNumber.push(this.value);
            });
        }
    }

    async saveSelectOrderIDS() {
        this.OrderIDs = this.temporaryOrderIDs;
        $("#orderModal").modal('hide');
        this.orderNo = this.temporaryOrderNumber.toString();
        let tripPlans = [];

        let current = this;
        let totalMilesOrder = 0;
        let calculateBy = '';
        this.orderStops = [];

        for (let i = 0; i < this.OrderIDs.length; i++) {
            const element = this.OrderIDs[i];

            let locations = [];
            this.allFetchedOrders.map(function (v) {

                if (element == v.orderID) {
                    current.tripData.orderType = v.orderMode;
                    calculateBy = v.milesInfo.calculateBy;
                    totalMilesOrder += parseFloat(v.milesInfo.totalMiles);

                    if (v.shippersReceiversInfo) {
                        v.shippersReceiversInfo.map((m) => {
                            let PDate = moment().format('YYYY-MM-DD');
                            let PTime = '';

                            m.shippers.map(async (n) => {
                                n.pickupPoint.map((pk) => {
                                    if (pk.dateAndTime != undefined && pk.dateAndTime != '') {
                                        let dmy = pk.dateAndTime.split(' ');
                                        PDate = dmy[0];
                                        PTime = dmy[1];
                                    }
                                    let pickLocation = '';
                                    if(pk.address.manual) {
                                        pickLocation = `${pk.address.address}, ${pk.address.city}, ${pk.address.state}. ${pk.address.country}`;
                                    } else {
                                        pickLocation = pk.address.pickupLocation;
                                    }
                                    let pickupMiles = 0;
                                    let obj = {
                                        splitDone: false,
                                        split: false,
                                        planID: uuidv4(),
                                        type: 'Pickup',
                                        date: PDate,
                                        name: current.shippersObjects[n.shipperID],
                                        dateTime: pk.dateAndTime,
                                        miles: pickupMiles,
                                        carrierID: null,
                                        carrierName: '',
                                        // time: PTime,
                                        pickupTime: PTime,
                                        dropTime: '',
                                        actualPickupTime: '',
                                        actualDropTime: '',
                                        locationName: pickLocation,
                                        vehicleName: '',
                                        trailerName: '',
                                        driverName: '',
                                        coDriverName: '',
                                        fromOrder: 'yes',
                                        lat:pk.address.geoCords.lat,
                                        lng:pk.address.geoCords.lng,
                                        locData: {},
                                        locMan: false,
                                    }
                                    if(n.pickupLocation != '' && n.pickupLocation != undefined){
                                        locations.push(n.pickupLocation)
                                    }
                                    tripPlans.push(obj);
                                    tripPlans.sort((a, b) => {
                                        return (
                                          new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf()
                                        );
                                    });
                                })

                            })
                        })

                        v.shippersReceiversInfo.map( (j) => {
                             j.receivers.map(async (k) => {
                                k.dropPoint.map((dr) => {
                                    let dropLocation = '';
                                    if(dr.address.manual) {
                                        dropLocation = `${dr.address.address}, ${dr.address.city}, ${dr.address.state}, ${dr.address.country}`;
                                    } else {
                                        dropLocation = dr.address.dropOffLocation;
                                    }

                                    let DrDate = moment().format('YYYY-MM-DD');
                                    let DrTime = '';
                                    if (dr.dateAndTime != undefined && dr.dateAndTime != '') {
                                        let dmy = dr.dateAndTime.split(' ');
                                        DrDate = dmy[0];
                                        DrTime = dmy[1];
                                    }

                                    let deliveryMiles = 0;
                                    let obj = {
                                        splitDone: false,
                                        split: false,
                                        planID: uuidv4(),
                                        type: 'Delivery',
                                        date: DrDate,
                                        dateTime: dr.dateAndTime,
                                        name: current.receiversObjects[k.receiverID],
                                        miles: deliveryMiles,
                                        carrierID: null,
                                        carrierName: '',
                                        // time: DrTime,
                                        pickupTime: '',
                                        dropTime: DrTime,
                                        actualPickupTime: '',
                                        actualDropTime: '',
                                        locationName: dropLocation,
                                        vehicleName: '',
                                        trailerName: '',
                                        driverName: '',
                                        coDriverName: '',
                                        fromOrder: 'yes',
                                        lat:dr.address.geoCords.lat,
                                        lng:dr.address.geoCords.lng,
                                        locData: {},
                                        locMan: false,
                                    }
                                    if(k.dropOffLocation != '' && k.dropOffLocation != undefined){
                                        locations.push(k.dropOffLocation)
                                    }
                                    tripPlans.push(obj);
                                    tripPlans.sort((a, b) => {
                                        return (
                                        new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf()
                                        );
                                    });
                                })

                            })
                        })
                    }
                    return i;
                }
            })

            if(locations.length > 0) {
                this.resetMap();
            }
        }
        if(this.tripData.mapFrom == 'order') {
            this.trips = tripPlans;
            this.orderMiles =
            {
                calculateBy: calculateBy,
                totalMiles: totalMilesOrder
            }
            this.actualMiles = 0;
            this.getMiles();
        }
        this.orderStops = tripPlans;

    }

    async getMiles(){
        let savedCord='';

        for (let i = 0; i < this.trips.length; i++) {
            const element = this.trips[i];

            if(i > 0) {
                if (element.lng != undefined && element.lat != undefined) {
                    let endingPoint = element.lng + "," + element.lat;
                    try {
                        let newsMiles = savedCord + ";" + endingPoint;
                        this.apiService.getData('trips/calculate/pc/miles?type=mileReport&stops='+newsMiles).subscribe((result) => {
                            element.miles = result;
                            this.calculateActualMiles(result);
                        });
                    }
                    catch (error) {
                        this.toastr.error('No route found with these locations.');
                        return false;
                    }
                    savedCord=endingPoint;
                }
            } else {
                element.miles = 0;
                savedCord=element.lng + "," + element.lat;
            }
        }
        this.getStateWiseMiles();
    }

    async getSingleRowMiles(endingPoint, tripLength){

        let savedCord='';
        savedCord = this.trips[tripLength-1].lng + "," + this.trips[tripLength-1].lat;
        try {
            let newsMiles = savedCord + ";" + endingPoint;
            this.apiService.getData('trips/calculate/pc/miles?type=mileReport&stops='+newsMiles).subscribe((result) => {

                this.trips[tripLength].miles = result;
                this.calculateActualMiles(result);
                this.getStateWiseMiles();
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }

    calculateActualMiles(miles){
        this.actualMiles+= parseFloat(miles);
    }

    checkUncheckAll(type) {
        this.temporaryOrderIDs = [];
        let current = this;
        if (type === 'ftl') {
            $('input[name="ltlOrderIds"]').prop('checked', false);
            if ($('input[name="ftlOrderIds"]:checked').length > 0) {
                // uncheck all
                this.temporaryOrderIDs = [];
                $('input[name="ftlOrderIds"]').prop('checked', false);
            } else {
                // check all
                $('input[name="ftlOrderIds"]').each(function () {
                    $(this).prop('checked', true);
                    // current.temporaryOrderIDs.push(this.value);
                    current.temporaryOrderIDs.push(this.id);
                    current.temporaryOrderNumber.push(this.value);
                });
            }

        } else if (type === 'ltl') {
            $('input[name="ftlOrderIds"]').prop('checked', false);
            if ($('input[name="ltlOrderIds"]:checked').length > 0) {
                // uncheck all
                this.temporaryOrderIDs = [];
                $('input[name="ltlOrderIds"]').prop('checked', false);
            } else {
                // check all
                $('input[name="ltlOrderIds"]').each(function () {
                    $(this).prop('checked', true);
                    current.temporaryOrderIDs.push(this.id);
                    current.temporaryOrderNumber.push(this.value);
                });
            }
        }
    }

    fetchVehicles() {

        this.apiService.getData('vehicles')
            .subscribe((result: any) => {
                this.vehicles = result.Items;

                this.vehiclesObjects = result.Items.reduce((a: any, b: any) => {
                    return a[b['vehicleID']] = (b['isDeleted'] == 1) ? b['vehicleIdentification'] + '  - Deleted' : b['vehicleIdentification'], a;
                }, {});
            })
    }

    fetchAssets() {
        this.apiService.getData('assets')
            .subscribe((result: any) => {
                this.assets = result.Items;

                this.assetsObjects = result.Items.reduce((a: any, b: any) => {
                    return a[b['assetID']] = (b['isDeleted'] == 1) ? b['assetIdentification'] + '  - Deleted' : b['assetIdentification'], a;
                }, {});
            })
    }

    fetchDrivers() {
        this.apiService.getData('drivers')
            .subscribe((result: any) => {
                result.Items.map((i) => { i.fullName = i.firstName; return i; });
                this.drivers = result.Items;
                this.codrivers = result.Items;

                this.driversObjects = result.Items.reduce((a: any, b: any) => {
                    return a[b['driverID']] = b['firstName'], a;
                }, {});
            })
    }

    fetchCoDriver(driverID) {
        this.codrivers = this.drivers.filter(function (obj) {
            if (obj.driverID !== driverID) {
                return obj;
            }
        });
    }

    saveAssetModalData(addType='') {
        if(this.tempTextFieldValues.coDriverUsername == undefined) {
            this.tempTextFieldValues.coDriverUsername = '';
        }
        if(this.tempTextFieldValues.vehicleID == undefined) {
            this.tempTextFieldValues.vehicleID = '';
        }
        if(this.tempTextFieldValues.driverUsername == undefined) {
            this.tempTextFieldValues.driverUsername = '';
        }
        if(this.tempTextFieldValues.trailerName == undefined) {
            this.tempTextFieldValues.trailerName = '';
        }

        if (this.tempTextFieldValues.type === 'add') {
            this.textFieldValues.vehicleName = this.tempTextFieldValues.vehicleName;
            this.textFieldValues.vehicleID = this.tempTextFieldValues.vehicleID;
            this.textFieldValues.trailer = this.tempTextFieldValues.trailer;
            this.textFieldValues.driverID = this.tempTextFieldValues.driverID;
            this.textFieldValues.coDriverID = this.tempTextFieldValues.coDriverID;

            this.textFieldValues.driverName = this.tempTextFieldValues.driverName;
            this.textFieldValues.driverUsername = this.tempTextFieldValues.driverUsername;
            this.textFieldValues.coDriverName = this.tempTextFieldValues.coDriverName;
            this.textFieldValues.coDriverUsername = this.tempTextFieldValues.coDriverUsername;
            this.textFieldValues.trailerName = this.tempTextFieldValues.trailerName;
            this.textFieldValues.driverID = this.tempTextFieldValues.driverID;
            this.textFieldValues.coDriverID = this.tempTextFieldValues.coDriverID;

            this.tripData.tripStatus = 'confirmed';
            if(this.textFieldValues.vehicleID != '' || this.textFieldValues.driverUsername != '' || this.textFieldValues.coDriverUsername != '' || this.textFieldValues.trailerName != '') {
                $("#cell11").prop('disabled', true);
            } else {
                $("#cell11").prop('disabled', false);
            }

            $('#assetModal').modal('hide');
        } else if (this.tempTextFieldValues.type === 'edit') {
            let index = this.tempTextFieldValues.index;

            this.trips[index].vehicleName = this.tempTextFieldValues.vehicleName;
            this.trips[index].vehicleID = this.tempTextFieldValues.vehicleID;
            this.trips[index].trailer = this.tempTextFieldValues.trailer;
            this.trips[index].driverName = this.tempTextFieldValues.driverName;
            this.trips[index].driverUsername = this.tempTextFieldValues.driverUsername;
            this.trips[index].coDriverName = this.tempTextFieldValues.coDriverName;
            this.trips[index].coDriverUsername = this.tempTextFieldValues.coDriverUsername;
            this.trips[index].trailerName = this.tempTextFieldValues.trailerName;
            this.trips[index].driverID = this.tempTextFieldValues.driverID;
            this.trips[index].coDriverID = this.tempTextFieldValues.coDriverID;
            this.trips[index].trailerID = this.informationAsset;

            if(this.trips[index].vehicleID != '' || this.trips[index].driverUsername != '' || this.trips[index].coDriverUsername != '' || this.trips[index].trailerName != '') {
                $("#editCell11"+index).prop('disabled', true);
            } else {
                $("#editCell11"+index).prop('disabled', false);
            }

            // if user select to populate all the fields
            if(addType == 'populate') {
                for (let l = 0; l < this.trips.length; l++) {
                    const element = this.trips[l];
                    if(element.carrierID == null) {
                        element.vehicleName = this.tempTextFieldValues.vehicleName;
                        element.vehicleID = this.tempTextFieldValues.vehicleID;
                        element.trailer = this.tempTextFieldValues.trailer;
                        element.driverName = this.tempTextFieldValues.driverName;
                        element.driverUsername = this.tempTextFieldValues.driverUsername;
                        element.coDriverName = this.tempTextFieldValues.coDriverName;
                        element.coDriverUsername = this.tempTextFieldValues.coDriverUsername;
                        element.trailerName = this.tempTextFieldValues.trailerName;
                        element.driverID = this.tempTextFieldValues.driverID;
                        element.coDriverID = this.tempTextFieldValues.coDriverID;
                        element.trailerID = this.informationAsset;
                        element.disablecarr = true;
                    }
                }

                $("#assignConfirmationModal").modal('hide');
            }

            this.getStateWiseMiles();
            this.emptyAssetModalFields();
            $('#assetModal').modal('hide');
        }
    }

    getNewRowValues(event: any, type) {
        if (type === 'date') {
            this.textFieldValues.date = event.target.value;
        } else if (type === 'name') {
            this.textFieldValues.name = event.target.value;
        } else if (type === 'location') {
            this.textFieldValues.locationName = event.target.value;
        } else if (type === 'miles') {
            this.textFieldValues.miles = event.target.value;
        } else if (type === 'tripType') {
            this.textFieldValues.type = event.target.value;
        } else if (type === 'mileType') {
            this.textFieldValues.mileType = event.target.value;
        } else if (type === 'carrier') {
            this.textFieldValues.carrierID = event.target.value;
            this.textFieldValues.carrierName = event.target.options[event.target.options.selectedIndex].text;
        }
    }

    vehicleChange($event, type) {
        if ($event === undefined) {
            $(".vehicleClass").removeClass('td_border');
            this.tempTextFieldValues.vehicleName = '';
            this.tempTextFieldValues.vehicleID = '';
            this.assetDataVehicleID = null;
        } else {
            if (type === 'click') {
                this.assetDataVehicleID = $event.vehicleID;
            }
            this.tempTextFieldValues.vehicleName = $event.vehicleIdentification;
            this.tempTextFieldValues.vehicleID = $event.vehicleID;
            $(".vehicleClass").removeClass('td_border');
            $("#veh_" + $event.vehicleID).addClass('td_border');
        }
    }

    async driverChange($event, type, eventType) {
        if ($event === undefined) {
            if (type === 'driver') {
                $(".driverClass").removeClass('td_border');
                this.tempTextFieldValues.driverName = '';
                this.tempTextFieldValues.driverUsername = '';
                this.assetDataDriverUsername = null;
                this.tempTextFieldValues.driverID = '';
            } else {
                $(".codriverClass").removeClass('td_border');
                this.tempTextFieldValues.coDriverName = '';
                this.tempTextFieldValues.coDriverUsername = '';
                this.assetDataCoDriverUsername = null;
                this.tempTextFieldValues.coDriverID = '';
            }
        } else {
            if (type === 'driver') {
                await this.spinner.show();
                this.assetDataCoDriverUsername = null; //reset the codriver selected
                await this.fetchCoDriver($event.driverID);
                this.tempTextFieldValues.driverName = $event.fullName;
                this.tempTextFieldValues.driverUsername = $event.userName;
                this.tempTextFieldValues.driverID = $event.driverID;
                this.assetDataCoDriverUsername = null;
                if (eventType === 'click') {
                    this.assetDataDriverUsername = $event.userName;
                }
                $(".driverClass").removeClass('td_border');
                $("#drivr_" + $event.driverID).addClass('td_border');

                await this.spinner.hide();

            } else if (type === 'codriver') {
                this.tempTextFieldValues.coDriverName = $event.fullName;
                this.tempTextFieldValues.coDriverUsername = $event.userName;
                this.tempTextFieldValues.coDriverID = $event.driverID;

                if (eventType === 'click') {
                    this.assetDataCoDriverUsername = $event.userName;
                }
                $(".codriverClass").removeClass('td_border');
                $("#codrivr_" + $event.driverID).addClass('td_border');
            }
        }
    }

    assetsChange($event, type) {
        this.tempTextFieldValues.trailerName = '';
        if ($event === undefined) {
            $(".assetClass").removeClass('td_border');
        } else {
            if (type === 'change') {
                this.tempTextFieldValues.trailer = [];

                $(".assetClass").removeClass('td_border');
                let arayy = [];
                for (let i = 0; i < $event.length; i++) {
                    const element = $event[i];

                    $("#asset_" + element.assetID).addClass('td_border');
                    arayy.push(element.assetID);
                    let objj = {
                        id: element.assetID,
                        name: element.assetIdentification
                    }
                    this.tempTextFieldValues.trailer.push(objj);
                }
            } else {
                let arayy = [];
                $("#asset_" + $event.assetID).addClass('td_border');
                let objj = {
                    id: $event.assetID,
                    name: $event.assetIdentification
                }
                this.tempTextFieldValues.trailer.push(objj);
                for (let i = 0; i < this.tempTextFieldValues.trailer.length; i++) {
                    const element = this.tempTextFieldValues.trailer[i];
                    arayy.push(element.id);
                }
                this.informationAsset = arayy;
            }
            let trailerNames = this.tempTextFieldValues.trailer.map(function (v) { return v.name; });
            trailerNames = trailerNames.join();
            this.tempTextFieldValues.trailerName = trailerNames;
        }
    }

    async createTrip() {
        this.hideErrors();
        this.submitDisabled = true;

        this.tripData.dateCreated = moment(this.dateCreated).format("YYYY-MM-DD");
        this.tripData.orderId = this.OrderIDs;
        this.tripData.mapFrom = (this.mapOrderActive === 'active') ? 'order' : 'route';
        this.tripData.tripPlanning = [];
        let planData = this.trips

        if(this.tripData.orderId.length == 0) {
            this.toastr.error('Please select order(s).');
            this.submitDisabled = false;
            return false;
        }

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan.');
            this.submitDisabled = false;
            return false;
        }

        if (planData.length < 2) {
            this.toastr.error('Please add atleast two trip plans.');
            this.submitDisabled = false;
            return false;
        }

        let selectedDriverids = [];
        let selectedCarrierids = [];
        let selectedVehicles = [];
        let selectedAssets = [];
        let selectedLocations = '';
        let stlStatus = [];
        if (planData.length >= 2) {
            let addedPlan = planData.map(function (v) { return v.type; });

            if (addedPlan.includes('Pickup') !== true || addedPlan.includes('Delivery') !== true) {
                this.toastr.error('Pickup and delivery points are required.');
                return false;
            }
            for (let i = 0; i < planData.length; i++) {

                let obj = {
                    type: '',
                    date: '',
                    name: '',
                    location: '',
                    mileType: '',
                    miles: '',
                    vehicleID: '',
                    vehicleName:'',
                    assetID: [],
                    driverUsername: '',
                    codriverUsername: '',
                    carrierID: null,
                    pickupTime: '',
                    dropTime: '',
                    actualPickupTime: '',
                    actualDropTime: '',
                    lat: '',
                    lng: '',
                    driverID: '',
                    coDriverID: '',
                    locData: {},
                    locMan: false,
                    planID: '',
                };
                const element = planData[i];

                obj.type = element.type;
                obj.date = element.date;
                obj.name = element.name;
                obj.location = element.locationName;
                obj.mileType = element.mileType;
                obj.miles = element.miles;
                obj.vehicleID = element.vehicleID;
                obj.vehicleName=this.vehiclesObjects[element.vehicleID]
                obj.pickupTime = element.pickupTime;
                obj.dropTime = element.dropTime;
                obj.actualPickupTime = element.actualPickupTime;
                obj.actualDropTime = element.actualDropTime;
                obj.lat = element.lat;
                obj.lng = element.lng;
                obj.driverID = element.driverID;
                obj.coDriverID = element.coDriverID;
                obj.locData = element.locData;
                obj.locMan = element.locMan;
                obj.planID = element.planID;

                if(element.driverID != '' && element.driverID != undefined) {
                    if(!selectedDriverids.includes(element.driverID)) {
                        selectedDriverids.push(element.driverID);
                        let driverStatus = element.driverID + ':false';
                        stlStatus.push(driverStatus);
                    }
                }

                if(element.coDriverID != '' && element.coDriverID != undefined) {
                    if(!selectedDriverids.includes(element.coDriverID)) {
                        selectedDriverids.push(element.coDriverID);
                        let driverStatus = element.driverID + ':false';
                        stlStatus.push(driverStatus);
                    }
                }

                if(element.vehicleID != '' && element.vehicleID != undefined) {
                    if(!selectedVehicles.includes(element.vehicleID)) {
                        selectedVehicles.push(element.vehicleID);
                    }
                }

                if(element.locationName != '' && element.locationName != undefined) {
                    element.locationName = element.locationName.replace(/,/g, "");
                    selectedLocations += element.locationName.toLowerCase() + '|';
                }

                if(element.carrierID != '' && element.carrierID != undefined && element.carrierID != null) {
                    if(!selectedCarrierids.includes(element.carrierID)) {
                        selectedCarrierids.push(element.carrierID);
                        let carrStatus = element.carrierID + ':false';
                        stlStatus.push(carrStatus);
                    }
                }

                if (element.trailer != '' && element.trailer != undefined) {
                    for (let j = 0; j < element.trailer.length; j++) {
                        const element1 = element.trailer[j];
                        obj.assetID.push(element1.id);

                        if(element1.id != '' && element1.id != undefined) {
                            if(!selectedAssets.includes(element1.id)) {
                                selectedAssets.push(element1.id);
                            }
                        }
                    }
                }
                obj.driverUsername = element.driverUsername;
                obj.codriverUsername = element.coDriverUsername;
                obj.carrierID = element.carrierID;

                this.tripData.tripPlanning.push(obj);
            }
        }
        this.tripData.driverIDs = selectedDriverids;
        this.tripData.vehicleIDs = selectedVehicles;
        this.tripData.assetIDs = selectedAssets;
        this.tripData.loc = selectedLocations;
        this.tripData.stlStatus = stlStatus;
        this.tripData.carrierIDs = selectedCarrierids;
        for (let i = 0; i < this.splitArr.length; i++) {
            const element = this.splitArr[i];
            this.tripData.split[i] = [];
            element.map((v) => {
                this.tripData.split[i].push(v.planID);
            })
        }
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        this.apiService.postData('trips', this.tripData).subscribe({
            complete: () => {
            },
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
                            this.spinner.hide();
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
                this.spinner.hide();
                this.response = res;
                // this.updateOrderStatus();
                this.toastr.success('Trip added successfully.');
                this.cancel();
            },
        });
    }

    throwErrors() {
        from(Object.keys(this.errors))
          .subscribe((v) => {
              $('[name="' + v + '"]')
              .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
              .addClass('error');
          });

        this.spinner.hide();
      }

    hideErrors() {
        from(Object.keys(this.errors))
            .subscribe((v) => {
                $('[name="' + v + '"]')
                    .removeClass('error')
                    .next()
                    .remove('label')
            });
        this.errors = {};
    }

    changeOrderTab(tabType) {
        // this.tripData.orderType = tabType;
    }

    fetchOrders() {
        this.ltlOrders = [];
        this.ftlOrders = [];
        this.spinner.show();
        this.apiService.getData('orders/get/confirmed').subscribe({
            complete: () => { },
            error: () => { },
            next: (result: any) => {
                this.spinner.hide();
                let data = result.Items;
                this.setOrdersDataFormat(data,'all');
            }
        })
    }

    setOrdersDataFormat(orders,type) {
        let data = orders.map((i) => {
            const element = i;

            i.pickupLocations = '';
            i.deliveryLocations = '';
            if (i.shippersReceiversInfo) {
                let ind = 1;
                let ind2 = 1;
                i.shippersReceiversInfo.map((j) => {
                    j.receivers.map((k) => {
                        k.dropPoint.map((dr) => {
                            let dateTime = '';
                            if (dr.dateAndTime != undefined && dr.dateAndTime != '') {
                                let dmy = dr.dateAndTime.split(' ');
                                dateTime = moment(dmy[0]).format("YYYY/MM/DD") + ' ' + dmy[1];
                            }
                            if(dr.address.manual) {
                                i.deliveryLocations += ind + '. ' + dr.address.address + ' <br/>' + dateTime + ' <br/>';
                            } else {
                                i.deliveryLocations += ind + '. ' + dr.address.dropOffLocation + ' <br/>' + dateTime + ' <br/>';
                            }

                            ind++;
                        })

                    })
                })

                i.shippersReceiversInfo.map((m) => {
                    m.shippers.map((n) => {
                        n.pickupPoint.map((pk) => {
                            let dateTime = '';
                            if (pk.dateAndTime != undefined && pk.dateAndTime != '') {
                                let dmy = pk.dateAndTime.split(' ');
                                dateTime = moment(dmy[0]).format("YYYY/MM/DD") + ' ' + dmy[1];
                            }
                            if(pk.address.manual) {
                                i.pickupLocations += ind2 + '. ' + pk.address.address + ' <br/>' + dateTime + ' <br/>';
                            } else {
                                i.pickupLocations += ind2 + '. ' + pk.address.pickupLocation + ' <br/>' + dateTime + ' <br/>';
                            }
                            ind2++;
                        })

                    })
                })
            }
            if(type == 'all') {
                element.selected = false;
            } else {
                element.selected = true;
            }

            if (element.orderMode == 'FTL') {
                if(type == 'all') {
                    this.ftlOrders.push(element);
                } else {
                    this.ftlOrders.unshift(element);
                }

            } else if (element.orderMode == 'LTL') {
                if(type == 'all') {
                    this.ltlOrders.push(element);
                } else {
                    this.ltlOrders.unshift(element);
                }

            }

            if(type != 'all') {
                this.allFetchedOrders.push(i);
            }

            return i;
        });

        if(type == 'all') {
            this.allFetchedOrders = data;
        }
    }

    /*
    * Get all customer's IDs of names from api
   */
    fetchCustomerByIDs() {
        this.apiService.getData('contacts/get/list').subscribe((result: any) => {
            this.customersObjects = result;
            this.shippersObjects = result;
            this.receiversObjects = result;
        });
    }

    public searchLocation() {
        let target;
        this.searchTerm.pipe(
            map((e: any) => {
                $('.map-search__results').hide();
                $(e.target).closest('td').addClass('show-search__result');
                target = e;
                return e.target.value;
            }),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                return this.hereMap.searchEntries(term);
            }),
            catchError((e) => {
                return throwError(e);
            }),
        ).subscribe(res => {
            this.searchResults = res;
        });
    }

    async assignLocation(elem, item, index) {
        // await this.resetMap();
        if (elem == 'editLoc') {
            this.trips[index].locationName = item.address.label;
            this.trips[index]['lat'] = item.position.lat;
            this.trips[index]['lng'] = item.position.lng;

            this.actualMiles = 0;
            await this.getMiles()
            await this.resetMap();
        } else {
            this.textFieldValues.locationName = item.address.label;
            this.textFieldValues.lat = item.position.lat;
            this.textFieldValues.lng = item.position.lng;
        }
        this.searchResults = false;
        $('td').removeClass('show-search__result');
    }

    fetchTripDetail() {
        this.spinner.show();
        this.apiService.getData('trips/' + this.tripID).
            subscribe((result: any) => {
                this.tripNoDisabled = true;
                this.isEdit = true;
                result = result.Items[0];
                let tripPlanning = result.tripPlanning;
                this.tripData['reeferTemperature'] = result.reeferTemperature;
                this.tripData['reeferTemperatureUnit'] = result.reeferTemperatureUnit;
                this.tripData['tripNo'] = result.tripNo;
                this.tripData['routeID'] = result.routeID;
                this.tripData['bol'] = result.bol;
                this.tripData['createdDate'] = result.createdDate;
                this.tripData['createdTime'] = result.createdTime;
                this.tripData['mapFrom'] = result.mapFrom;
                this.tripData['settlmnt'] = result.settlmnt;
                this.dateCreated = result.dateCreated;
                this.orderNo = '';

                if(result.mapFrom == 'order') {
                    this.mapOrderActive = 'active';
                    this.mapRouteActive = '';
                } else {
                    this.mapOrderActive = '';
                    this.mapRouteActive = 'active';
                }

                //fetch order details
                if(result.orderId.length > 0){
                    this.fetchOrderDetails(result.orderId);
                    this.OrderIDs = result.orderId;
                }

                this.tripData['orderType'] = result.orderType;
                this.tripData['timeCreated'] = result.timeCreated;
                this.tripData['tripStatus'] = result.tripStatus;
                this.tripData.notifications = result.notifications;

                let locations = [];

                // for(let plann of tripPlanning) {
                //     if(plann.location != undefined && plann.location != ''){
                //         locations.push(plann.location)
                //     }
                // }

                for (let i = 0; i < tripPlanning.length; i++) {
                    const element = tripPlanning[i];
                    let obj = {
                        planID: element.planID,
                        carrierID: element.carrierID,
                        carrierName: this.carriersObject[element.carrierID],
                        coDriverName: this.driversObjects[element.coDriverID],
                        coDriverUsername: element.codriverUsername,
                        date: element.date,
                        // time: element.time,
                        pickupTime: element.pickupTime,
                        dropTime: element.dropTime,
                        actualPickupTime: element.actualPickupTime,
                        actualDropTime: element.actualDropTime,
                        driverName: this.driversObjects[element.driverID],
                        driverUsername: element.driverUsername,
                        // location: element.location,
                        driverID: element.driverID,
                        coDriverID: element.coDriverID,
                        locationName: element.location,
                        mileType: element.mileType,
                        miles: element.miles,
                        name: element.name,
                        trailer: '',
                        trailerID: element.assetID,
                        type: element.type,
                        vehicleID: element.vehicleID,
                        vehicleName: this.vehiclesObjects[element.vehicleID],
                        lat: element.lat,
                        lng: element.lng,
                        locMan: element.locMan,
                        locData: element.locData,
                    };

                    if(element.location != undefined && element.location != ''){
                        locations.push(element.location)
                    }

                    this.actualMiles += parseFloat(element.miles);
                    this.trips.push(obj);
                    let assetArr = [];
                    for (let j = 0; j < element.assetID.length; j++) {
                        const assetID = element.assetID[j];
                        let assObj = {
                            id: assetID,
                            name: this.assetsObjects[assetID]
                        }

                        assetArr.push(assObj);
                        this.trips[i].trailer = assetArr;
                    }

                    let trailerNames:any = assetArr.map(function (v) { return v.name; });
                    trailerNames = trailerNames.join();
                    this.trips[i].trailerName = trailerNames;
                }

                // split trip
                if(result.split) {
                    result.split.map((x, cind) => {
                        this.splitArr[cind] = [];
                        x.map((c) => {
                            this.trips.map((t) => {
                                if(t.planID === c) {
                                    this.dummySplitArr.push(t.planID);
                                    t.splitDone = true;
                                    t.split = true;
                                    this.splitArr[cind].push(t);
                                }
                            })
                        })
                    })
                }
                if(this.dummySplitArr.length === this.trips.length) {
                    this.disableSplit = true;
                } else {
                    this.disableSplit = false;
                }

                if(locations.length > 0) {
                    this.resetMap();
                }
                this.spinner.hide();
            })
    }

    async updateTrip() {
        this.hideErrors();
        this.submitDisabled = true;
        this.tripData.orderId = this.OrderIDs;
        this.tripData.tripPlanning = [];
        this.tripData['tripID'] = this.route.snapshot.params['tripID'];
        this.tripData.dateCreated = moment(this.dateCreated).format("YYYY-MM-DD");
        this.tripData.mapFrom = (this.mapOrderActive === 'active') ? 'order' : 'route';

        let planData = this.trips;

        if(this.tripData.orderId.length == 0) {
            this.toastr.error('Please select order.');
            this.submitDisabled = false;
            return false;
        }

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan.');
            this.submitDisabled = false;
            return false;
        }

        if (planData.length < 2) {
            this.toastr.error('Please add atleast two trip plans.');
            this.submitDisabled = false;
            return false;
        }

        if (planData.length >= 2) {
            let addedPlan = planData.map(function (v) { return v.type; });

            if (addedPlan.includes('Pickup') !== true || addedPlan.includes('Delivery') !== true) {
                this.toastr.error('Pickup and delivery points are required.');
                return false;
            }
        }

        let selectedCarrierids = [];
        let selectedDriverids = [];
        let selectedVehicles = [];
        let selectedLocations = '';
        let selectedAssets = [];
        let stlStatus = [];

        for (let i = 0; i < planData.length; i++) {

            let obj = {
                type: '',
                date: '',
                name: '',
                location: '',
                mileType: '',
                miles: '',
                vehicleID: '',
                vehicleName:'',
                assetID: [],
                driverUsername: '',
                codriverUsername: '',
                carrierID: null,
                // time: '',
                pickupTime: '',
                dropTime: '',
                actualPickupTime: '',
                actualDropTime: '',
                lat: '',
                lng: '',
                driverID: '',
                coDriverID: '',
                locData: {},
                locMan: false,
                planID: '',
            };
            const element = planData[i];

            obj.type = element.type;
            obj.date = element.date;
            obj.name = element.name;
            obj.location = element.locationName,
            obj.mileType = element.mileType;
            obj.miles = element.miles;
            obj.vehicleID = element.vehicleID;
            obj.vehicleName=this.vehiclesObjects[element.vehicleID]

            //   obj.time = element.time;
            obj.pickupTime = element.pickupTime;
            obj.dropTime = element.dropTime;
            obj.actualPickupTime = element.actualPickupTime;
            obj.actualDropTime = element.actualDropTime;
            obj.lat = element.lat;
            obj.lng = element.lng;
            obj.driverID = element.driverID;
            obj.coDriverID = element.coDriverID;
            obj.locData = element.locData;
            obj.locMan = element.locMan;
            obj.planID = element.planID;

            if (element.trailer != undefined && element.trailer != null) {
                for (let j = 0; j < element.trailer.length; j++) {
                    const element1 = element.trailer[j];
                    obj.assetID.push(element1.id);

                    if(element1.id != '' && element1.id != undefined) {
                        if(!selectedAssets.includes(element1.id)) {
                            selectedAssets.push(element1.id);
                        }
                    }
                }
            }
            obj.driverUsername = element.driverUsername;
            obj.codriverUsername = element.coDriverUsername;
            obj.carrierID = element.carrierID;

            if(element.driverID != '' && element.driverID != undefined) {
                if(!selectedDriverids.includes(element.driverID)) {
                    selectedDriverids.push(element.driverID);
                    let driverStatus = element.driverID + ':false';
                    stlStatus.push(driverStatus);
                }
            }

            if(element.coDriverID != '' && element.coDriverID != undefined) {
                if(!selectedDriverids.includes(element.coDriverID)) {
                    selectedDriverids.push(element.coDriverID);
                    let driverStatus = element.coDriverID + ':false';
                    stlStatus.push(driverStatus);
                }
            }

            if(element.vehicleID != '' && element.vehicleID != undefined) {
                if(!selectedVehicles.includes(element.vehicleID)) {
                    selectedVehicles.push(element.vehicleID);
                }
            }

            if(element.carrierID != null && element.carrierID != undefined) {
                if(!selectedCarrierids.includes(element.carrierID)) {
                    selectedCarrierids.push(element.carrierID);
                    let carrStatus = element.carrierID + ':false';
                    stlStatus.push(carrStatus);
                }
            }

            if(element.locationName != '' && element.locationName != undefined) {
                element.locationName = element.locationName.replace(/,/g, "");
                selectedLocations += element.locationName.toLowerCase() + '|';
            }

            this.tripData.tripPlanning.push(obj);
        }
        for (let i = 0; i < this.splitArr.length; i++) {
            const element = this.splitArr[i];
            this.tripData.split[i] = [];
            element.map((v) => {
                this.tripData.split[i].push(v.planID);
            })
        }
        this.tripData.driverIDs = selectedDriverids;
        this.tripData.vehicleIDs = selectedVehicles;
        this.tripData.assetIDs = selectedAssets;
        this.tripData.loc = selectedLocations;
        this.tripData.stlStatus = stlStatus;
        this.tripData.carrierIDs = selectedCarrierids;

        // this.spinner.show();
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        this.updateOrderStatusToConfirmed();
        this.apiService.putData('trips', this.tripData).subscribe({
            complete: () => {
            },
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
                            this.spinner.hide();
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
                this.spinner.hide();
                this.response = res;
                this.toastr.success('Trip updated successfully.');
                this.cancel();
            },
        });
    }

    getCurrentuser = async () => {
        this.currentUser = (await Auth.currentSession()).getIdToken().payload;
        this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }

    updateOrderStatusToConfirmed() {
        for (let i = 0; i < this.OldOrderIDs.length; i++) {
            const orderID = this.OldOrderIDs[i];
            this.apiService.getData('orders/update/orderStatus/' + orderID + '/confirmed').subscribe((result: any) => {});
        }
    }

    resetMap() {
        this.newCoords = [];
        this.trips.map((v: any) => {
            if(v.lat != '' && v.lng != '') {
                this.newCoords.push(`${v.lat},${v.lng}`)
            }
        })
        this.hereMap.calculateRoute(this.newCoords,this.optionalSpec)
    }

    getVehicles(){
        this.selectedVehicleSpecs=[]
        this.trips.forEach(trip=>{
            if(trip.vehicleID){
                this.selectedVehicleSpecs.push(this.vehicles.find(({vehicleID})=>vehicleID==trip.vehicleID).specifications)
            }
        })
        if(this.selectedVehicleSpecs.length>0){
            this.optionalSpec={
                "height":Math.max.apply(Math, this.selectedVehicleSpecs.map(function(spec) { return spec.height*100; }))
            }
            this.resetMap();
        }
    }

    fetchOrderDetails(orderIds) {
        this.OldOrderIDs = orderIds;
        orderIds = JSON.stringify(orderIds);
        this.apiService.getData('orders/fetch/selectedOrders?orderIds='+orderIds).subscribe((result: any) => {
            let calcultedBy = '';
            let totalMilesOrder = 0;
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                const v = result[i];
                if(v.invoiceGenerate) {
                    this.submitDisabled = true;
                }
                calcultedBy = element.milesInfo.calculateBy;
                totalMilesOrder += parseFloat(element.milesInfo.totalMiles);
                this.orderNo += element.orderNumber;
                if(i < result.length-1) {
                    this.orderNo = this.orderNo+', ';
                }

                if (v.shippersReceiversInfo) {
                    v.shippersReceiversInfo.map((m) => {
                        let PDate = '';
                        let PTime = '';

                        m.shippers.map(async (n) => {
                            n.pickupPoint.map((pk) => {
                                if (pk.dateAndTime != undefined && pk.dateAndTime != '') {
                                    let dmy = pk.dateAndTime.split(' ');
                                    PDate = dmy[0].split('-').reverse().join('-');
                                    PTime = dmy[1];
                                }
                                let pickLocation = '';
                                if(pk.address.manual) {
                                    pickLocation = `${pk.address.address}, ${pk.address.city}, ${pk.address.state}. ${pk.address.country}`;
                                } else {
                                    pickLocation = pk.address.pickupLocation;
                                }
                                let pickupMiles = 0;
                                let obj = {
                                    type: 'Pickup',
                                    // date: PDate,
                                    name: this.shippersObjects[n.shipperID],
                                    miles: pickupMiles,
                                    carrierID: null,
                                    carrierName: '',
                                    // time: PTime,
                                    pickupTime: PTime,
                                    dropTime: '',
                                    actualPickupTime: '',
                                    actualDropTime: '',
                                    locationName: pickLocation,
                                    vehicleName: '',
                                    trailerName: '',
                                    driverName: '',
                                    coDriverName: '',
                                    fromOrder: 'yes',
                                    lat:pk.address.geoCords.lat,
                                    lng:pk.address.geoCords.lng
                                }
                                this.orderStops.push(obj);
                                this.orderStops.sort((a, b) => b.type.localeCompare(a.type));
                            })
                        })
                    })

                    v.shippersReceiversInfo.map( (j) => {
                         j.receivers.map(async (k) => {
                            k.dropPoint.map((dr) => {
                                let DrDate = '';
                                let DrTime = '';
                                if (dr.dateAndTime != undefined && dr.dateAndTime != '') {
                                    let dmy = dr.dateAndTime.split(' ');
                                    DrDate = dmy[0].split('-').reverse().join('-');
                                    DrTime = dmy[1];
                                }
                                let dropLocation = '';
                                if(dr.address.manual) {
                                    dropLocation = `${dr.address.address}, ${dr.address.city}, ${dr.address.state}, ${dr.address.country}`;
                                } else {
                                    dropLocation = dr.address.dropOffLocation;
                                }

                                let deliveryMiles = 0;
                                let obj = {
                                    type: 'Delivery',
                                    // date: DrDate,
                                    name: this.receiversObjects[k.receiverID],
                                    miles: deliveryMiles,
                                    carrierID: null,
                                    carrierName: '',
                                    // time: DrTime,
                                    pickupTime: '',
                                    dropTime: DrTime,
                                    actualPickupTime: '',
                                    actualDropTime: '',
                                    locationName: dropLocation,
                                    vehicleName: '',
                                    trailerName: '',
                                    driverName: '',
                                    coDriverName: '',
                                    fromOrder: 'yes',
                                    lat:dr.address.geoCords.lat,
                                    lng:dr.address.geoCords.lng
                                }

                                this.orderStops.push(obj);
                                this.orderStops.sort((a, b) => b.type.localeCompare(a.type));
                            })
                        })
                    })
                }
            }
            this.setOrdersDataFormat(result,'selected');
            this.orderMiles =
            {
                calculateBy: calcultedBy,
                totalMiles: totalMilesOrder
            }
        })
    }

    changeMapRoute(type) {
        if(type == 'route') {
            if(this.tripData.routeID != '' && this.tripData.routeID != null) {
                this.orderStops = this.trips;
                this.trips = [];
                this.actualMiles = 0;
                //change route
                this.apiService.getData('routes/' + this.tripData.routeID)
                .subscribe(async (result: any) => {
                    let routeData = result.Items[0];
                    let routePath:any = [];
                    this.newCoords = [];

                    if(routeData.stops.length > 0) {

                        for (let i = 0; i < routeData.stops.length; i++) {
                            const element = routeData.stops[i];
                            routePath.push(element.stopName);
                            let routeType = '';
                            if(i == 0) {
                                routeType = 'Pickup';
                            } else if(i > 0 && i < routeData.stops.length) {
                                routeType = 'Stop';
                            }
                            if(i == routeData.stops.length-1) {
                                routeType = 'Delivery';
                            }

                            let obj = {
                                splitDone: false,
                                split: false,
                                planID: uuidv4(),
                                type: routeType,
                                name: '',
                                miles: 0,
                                carrierID: null,
                                carrierName: '',
                                pickupTime: '',
                                dropTime: '',
                                actualPickupTime: '',
                                actualDropTime: '',
                                locationName: element.name,
                                vehicleName: '',
                                trailerName: '',
                                driverName: '',
                                coDriverName: '',
                                fromOrder: 'yes',
                                lat:element.lat,
                                lng:element.lng
                            }

                            this.newCoords.push(`${element.lat},${element.lng}`)
                            this.trips.push(obj);
                        }
                        await this.hereMap.calculateRoute(this.newCoords);
                    }
                    await this.getMiles();
                });

                this.mapOrderActive = '';
                this.mapRouteActive = 'active';
                this.tripData.mapFrom = 'route';
            } else {
                this.mapOrderActive = 'active';
                this.mapRouteActive = '';
                this.tripData.mapFrom = 'order';
                this.mapOrderActiveDisabled = false;
                this.toastr.error('Please select permanent route');
            }
        } else {
            if(this.orderNo != '' && this.orderNo != undefined) {
                this.trips = this.orderStops;
                this.actualMiles = 0;
                this.getMiles();
                this.resetMap();
                this.mapOrderActive = 'active';
                this.mapRouteActive = '';
                this.tripData.mapFrom = 'order';
            } else {
                this.mapOrderActive = '';
                this.mapRouteActive = 'active';
                this.tripData.mapFrom = 'route';
                this.toastr.error('Please select order');
            }
        }
    }

    makeRoutePlan() {
        if(this.tripData.mapFrom == 'route') {
            this.changeMapRoute('route')
        }
    }

    async getStateWiseMiles() {
        let allLatLng = [];
        let vehicleIDs = [];

        for (let ij = 0; ij < this.trips.length; ij++) {
            const element1 = this.trips[ij];
            if (!vehicleIDs.includes(element1.vehicleID) && element1.vehicleID != undefined && element1.vehicleID != '') {
                vehicleIDs.push(element1.vehicleID);
            }
        }

        let tripData = [];
        vehicleIDs.forEach((element) => {

            allLatLng = [];
            tripData[0] = [];
            this.trips.map((k: any) => {
                if (element == k.vehicleID) {
                    let endingPoint = k.lng + "," + k.lat;
                    allLatLng.push(endingPoint);
                }
            })
            try {
                let newsMiles = JSON.stringify(allLatLng);
                this.apiService.getData('trips/calculate/pc/miles?type=stateReport&stops=' + newsMiles).subscribe((result) => {
                    for (let m = 0; m < result.length; m++) {
                        const milesElement = result[m];
                        milesElement.distanceUnit = 'miles';
                        delete milesElement.Empty;
                        delete milesElement.Energy;
                        delete milesElement.Ferry;
                    }

                    const data = {
                        [element]: result
                    }
                    tripData[0].push(data);
                });
            } catch (error) {
                return false;
            }
        })

        this.tripData.iftaMiles = tripData;
    }

    showConfirmationPopup() {
        $("#assignConfirmationModal").modal('show');
    }

    locationModel(type, index = '') {
        this.locObj = {
            addr: '',
            cCode: null,
            sCode: null,
            cName: '',
            sName: '',
            ctName: null,
            zipCode: '',
            type: '',
            index: '',
        }
        if(this.locObj.type == 'add') {
            this.textFieldValues.locationName = '';
        }

        if(this.textFieldValues.locMan || this.trips[index].locMan) {
            this.locObj.type = type;
            this.locObj.index = index;
            if(this.locObj.type == 'edit') {
                this.locObj.addr = this.trips[index].locData.addr;
                this.locObj.ctName = this.trips[index].locData.ctName
                this.locObj.sName = this.trips[index].locData.sName;
                this.locObj.cName = this.trips[index].locData.cName;
                this.locObj.zipCode = this.trips[index].locData.zip;
                this.locObj.sCode = this.trips[index].locData.sCode;
                this.locObj.cCode = this.trips[index].locData.cCode;
            }
            $("#manualLocationModal").modal('show');
        }

    }

    fetchCountries() {
        this.countries = CountryStateCity.GetAllCountries();
    }

    getStates(countryCode) {
        this.states = CountryStateCity.GetStatesByCountryCode([countryCode]);
        this.locObj.cName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    }

    getCities(stateCode, countryCode) {
        this.cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
        this.locObj.sName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    }

    async saveManualLocation() {
        this.locDisabled = true;
        let data = {
            address: this.locObj.addr,
            cityName: this.locObj.ctName,
            stateName: this.locObj.sName,
            countryName: this.locObj.cName,
            zipCode: this.locObj.zipCode
        }
        let tripData = {
            addr: this.locObj.addr,
            ctName: this.locObj.ctName,
            sName: this.locObj.sName,
            cName: this.locObj.cName,
            zip: this.locObj.zipCode,
            sCode: this.locObj.sCode,
            cCode: this.locObj.cCode,
        }
        let result = await this.newGeoCode(data);
        if(this.locObj.type == 'add') {
            this.textFieldValues.locData = tripData;
            this.textFieldValues.lat = result.lat;
            this.textFieldValues.lng = result.lng;
        }
        this.textFieldValues.locationName = `${this.locObj.addr}, ${this.locObj.ctName}, ${this.locObj.sName}, ${this.locObj.cName}, ${this.locObj.zipCode} `;
        $("#manualLocationModal").modal('hide');
    }

    async newGeoCode(data: any) {
        let result = await this.apiService.getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`).toPromise();
        if(result.items != undefined && result.items.length > 0) {
          return result.items[0].position;
        }
        this.locDisabled = false;
    }

    selectManualAddress(index) {
        this.trips[index].locationName = '';
        this.locObj = {
            addr: '',
            cCode: null,
            sCode: null,
            cName: '',
            sName: '',
            ctName: null,
            zipCode: '',
            type: '',
            index: '',
        }
    }

    splitTrip() {
        let tripDriver = [];
        for (const element of this.trips) {
            if(element.split && !this.dummySplitArr.includes(element.planID)) {
                this.dummySplitArr.push(element.planID);
                element.splitDone = true;
                tripDriver.push(element);
            }
        }
        if(this.dummySplitArr.length === this.trips.length) {
            this.disableSplit = true;
        } else {
            this.disableSplit = false;
        }
        this.splitArr.push(tripDriver);
    }

    delSubTrip(index) {
        let delArr = this.splitArr[index];
        if(delArr) {
            for (const element of this.splitArr[index]) {
                element.splitDone = false;
                element.split = false;

                let planInd = this.dummySplitArr.indexOf(element.planID);
                this.dummySplitArr.splice(planInd, 1);

            }
            this.splitArr.splice(index, 1);
            this.disableSplit = false;
        }
    }
}

