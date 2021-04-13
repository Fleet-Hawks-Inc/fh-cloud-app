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
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { zipObject } from 'lodash';
import * as moment from "moment";

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
        private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService, private pcMiles: GoogleMapsService) { }
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
        routeID: '',
        bol: '',
        reeferTemperature: '',
        reeferTemperatureUnit: null,
        orderId: {},
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
        loc: ''
    };
    ltlOrders = [];
    ftlOrders = [];

    selectedAssets = [];
    form;
    OrderIDs = [];
    temporaryOrderIDs = [];
    temporaryOrderNumber = [];
    typeOptions = ['Pickup', 'Delivery', 'Yard', 'Stop', 'Enroute'];
    ftlOptions: any = {};
    ltlOptions: any = {};
    assetModalData: any = {};
    textFieldValues: any = {
        type: '',
        date: '',
        time: '',
        pickupTime: '',
        dropTime: '',
        actualPickupTime: '',
        actualDropTime: '',
        name: '',
        location: {},
        mileType: '',
        miles: 0,
        vehicleName: '',
        vehicleID: '',
        driverName: '',
        driverUsername: '',
        coDriverName: '',
        coDriverUsername: '',
        carrierName: '',
        carrierID: '',
        trailer: {},
        trailerName: '',
        driverID: '',
        coDriverID: ''
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

    assetDataVehicleID = '';
    assetDataDriverUsername = '';
    assetDataCoDriverUsername = '';
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
    dateCreated = '';

    ngOnInit() {

        this.tripID = this.route.snapshot.params['tripID'];
        if (this.tripID != undefined) {
            this.pageTitle = 'Edit Trip';
        } else {
            this.pageTitle = 'Add Trip';
        }
        this.fetchOrders();
        this.getCurrentDate();
        this.fetchCustomerByIDs();
        this.fetchCarriers();
        this.fetchRoutes();
        this.mapShow();
        this.fetchVehicles();
        this.fetchAssets();
        this.fetchDrivers();
        // this.fetchCountries();
        this.fetchShippersByIDs();
        this.fetchReceiversByIDs();
        this.searchLocation();
        this.fetchDriversByIDs();
        this.fetchAssetsByIDs();
        this.fetchVehiclesByIDs();
        this.getCurrentuser();
        this.fetchAllCarrierIDs();
        if (this.tripID != undefined) {
            this.fetchTripDetail();
        }

        $(document).ready(() => {
            this.form = $('#form_').validate();
        });
    }

    
    fetchCarriers() {
        this.apiService.getData('externalCarriers')
            .subscribe((result: any) => {
                this.carriers = result.Items;
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

    async addRow() {
        if (this.textFieldValues.type !== '' && this.textFieldValues.locationName !== '') {

            this.textFieldValues.time = $("#cell12").val();
            this.textFieldValues.pickupTime = $("#cell13").val();
            this.textFieldValues.dropTime = $("#cell14").val();
            this.textFieldValues.actualPickupTime = $("#cell15").val();
            this.textFieldValues.actualDropTime = $("#cell16").val();

            let coordResult = await this.hereMap.geoCode(this.textFieldValues.locationName);
            if(coordResult.items[0].position != undefined) {
                this.textFieldValues['lat'] = coordResult.items[0].position.lat;
                this.textFieldValues['lng'] = coordResult.items[0].position.lng;

                if(this.trips.length > 1) {
                    let endingPoint = this.textFieldValues['lng'] + "," + this.textFieldValues['lat']
                    await this.getSingleRowMiles(endingPoint);
                }
            }
            await this.trips.push(this.textFieldValues);

            this.textFieldValues = {
                type: '',
                pickupTime: '',
                dropTime: '',
                actualPickupTime: '',
                actualDropTime: '',
                name: '',
                location: {},
                locationName: '',
                mileType: '',
                miles: 0,
                vehicleName: '',
                vehicleID: '',
                driverName: '',
                driverUsername: '',
                coDriverName: '',
                coDriverUsername: '',
                carrierName: '',
                carrierID: '',
                trailer: {},
                trailerName: '',
                driverID: '',
                coDriverID: ''
            };

            $('.newRow').val('');

            // empty the values of asset modal and temp_text_fields after adding
            this.emptyAssetModalFields();

            // location modal
            $("#locationAddress1").val('');
            $("#locationAddress2").val('');
            $("#locationZipcode").val('');
            $("#locationCountry").val('');
            this.states = [];
            this.cities = [];
            this.selectedAssets = [];

            let locations = [];
            for (let k = 0; k < this.trips.length; k++) {
                const element = this.trips[k];
                if(element.locationName != '' && element.locationName != undefined){
                    locations.push(element.locationName);
                }
            }
            if(locations.length > 0) {
                // this.getCoords(locations);
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
            // this.getCoords(locations);
            // this.resetMap();
            this.actualMiles = 0;
            this.getMiles();
        }

        if (this.trips.length > 0) {
            let dataCheck = this.trips.map(function (v) { return v.vehicleID; });

            if (dataCheck.length > 0) {
                this.tripData.tripStatus = 'dispatched';
            } else {
                this.tripData.tripStatus = 'confirmed';
            }
        } else {
            this.tripData.tripStatus = 'confirmed';
        }
    }

    emptyAssetModalFields() {
        // empty the values of asset modal and temp_text_fields after adding
        this.tempTextFieldValues.vehicleName = '';
        this.tempTextFieldValues.vehicleID = '';
        this.tempTextFieldValues.trailer = [];
        this.tempTextFieldValues.driverName = '';
        this.tempTextFieldValues.driverUsername = '';
        this.tempTextFieldValues.coDriverName = '';
        this.tempTextFieldValues.coDriverUsername = '';
        this.tempTextFieldValues.trailerName = '';

        this.assetDataVehicleID = '';
        this.informationAsset = [];
        this.assetDataDriverUsername = '';
        this.assetDataCoDriverUsername = '';
        $(".vehicleClass").removeClass('td_border');
        $(".assetClass").removeClass('td_border');
        $(".driverClass").removeClass('td_border');
        $(".codriverClass").removeClass('td_border');
    }

    showEditRow(index) {
        this.spinner.show();
        let editRowValues = this.trips[index];
        $("#editCell1" + index).val(editRowValues.type);
        $("#editCell5" + index).val(editRowValues.mileType);
        $("#editCell11" + index).val(editRowValues.carrierID);
        $("#editCell4" + index).val(editRowValues.locationName);
        $(".labelRow" + index).css('display', 'none'); 0
        $('.editRow' + index).removeClass('rowStatus');
        
        this.spinner.hide();
    }

    editRow(index) {
        this.trips[index].type = $('#editCell1' + index).val();
        this.trips[index].date = $('#editCell2' + index).val();
        if ($('#editCell3' + index).val() != '' && $('#editCell3' + index).val() != null && $('#editCell3' + index).val() != undefined) {
            this.trips[index].name = $('#editCell3' + index).val();
        }
        this.trips[index].mileType = $('#editCell5' + index).val();
        this.trips[index].miles = $('#editCell6' + index).val();
        this.trips[index].carrierID = $('#editCell11' + index + ' option:selected').val();
        if (this.trips[index].carrierID != '') {
            this.trips[index].carrierName = $('#editCell11' + index + ' option:selected').text();
        }
        this.trips[index].time = $('#editCell12' + index).val();
        this.trips[index].pickupTime = $('#editCell13' + index).val();
        this.trips[index].dropTime = $('#editCell14' + index).val();
        this.trips[index].actualPickupTime = $('#editCell15' + index).val();
        this.trips[index].actualDropTime = $('#editCell16' + index).val();

        $("#labelCell1" + index).val(this.trips[index].type);
        $("#labelCell2" + index).val(this.trips[index].date);
        $("#labelCell3" + index).val(this.trips[index].name);
        $("#labelCell4" + index).val(this.trips[index].location);
        $("#labelCell5" + index).val(this.trips[index].mileType);
        $("#labelCell6" + index).val(this.trips[index].miles);
        $("#labelCell7" + index).val(this.trips[index].vehicleName);
        $("#labelCell8" + index).val(this.trips[index].trailerName);
        $("#labelCell9" + index).val(this.trips[index].driverName);
        $("#labelCell10" + index).val(this.trips[index].coDriverName);
        $("#labelCell11" + index).val(this.trips[index].carrierName);
        $("#labelCell12" + index).val(this.trips[index].time);
        $("#labelCell13" + index).val(this.trips[index].pickupTime);
        $("#labelCell14" + index).val(this.trips[index].dropTime);
        $("#labelCell15" + index).val(this.trips[index].actualPickupTime);
        $("#labelCell16" + index).val(this.trips[index].actualDropTime);

        $(".labelRow" + index).css('display', '');
        // $(".editRow"+index).css('display','none');
        $('.editRow' + index).addClass('rowStatus');
        this.getVehicles();
    }

    closeEditRow(index) {
        $(".labelRow" + index).css('display', '');
        // $(".editRow" + index).css('display', 'none');
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

    showAssetModal(type, index) {

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
            } 
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
            // this.tempTextFieldValues.trailer = [];
            this.tempTextFieldValues.driverName = editRowValues.driverName;
            this.tempTextFieldValues.driverUsername = editRowValues.driverUsername;
            this.tempTextFieldValues.coDriverName = editRowValues.coDriverName;
            this.tempTextFieldValues.coDriverUsername = editRowValues.coDriverUsername;
            this.tempTextFieldValues.trailerName = editRowValues.trailerName;

            $("#veh_" + editRowValues.vehicleID).addClass('td_border');
            $("#drivr_" + editRowValues.driverUsername).addClass('td_border');
            $("#codrivr_" + editRowValues.coDriverUsername).addClass('td_border');

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
        this.typeOptions = ['Pickup', 'Delivery', 'Yard', 'Stop', 'Enroute'];
        this.OrderIDs = this.temporaryOrderIDs;
        $("#orderModal").modal('hide');
        this.orderNo = this.temporaryOrderNumber.toString();

        if(this.tripID) {
            this.trips = this.trips.filter(function (obj) {
                if(obj.type !== 'Pickup' && obj.type !== 'Delivery'){
                    return obj;
                }
            });
        } else {
            this.trips = this.trips.filter(function (obj) {
                return obj.fromOrder !== 'yes';
            });
        }

        let current = this;
        let totalMilesOrder = 0;
        let calculateBy = '';
        
        for (let i = 0; i < this.OrderIDs.length; i++) {
            const element = this.OrderIDs[i];

            let locations = [];
            this.allFetchedOrders.map(function (v) {
               
                if (element == v.orderID) {
                    calculateBy = v.milesInfo.calculateBy;
                    totalMilesOrder += parseFloat(v.milesInfo.totalMiles);
                    
                    if (v.shippersReceiversInfo) {
                        v.shippersReceiversInfo.map((m) => {
                            let PDate = '';
                            let PTime = '';
                            
                            m.shippers.map(async (n) => {
                                if (n.dateAndTime != undefined && n.dateAndTime != '') {
                                    let dmy = n.dateAndTime.split(' ');
                                    PDate = dmy[0].split('-').reverse().join('-');
                                    PTime = dmy[1];
                                }
                                let pickupMiles = 0;
                                let obj = {
                                    type: 'Pickup',
                                    // date: PDate,
                                    name: current.shippersObjects[n.shipperID],
                                    
                                    miles: pickupMiles,
                                    carrierID: '',
                                    carrierName: '',
                                    // time: PTime,
                                    pickupTime: PTime,
                                    dropTime: '',
                                    actualPickupTime: '',
                                    actualDropTime: '',
                                    locationName: n.pickupLocation,
                                    vehicleName: '',
                                    trailerName: '',
                                    driverName: '',
                                    coDriverName: '',
                                    fromOrder: 'yes',
                                    lat:n.position.lat,
                                    lng:n.position.lng
                                }
                                // current.calculateActualMiles(pickupMiles)
                                if(n.pickupLocation != '' && n.pickupLocation != undefined){
                                    locations.push(n.pickupLocation)
                                }
                                current.trips.push(obj);
                                current.trips.sort((a, b) => b.type.localeCompare(a.type));
                            })
                        })

                        v.shippersReceiversInfo.map( (j) => {
                             j.receivers.map(async (k) => {
                                let DrDate = '';
                                let DrTime = '';
                                if (k.dateAndTime != undefined && k.dateAndTime != '') {
                                    let dmy = k.dateAndTime.split(' ');
                                    DrDate = dmy[0].split('-').reverse().join('-');
                                    DrTime = dmy[1];
                                }
                                
                                let deliveryMiles = 0;
                                let obj = {
                                    type: 'Delivery',
                                    // date: DrDate,
                                    name: current.receiversObjects[k.receiverID],
                                    miles: deliveryMiles,
                                    carrierID: '',
                                    carrierName: '',
                                    // time: DrTime,
                                    pickupTime: '',
                                    dropTime: DrTime,
                                    actualPickupTime: '',
                                    actualDropTime: '',
                                    locationName: k.dropOffLocation,
                                    vehicleName: '',
                                    trailerName: '',
                                    driverName: '',
                                    coDriverName: '',
                                    fromOrder: 'yes',
                                    lat:k.position.lat,
                                    lng:k.position.lng
                                }
                                if(k.dropOffLocation != '' && k.dropOffLocation != undefined){
                                    locations.push(k.dropOffLocation)
                                }
                                
                                current.trips.push(obj);
                                current.trips.sort((a, b) => b.type.localeCompare(a.type));
                            })
                        })
                    }
                    return i;
                }
            })

            if(locations.length > 0) {
                // this.getCoords(locations);
                this.resetMap();
            }
        }
        this.orderMiles =
        {
            calculateBy: calculateBy,
            totalMiles: totalMilesOrder
        }
        this.actualMiles = 0;
        this.getMiles();
    }

    // async getMiles(startingPoint,endingPoint){
    //     console.log(startingPoint)
    //     let savedCord=this.saveCords;
    //     this.saveCords=endingPoint
    //     console.log("savedCord",savedCord)
    //     console.log('endingPoint',endingPoint)
        
    //     if(startingPoint==0){
    //     return 0;
    //     }
    //     else{
    //         try{
    //             this.pcMiles.pcMiles.next(true);
    //        let miles=await this.pcMiles.pcMilesDistance(savedCord+";"+endingPoint).toPromise()
    //        console.log("miles",miles)
    //        return miles
    //         }
    //         catch(error){
    //             console.error(error)
    //         }
    //     }
    // }

    async getMiles(){
        let savedCord='';
        for (let i = 0; i < this.trips.length; i++) {
            const element = this.trips[i];
            
            if(i > 0) {
                if (element.lng != undefined && element.lat != undefined) {
                    let endingPoint = element.lng + "," + element.lat;
                    try {
                        this.pcMiles.pcMiles.next(true);
                        let miles = await this.pcMiles.pcMilesDistance(savedCord + ";" + endingPoint).toPromise()
                        element.miles = miles;
                        this.calculateActualMiles(miles)
                    }
                    catch (error) {
                        console.error(error)
                    }
                    savedCord=endingPoint;
                }
            } else {
                element.miles = 0;
                savedCord=element.lng + "," + element.lat;
            }
        }
    }

    async getSingleRowMiles(endingPoint){
        let savedCord='';
        let tripLength = this.trips.length;
        savedCord = this.trips[tripLength-1].lng + "," + this.trips[tripLength-1].lat;
        try {
            this.pcMiles.pcMiles.next(true);
            let miles = await this.pcMiles.pcMilesDistance(savedCord + ";" + endingPoint).toPromise()
            this.textFieldValues.miles = miles;
            this.calculateActualMiles(miles)
        }
        catch (error) {
            console.error(error)
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
                    // current.temporaryOrderIDs.push(this.value);
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
            })
    }

    fetchAssets() {
        this.apiService.getData('assets')
            .subscribe((result: any) => {
                this.assets = result.Items;
            })
    }

    fetchDrivers() {
        this.apiService.getData('drivers')
            .subscribe((result: any) => {
                result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
                this.drivers = result.Items;
                this.codrivers = result.Items;
            })
    }

    fetchCoDriver(driverID) {
        this.codrivers = this.drivers.filter(function (obj) {
            if (obj.driverID !== driverID) {
                return obj;
            }
        });
    }

    saveAssetModalData() {
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

            //change trip status to dispatched if vehicle/drivr is selected
            if (this.tripID == undefined || this.tripID == '') {
                if(this.textFieldValues.vehicleID != '' || this.textFieldValues.driverUsername != '' || this.textFieldValues.coDriverUsername != '') {
                    this.tripData.tripStatus = 'dispatched';
                }    
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
            
            if (this.tripID == undefined || this.tripID == '') {
                this.tripData.tripStatus = 'confirmed';
            }

            //change trip status to dispatched if vehicle/drivr is selected
            if (this.tripID == undefined || this.tripID == '') {
                if(this.tempTextFieldValues.vehicleID != '' || this.tempTextFieldValues.driverUsername != '' || this.tempTextFieldValues.coDriverUsername != '') {
                    this.tripData.tripStatus = 'dispatched';
                }    
            }

            if(this.trips[index].vehicleID != '' || this.trips[index].driverUsername != '' || this.trips[index].coDriverUsername != '' || this.trips[index].trailerName != '') {
                $("#editCell11"+index).prop('disabled', true);
            } else {
                $("#editCell11"+index).prop('disabled', false);
            }

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
            this.textFieldValues.location = event.target.value;
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
            this.assetDataVehicleID = '';
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
                this.assetDataDriverUsername = '';
                this.tempTextFieldValues.driverID = '';
            } else {
                $(".codriverClass").removeClass('td_border');
                this.tempTextFieldValues.coDriverName = '';
                this.tempTextFieldValues.coDriverUsername = '';
                this.assetDataCoDriverUsername = '';
                this.tempTextFieldValues.coDriverID = '';
            }
        } else {
            if (type === 'driver') {
                // alert('here')
                await this.spinner.show();
                this.assetDataCoDriverUsername = ''; //reset the codriver selected
                await this.fetchCoDriver($event.driverID);
                this.tempTextFieldValues.driverName = $event.fullName;
                this.tempTextFieldValues.driverUsername = $event.userName;
                this.tempTextFieldValues.driverID = $event.driverID;
                this.assetDataCoDriverUsername = '';
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
        if (this.tripData.reeferTemperature != '') {
            this.tripData.reeferTemperature = this.tripData.reeferTemperature + this.tripData.reeferTemperatureUnit;
        } else {
            this.tripData.reeferTemperature = '';
        }
        this.tripData.dateCreated =  moment(this.dateCreated, 'YYYY-MM-DD hh:mm:ss').format('x');
        this.tripData.dateCreated = parseInt(this.tripData.dateCreated);

        delete this.tripData.reeferTemperatureUnit;
        this.tripData.orderId = this.OrderIDs;
        this.tripData.tripPlanning = []; 
        let planData = this.trips

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan.');
            return false;
        }

        if (planData.length < 2) {
            this.toastr.error('Please add atleast two trip plans.');
            return false;
        }

        let selectedDriverids = [];
        let selectedVehicles = [];
        let selectedAssets = [];
        let selectedLocations = '';
        if (planData.length >= 2) {
            let addedPlan = planData.map(function (v) { return v.type; });

            if (addedPlan.includes('Pickup') !== true || addedPlan.includes('Delivery') !== true) {
                this.toastr.error('Pickup and delivery points are required.');
                return false;
            }
            for (let i = 0; i < planData.length; i++) {

                let obj = {
                    type: '',
                    name: '',
                    location: '',
                    mileType: '',
                    miles: '',
                    vehicleID: '',
                    vehicleName:'',
                    assetID: [],
                    driverUsername: '',
                    codriverUsername: '',
                    carrierID: '',
                    pickupTime: '',
                    dropTime: '',
                    actualPickupTime: '',
                    actualDropTime: '',
                    lat: '',
                    lng: '',
                    driverID: '',
                    coDriverID: ''
                };
                const element = planData[i];

                obj.type = element.type;
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

                if(element.driverID != '' && element.driverID != undefined) {
                    if(!selectedDriverids.includes(element.driverID)) {
                        selectedDriverids.push(element.driverID);
                    }
                }

                if(element.coDriverID != '' && element.coDriverID != undefined) {
                    if(!selectedDriverids.includes(element.coDriverID)) {
                        selectedDriverids.push(element.coDriverID);
                    }
                }

                if(element.vehicleID != '' && element.vehicleID != undefined) {
                    if(!selectedVehicles.includes(element.vehicleID)) {
                        selectedVehicles.push(element.vehicleID);
                    }
                }

                if(element.locationName != '' && element.locationName != undefined) {
                    element.locationName = element.locationName.replace(",", "");
                    selectedLocations += element.locationName.toLowerCase() + '|';
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
        this.tripData.driverIDs = await selectedDriverids;
        this.tripData.vehicleIDs = await selectedVehicles;
        this.tripData.assetIDs = await selectedAssets;
        this.tripData.loc = await selectedLocations;
        this.spinner.show();
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
                            this.spinner.hide();
                            this.throwErrors();
                        },
                        error: () => {
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.spinner.hide();
                this.response = res;
                this.updateOrderStatus();
                this.toastr.success('Trip added successfully.');
                this.router.navigateByUrl('/dispatch/trips/trip-list');
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
        this.tripData.orderType = tabType;
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
                        let dateTime = '';
                        if (k.dateAndTime != undefined && k.dateAndTime != '') {
                            let dmy = k.dateAndTime.split(' ');
                            dateTime = dmy[0].split('-').reverse().join('-') + ' ' + dmy[1];
                        }
                        i.deliveryLocations += ind + '. ' + k.dropOffLocation + ' <br/>' + dateTime + ' <br/>';
                        ind++;
                    })
                })

                i.shippersReceiversInfo.map((m) => {
                    let dateTime = '';
                    m.shippers.map((n) => {
                        if (n.dateAndTime != undefined && n.dateAndTime != '') {
                            let dmy = n.dateAndTime.split(' ');
                            dateTime = dmy[0].split('-').reverse().join('-') + ' ' + dmy[1];
                        }
                        i.pickupLocations += ind2 + '. ' + n.pickupLocation + ' <br/>' + dateTime + ' <br/>';
                        ind2++;
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
    * Get all shippers's IDs of names from api
   */
    fetchShippersByIDs() {
        this.apiService.getData('shippers/get/list').subscribe((result: any) => {
            this.shippersObjects = result;
        });
    }

    /*
   * Get all receivers's IDs of names from api
   */
    fetchReceiversByIDs() {
        this.apiService.getData('receivers/get/list').subscribe((result: any) => {
            this.receiversObjects = result;
        });
    }

    /*
    * Get all customer's IDs of names from api
   */
    fetchCustomerByIDs() {
        this.apiService.getData('customers/get/list').subscribe((result: any) => {
            this.customersObjects = result;
        });
    }

    /*
    * Get all vehicles's IDs of names from api
   */
    fetchVehiclesByIDs() {
        this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
            this.vehiclesObjects = result;
        });
    }

    /*
    * Get all asset's IDs of names from api
   */
    fetchAssetsByIDs() {
        this.apiService.getData('assets/get/list').subscribe((result: any) => {
            this.assetsObjects = result;
        });
    }

    /*
    * Get all driver's IDs of names from api
   */
    fetchDriversByIDs() {
        this.apiService.getData('drivers/get/username-list').subscribe((result: any) => {
            this.driversObjects = result;
        });
    }

    fetchAllCarrierIDs() {
        this.apiService.getData('externalCarriers/get/list')
            .subscribe((result: any) => {
                this.carriersObject = result;
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

    async assignLocation(elem, label, index) {
        const result = await this.hereMap.geoCode(label);
        // await this.resetMap();
        if (elem == 'editLoc') {
            this.trips[index].locationName = label;
            this.trips[index]['lat'] = result.items[0].position.lat;
            this.trips[index]['lng'] = result.items[0].position.lng;

            this.actualMiles = 0;
            await this.getMiles()
            await this.resetMap();
        } else {
            this.textFieldValues.locationName = label;
        }
        this.searchResults = false;
        $('td').removeClass('show-search__result');
    }

    fetchTripDetail() {
        this.spinner.show();
        this.apiService.getData('trips/' + this.tripID).
            subscribe((result: any) => {
                result = result.Items[0];
                let temp = '';
                let tempUnit = null;
                if (result.reeferTemperature != undefined && result.reeferTemperature != '') {
                    let refTemp = result.reeferTemperature;
                    temp = refTemp.substring(0, refTemp.length - 1);
                    tempUnit = refTemp.substring(refTemp.length - 1, refTemp.length);
                }

                let tripPlanning = result.tripPlanning;

                this.tripData['tripNo'] = result.tripNo;
                this.tripData['routeID'] = result.routeID;
                this.tripData['bol'] = result.bol;
                this.dateCreated = moment(result.dateCreated, 'x').format("YYYY-MM-DD");

                // allFetchedOrders
                this.orderNo = '';
                // let curr = this;
                // let calcultedBy = '';
                // let totalMilesOrder = 0;

                //fetch order details
                if(result.orderId.length > 0){
                    this.fetchOrderDetails(result.orderId);
                    this.OrderIDs = result.orderId;
                }
                
                // for (let h = 0; h < result.orderId.length; h++) {
                //     const elementh = result.orderId[h];

                //     this.allFetchedOrders.filter(function (obj) {
                //         if (obj.orderID == elementh) {
                //             calcultedBy = obj.milesInfo.calculateBy;
                //             totalMilesOrder += parseFloat(obj.milesInfo.totalMiles);
                //             curr.orderNo += obj.orderNumber + ', ';
                //             curr.OrderIDs.push(obj.orderID)
                //             return true;
                //         }
                //     });
                // }

                // this.orderMiles =
                // {
                //     calculateBy: calcultedBy,
                //     totalMiles: totalMilesOrder
                // }

                this.tripData['reeferTemperature'] = temp;
                this.tripData['reeferTemperatureUnit'] = tempUnit;
                this.tripData['orderType'] = result.orderType;
                this.tripData['timeCreated'] = result.timeCreated;
                this.tripData['tripStatus'] = result.tripStatus;
                // this.tripData['dateCreated'] = result.dateCreated.split('-').reverse().join('-');
                this.tripData.notifications = result.notifications;

                // checkbox checked of ftl orders
                // for (let m = 0; m < this.ftlOrders.length; m++) {
                //     const element = this.ftlOrders[m];
                //     if (result.orderId.indexOf(element.orderID) !== -1) {
                //         this.ftlOrders[m].selected = true;
                //         this.OrderIDs.push(element.orderID)
                //     } else {
                //         this.ftlOrders[m].selected = false;
                //     }
                // }

                // for (let m = 0; m < this.ltlOrders.length; m++) {
                //     const element = this.ltlOrders[m];
                //     if (result.orderId.indexOf(element.orderID) !== -1) {
                //         this.ltlOrders[m].selected = true;
                //         this.OrderIDs.push(element.orderID)
                //     } else {
                //         this.ltlOrders[m].selected = false;
                //     }
                // }

                let locations = [];

                for(let plann of tripPlanning) {
                    if(plann.location != undefined && plann.location != ''){
                        locations.push(plann.location)
                    }
                }

                for (let i = 0; i < tripPlanning.length; i++) {
                    const element = tripPlanning[i];
                    let obj = {
                        carrierID: element.carrierID,
                        carrierName: this.carriersObject[element.carrierID],
                        coDriverName: this.driversObjects[element.codriverUsername],
                        coDriverUsername: element.codriverUsername,
                        // date: element.date,
                        // time: element.time,
                        pickupTime: element.pickupTime,
                        dropTime: element.dropTime,
                        actualPickupTime: element.actualPickupTime,
                        actualDropTime: element.actualDropTime,
                        driverName: this.driversObjects[element.driverUsername],
                        driverUsername: element.driverUsername,
                        // location: element.location,
                        locationName: element.location,
                        mileType: element.mileType,
                        miles: element.miles,
                        name: element.name,
                        trailer: '',
                        trailerID: [],
                        type: element.type,
                        vehicleID: element.vehicleID,
                        vehicleName: this.vehiclesObjects[element.vehicleID],
                        lat: element.lat,
                        lng: element.lng
                    };

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
                if(locations.length > 0) {
                    // this.getCoords(locations);
                    this.resetMap();
                }
                this.spinner.hide();
            })
    }

    async updateTrip() {
        this.hideErrors();
        if (this.tripData.reeferTemperature != '' && this.tripData.reeferTemperatureUnit != '') {
            this.tripData.reeferTemperature = this.tripData.reeferTemperature + this.tripData.reeferTemperatureUnit;
        } else {
            this.tripData.reeferTemperature = '';
        }

        this.tripData.orderId = this.OrderIDs;
        this.tripData.tripPlanning = [];
        this.tripData['tripID'] = this.route.snapshot.params['tripID'];
        this.tripData.dateCreated =  moment(this.dateCreated, 'YYYY-MM-DD hh:mm:ss').format('x');
        this.tripData.dateCreated = parseInt(this.tripData.dateCreated);
        let planData = this.trips;

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan.');
            return false;
        }

        if (planData.length < 2) {
            this.toastr.error('Please add atleast two trip plans.');
            return false;
        }

        if (planData.length >= 2) {
            let addedPlan = planData.map(function (v) { return v.type; });

            if (addedPlan.includes('Pickup') !== true || addedPlan.includes('Delivery') !== true) {
                this.toastr.error('Pickup and delivery points are required.');
                return false;
            }
        }
        let selectedDriverids = [];
        let selectedVehicles = [];
        let selectedLocations = '';
        let selectedAssets = [];

        for (let i = 0; i < planData.length; i++) {

            let obj = {
                type: '',
                // date: '',
                name: '',
                location: '',
                mileType: '',
                miles: '',
                vehicleID: '',
                vehicleName:'',
                assetID: [],
                driverUsername: '',
                codriverUsername: '',
                carrierID: '',
                // time: '',
                pickupTime: '',
                dropTime: '',
                actualPickupTime: '',
                actualDropTime: '',
                lat: '',
                lng: '',
                driverID: '',
                coDriverID: ''
            };
            const element = planData[i];

            obj.type = element.type;
            //   obj.date = element.date;
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
                }
            }

            if(element.coDriverID != '' && element.coDriverID != undefined) {
                if(!selectedDriverids.includes(element.coDriverID)) {
                    selectedDriverids.push(element.coDriverID);
                }
            }

            if(element.vehicleID != '' && element.vehicleID != undefined) {
                if(!selectedVehicles.includes(element.vehicleID)) {
                    selectedVehicles.push(element.vehicleID);
                }
            }
    
            if(element.locationName != '' && element.locationName != undefined) {
                element.locationName = element.locationName.replace(",", "");
                selectedLocations += element.locationName.toLowerCase() + '|';
            }

            this.tripData.tripPlanning.push(obj);
        }


        this.tripData.driverIDs = await selectedDriverids;
        this.tripData.vehicleIDs = await selectedVehicles;
        this.tripData.assetIDs = await selectedAssets;
        this.tripData.loc = await selectedLocations;

        // this.spinner.show();
        this.errors = {};
        this.hasError = false;
        this.hasSuccess = false;
        delete this.tripData.reeferTemperatureUnit;
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
                            this.spinner.hide();
                            this.throwErrors();
                        },
                        error: () => {
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.spinner.hide();
                this.response = res;
                this.updateOrderStatus();
                this.toastr.success('Trip updated successfully.');
                this.router.navigateByUrl('/dispatch/trips/trip-list');
            },
        });
    }

    getCurrentuser = async () => {
        this.currentUser = (await Auth.currentSession()).getIdToken().payload;
        this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }

    getCurrentDate() {
        let d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        this.dateCreated = year+'-'+month+'-'+day;
    }

    updateOrderStatus() {
        for (let i = 0; i < this.OrderIDs.length; i++) {
            const orderID = this.OrderIDs[i];

            this.apiService.getData('orders/' + orderID)
                .subscribe((result: any) => {
                    let orderData = result.Items[0];
                    if (orderData.orderStatus == 'confirmed') {
                        this.apiService.getData('orders/update/orderStatus/'+orderID+'/dispatched')
                            .subscribe((result: any) => {
                            });
                    }
                });
        }
    }

    updateOrderStatusToConfirmed() {
        for (let i = 0; i < this.OldOrderIDs.length; i++) {
            const orderID = this.OldOrderIDs[i];

            this.apiService.getData('orders/' + orderID)
                .subscribe((result: any) => {
                    let orderData = result.Items[0];
                    // if (orderData.orderStatus == 'confirmed') {
                        this.apiService.getData('orders/update/orderStatus/'+orderID+'/confirmed')
                            .subscribe((result: any) => {
                            });
                    // }
                });
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
        else{
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
                calcultedBy = element.milesInfo.calculateBy;
                totalMilesOrder += parseFloat(element.milesInfo.totalMiles);
                this.orderNo += element.orderNumber
                if(i < result.length-1){
                    this.orderNo = this.orderNo+', ';
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
}
