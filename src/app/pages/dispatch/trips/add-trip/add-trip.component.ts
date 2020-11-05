import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
declare var $: any;

@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
    styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

    carriers = [];
    routes = [];
    constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

    errors: {};
    trips = [];
    vehicles = [];
    assets = [];
    drivers = [];
    codrivers = [];
    tripData = {
        reeferTemperature: '',
        reeferTemperatureUnit: '',
        orderId: {},
        tripPlanning: [],
        notifications: {},
        tripStatus: 'pending'
    };
    ltlOrders = [
        {
            orderId: '5',
            orderNumber: '11',
            customer: 'iLoadTrucking Ltd',
            pickupLocation: 'Regina Sk',
            deliveryLocation: 'Ontario',
            orderAmount: '2300',
            status: 'unassigned'
        },
        {
            orderId: '6',
            orderNumber: '12',
            customer: 'samsara Ltd',
            pickupLocation: 'Regina Sk',
            deliveryLocation: 'Ontario',
            orderAmount: '2400',
            status: 'unassigned'
        },
        {
            orderId: '7',
            orderNumber: '13',
            customer: 'fleet Ltd',
            pickupLocation: 'Montreal',
            deliveryLocation: 'Ontario',
            orderAmount: '2500',
            status: 'unassigned'
        },
        {
            orderId: '8',
            orderNumber: '14',
            customer: 'iLoadTrucking Ltd',
            pickupLocation: 'Surrey',
            deliveryLocation: 'Ontario',
            orderAmount: '2300',
            status: 'unassigned'
        },
    ];

    ftlOrders = [
        {
            orderId: '1',
            orderNumber: '21',
            customer: 'iLoadTrucking Ltd',
            pickupLocation: 'Regina Sk',
            deliveryLocation: 'Ontario',
            orderAmount: '2300',
            status: 'unassigned'
        },
        {
            orderId: '2',
            orderNumber: '22',
            customer: 'samsara Ltd',
            pickupLocation: 'Regina Sk',
            deliveryLocation: 'Ontario',
            orderAmount: '2400',
            status: 'unassigned'
        },
        {
            orderId: '3',
            orderNumber: '23',
            customer: 'fleet Ltd',
            pickupLocation: 'Montreal',
            deliveryLocation: 'Ontario',
            orderAmount: '2500',
            status: 'unassigned'
        },
        {
            orderId: '4',
            orderNumber: '24',
            customer: 'iLoadTrucking Ltd',
            pickupLocation: 'Surrey',
            deliveryLocation: 'Ontario',
            orderAmount: '2300',
            status: 'unassigned'
        },
    ];

    selectedAssets = [];
    form;
    OrderIDs = [];
    temporaryOrderIDs = [];
    typeOptions = ['Pickup', 'Delivery', 'Yard', 'Stop'];
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
        miles: '',
        vehicleName: '',
        vehicleID: '',
        driverName: '',
        driverUsername: '',
        coDriverName: '',
        coDriverUsername: '',
        carrierName: '',
        carrierID: '',
        trailer: {},
        trailerName: ''
    };
    tempTextFieldValues: any = {
        trailer: []
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

    ngOnInit() {

        this.fetchCarriers();
        this.fetchRoutes();
        this.mapShow();
        this.fetchVehicles();
        this.fetchAssets();
        this.fetchDrivers();
        this.fetchCountries();

        var current = this;
        $(document).ready(() => {
            this.form = $('#form_').validate();
        });

        $('#locationCountry').on('change', function () {
            var curr = $(this);
            var countryId = curr.val();
            current.getStates(countryId);
        })

        $('#locationState').on('change', function () {
            let curr = $(this);
            let stateId = curr.val();
            current.getCities(stateId);
        })
    }

    fetchCarriers() {
        this.apiService.getData('carriers')
            .subscribe((result: any) => {
                this.carriers = result.Items;
                // console.log(this.carriers);
            })
    }

    drop(event: CdkDragDrop<string[]>) {
        this.ArrayShuffle(this.trips, event.previousIndex, event.currentIndex);
        moveItemInArray(this.trips, event.previousIndex, event.currentIndex);
    }

    async ArrayShuffle(array, previousIndex, currentIndex) {
        var prevValOnIndex = array[previousIndex];
        var newArr = [];
        var j = 0;
        for (const i of array) {
            if ((currentIndex) === j) {
                await newArr.push(prevValOnIndex)
                j = j + 1;
            } else {
                await newArr.push(array[j]);
                j = j + 1;
            }
            // console.log(newArr);
            if (i == array.length - 1) {
                this.trips = newArr;
                // console.log(this.trips);
            }
        }
    }

    addRow() {
        if (this.textFieldValues.type !== '' && this.textFieldValues.date !== '' && this.textFieldValues.name !== ''
            && this.textFieldValues.mileType !== '' && this.textFieldValues.miles !== '' && this.textFieldValues.locationName !== '') {

            this.textFieldValues.time = $("#cell12").val();
            this.textFieldValues.pickupTime = $("#cell13").val();
            this.textFieldValues.dropTime = $("#cell14").val();
            this.textFieldValues.actualPickupTime = $("#cell15").val();
            this.textFieldValues.actualDropTime = $("#cell16").val();

            this.trips.push(this.textFieldValues);
            // console.log('this.trips');
            // console.log(this.trips)
            // this.textFieldValues = {};

            this.textFieldValues = {
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
                miles: '',
                vehicleName: '',
                vehicleID: '',
                driverName: '',
                driverUsername: '',
                coDriverName: '',
                coDriverUsername: '',
                carrierName: '',
                carrierID: '',
                trailer: {},
                trailerName: ''
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
        } else {
            this.toastr.error('Please fill all the fields to add trip');
            return false;
        }
    }

    delRow(index) {
        this.trips.splice(index, 1);
        if(this.trips.length > 0){
            let dataCheck = this.trips.map(function(v){ return v.vehicleID; });

            if(dataCheck.length > 0){
                this.tripData.tripStatus = 'planned';
            } else{
                this.tripData.tripStatus = 'pending';
            }
        } else {
            this.tripData.tripStatus = 'pending';
        }
    }

    emptyAssetModalFields(){
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
        $(".labelRow" + index).css('display', 'none');
        $('.editRow' + index).removeClass('rowStatus');
        this.spinner.hide();
    }

    editRow(index) {
        this.trips[index].type = $('#editCell1' + index).val();
        this.trips[index].date = $('#editCell2' + index).val();
        this.trips[index].name = $('#editCell3' + index).val();
        this.trips[index].mileType = $('#editCell5' + index).val();
        this.trips[index].miles = $('#editCell6' + index).val();
        this.trips[index].carrierID = $('#editCell11' + index + ' option:selected').val();
        this.trips[index].carrierName = $('#editCell11' + index + ' option:selected').text();
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
                // console.log(result);
                for (let i = 0; i < result.Items.length; i++) {
                    if (result.Items[i].isDeleted == '0') {
                        this.routes.push(result.Items[i])
                    }
                }
                // this.routes = result.Items;
                // console.log(this.routes);
            }
        })
    }

    mapShow() {
        this.hereMap.mapInit();
    }

    showMOdal() {
        $("#orderModal").modal('show');
    }

    showAssetModal(type, index) {
        
        if (type === 'add') {
            this.tempTextFieldValues.type = 'add';
            this.tempTextFieldValues.index = '';
            $('#assetModal').modal('show');
        } else {
            this.tempTextFieldValues.type = 'edit';
            this.tempTextFieldValues.index = index;

            let editRowValues = this.trips[index];
            console.log('editRowValues');
            console.log(editRowValues)

            this.assetDataVehicleID  = editRowValues.vehicleID;
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

            $("#veh_"+editRowValues.vehicleID).addClass('td_border');
            $("#drivr_"+editRowValues.driverUsername).addClass('td_border');
            $("#codrivr_"+editRowValues.coDriverUsername).addClass('td_border');

            // set selected asset values
            if(editRowValues.trailer != undefined){
                for (let i = 0; i < editRowValues.trailer.length; i++) {
                    const element = editRowValues.trailer[i];
                    this.informationAsset.push(element.id);
    
                    let objj = {
                        id: element.id,
                        name: element.name
                    }
                    this.tempTextFieldValues.trailer.push(objj);
                    $("#asset_"+element.id).addClass('td_border');
                }
            }
            
            $('#assetModal').modal('show');
        }
    }

    showlocationModal(type, index: any) {
        if (type === 'add') {
            this.tempLocation.type = 'add';
            this.tempLocation.index = '';
            $("#locationModal").modal('show');
        } else {
            this.spinner.show();
            this.tempLocation.type = 'edit';
            this.tempLocation.index = index;
            let editRowValues = this.trips[index];

            this.getStates(editRowValues.location.countryID);
            this.getCities(editRowValues.location.stateID);

            // set values in modal
            $("#locationCountry").val(editRowValues.location.countryID);
            this.selectedLocationStateId = editRowValues.location.stateID;
            this.selectedLocationCityId = editRowValues.location.cityID;

            $("#locationAddress1").val(editRowValues.location.address1);
            $("#locationAddress2").val(editRowValues.location.address2);
            $("#locationZipcode").val(editRowValues.location.zipcode);
            $("#locationModal").modal('show');
            this.spinner.hide();
        }
    }

    initDataTable() {

        this.ftlOptions = { // All list options
            pageLength: 10,
            processing: true,
            dom: 'Bfrtip',
            colReorder: true,
        };

        this.ltlOptions = { // All list options
            pageLength: 10,
            processing: true,
            dom: 'Bfrtip',
            colReorder: true,
        };
    }

    selectOrderIDS(type) {
        // console.log(type)
        this.temporaryOrderIDs = [];
        let current = this;
        if (type === 'ftl') {
            $('input[name="ltlOrderIds"]').prop('checked', false);
            $('input[name="checkUncheckltl"]').prop('checked', false);
            $('input[name="ftlOrderIds"]:checked').each(function () {
                $('input[name="checkUncheckftl"]').prop('checked', true);
                current.temporaryOrderIDs.push(this.value);
                // console.log('this.OrderIDs');
                // console.log(current.temporaryOrderIDs)
            });
        } else if (type === 'ltl') {
            $('input[name="ftlOrderIds"]').prop('checked', false);
            $('input[name="checkUncheckftl"]').prop('checked', false);
            $('input[name="ltlOrderIds"]:checked').each(function () {
                $('input[name="checkUncheckltl"]').prop('checked', true);
                current.temporaryOrderIDs.push(this.value);
                // console.log('this.OrderIDs');
                // console.log(current.temporaryOrderIDs)
            });
        }
    }

    saveSelectOrderIDS() {
        this.typeOptions = ['Pickup', 'Delivery', 'Yard', 'Stop'];
        this.OrderIDs = this.temporaryOrderIDs;
        $("#orderModal").modal('hide');
        this.typeOptions = this.OrderIDs.concat(this.typeOptions);
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
                    current.temporaryOrderIDs.push(this.value);
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
                    // console.log(this.value);
                    $(this).prop('checked', true);
                    current.temporaryOrderIDs.push(this.value);
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
                console.log('this.drivers');
                console.log(this.drivers);
                this.codrivers = result.Items;
            })
    }

    fetchCoDriver(driverID) {
        this.apiService.getData('drivers')
            .subscribe((result: any) => {
                // this.spinner.show();
                this.assetDataCoDriverUsername = ''; //reset the codriver selected
                let newDrivers = [];
                let allDrivers = result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
                for (let i = 0; i < allDrivers.length; i++) {
                    const element = allDrivers[i];
                    if (element.driverID !== driverID) {
                        newDrivers.push(element);
                    }
                }
                this.codrivers = newDrivers;
                // this.spinner.hide();
            })
    }

    saveAssetModalData() {
        if(this.tempTextFieldValues.coDriverUsername === '' || this.tempTextFieldValues.driverUsername === '' || 
        this.tempTextFieldValues.vehicleID === '' || this.tempTextFieldValues.trailer.length === 0) {

            this.toastr.error('Please select all the assignment values');
            return false;
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

            this.tripData.tripStatus = 'planned';
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
            this.tripData.tripStatus = 'planned';

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
        // console.log(this.textFieldValues);
    }

    fetchCountries() {
        this.apiService.getData('countries')
            .subscribe((result: any) => {
                this.countries = result.Items;
                // console.log('this.countries')
                // console.log(this.countries)
            });
    }

    getStates(countryID) {
        this.spinner.show();
        this.apiService.getData('states/country/' + countryID)
            .subscribe((result: any) => {
                this.states = result.Items;
                this.spinner.hide();
                // console.log('this.states', result.Items)
            });
    }

    getCities(stateID) {
        this.spinner.show();
        this.apiService.getData('cities/state/' + stateID)
            .subscribe((result: any) => {
                this.cities = result.Items;
                this.spinner.hide();
                // console.log('this.states', result.Items)
            });
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
            } else {
                $(".codriverClass").removeClass('td_border');
                this.tempTextFieldValues.coDriverName = '';
                this.tempTextFieldValues.coDriverUsername = '';
                this.assetDataCoDriverUsername = '';
            }
        } else {
            if (type === 'driver') {
                // alert('here')
                await this.spinner.show();
                this.assetDataCoDriverUsername = ''; //reset the codriver selected
                await this.fetchCoDriver($event.driverID);
                this.tempTextFieldValues.driverName = $event.fullName;
                this.tempTextFieldValues.driverUsername = $event.userName;
                this.assetDataCoDriverUsername = '';
                if (eventType === 'click') {
                    this.assetDataDriverUsername = $event.userName;
                }
                $(".driverClass").removeClass('td_border');
                $("#drivr_" + $event.userName).addClass('td_border');

                await this.spinner.hide();

            } else if (type === 'codriver') {
                this.tempTextFieldValues.coDriverName = $event.fullName;
                this.tempTextFieldValues.coDriverUsername = $event.userName;
                if (eventType === 'click') {
                    this.assetDataCoDriverUsername = $event.userName;
                }
                $(".codriverClass").removeClass('td_border');
                $("#codrivr_" + $event.userName).addClass('td_border');
            }
        }
    }

    assetsChange($event, type) {
        if ($event === undefined) {
            $(".assetClass").removeClass('td_border');
        } else {
            if (type === 'change') {
                console.log('asset change $event');
                this.tempTextFieldValues.trailer = [];
                console.log(this.informationAsset);

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

    saveLocation() {
        this.tempLocation.countryID = $("#locationCountry option:selected").val();
        this.tempLocation.countryName = $("#locationCountry option:selected").text();
        this.tempLocation.stateID = $("#locationState option:selected").val();
        this.tempLocation.stateName = $("#locationState option:selected").text();
        this.tempLocation.cityID = $("#locationCity option:selected").val();
        this.tempLocation.cityName = $("#locationCity option:selected").text();
        this.tempLocation.address1 = $("#locationAddress1").val();
        this.tempLocation.address2 = $("#locationAddress2").val();
        this.tempLocation.zipcode = $("#locationZipcode").val();

        if(this.tempLocation.countryID === '' || this.tempLocation.stateID === '' || this.tempLocation.cityID === '' 
            || this.tempLocation.address1 === '' || this.tempLocation.zipcode === ''){

            this.toastr.error('All fields are required to add location');
            return false;
        }

        let locationName = this.tempLocation.address1 + ', ';
        if (this.tempLocation.address2 != '' && this.tempLocation.address2 != undefined) {
            locationName += this.tempLocation.address2 + ', ';
        }
        locationName += this.tempLocation.zipcode + ', ' + this.tempLocation.cityName + ', ' + this.tempLocation.stateName + ', ' + this.tempLocation.countryName;
        this.tempLocation.locationName = locationName;

        if (this.tempLocation.type === 'add') {
            this.textFieldValues.location = this.tempLocation;
            this.textFieldValues.locationName = this.tempLocation.locationName;
            console.log('this.textFieldValues in location');
            console.log(this.textFieldValues);
            $("#locationModal").modal('hide');

        } else if (this.tempLocation.type === 'edit') {
            // if location is edited
            let index = this.tempLocation.index;
            this.trips[index].location = this.tempLocation;
            this.trips[index].locationName = this.tempLocation.locationName;

            // console.log('new location');
            // console.log(this.trips[index]);
            $("#locationModal").modal('hide');
        }

        this.tempLocation = {
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
    }

    createTrip() {
        console.log('start tripData');
        console.log(this.tripData);
        if (this.tripData.reeferTemperature != '') {
            this.tripData.reeferTemperature = this.tripData.reeferTemperature + this.tripData.reeferTemperatureUnit;
        } else {
            this.tripData.reeferTemperature = '';
        }

        delete this.tripData.reeferTemperatureUnit;
        this.tripData.orderId = this.OrderIDs;
        this.tripData.tripPlanning = [];
        let planData = this.trips;

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan');
            return false;
        }

        if (planData.length < 2) {
            this.toastr.error('Please add atleast two trip plans');
            return false;
        }
       
        if (planData.length >= 2) {
            let addedPlan = planData.map(function(v){ return v.type; });

            if(addedPlan.includes('Pickup') !== true || addedPlan.includes('Delivery') !== true){
                this.toastr.error('Pickup and delivery points are required');
                return false;
            }
            
            for (let i = 0; i < planData.length; i++) {

                let obj = {
                    type: '',
                    date: '',
                    name: '',
                    location: {},
                    mileType: '',
                    miles: '',
                    vehicleID: '',
                    assetID: [],
                    driverUsername: '',
                    codriverUsername: '',
                    carrierID: '',
                    time: '',
                    pickupTime: '',
                    dropTime: '',
                    actualPickupTime: '',
                    actualDropTime: ''
                };
                const element = planData[i];

                obj.type = element.type;
                obj.date = element.date;
                obj.name = element.name;
                obj.location = {
                    countryID: element.location.countryID,
                    stateID: element.location.stateID,
                    cityID: element.location.cityID,
                    address1: element.location.address1,
                    address2: element.location.address2,
                    zipcode: element.location.zipcode,
                },
                    obj.mileType = element.mileType;
                obj.miles = element.miles;
                obj.vehicleID = element.vehicleID;

                obj.time = element.time;
                obj.pickupTime = element.pickupTime;
                obj.dropTime = element.dropTime;
                obj.actualPickupTime = element.actualPickupTime;
                obj.actualDropTime = element.actualDropTime;

                if(element.trailer != '' && element.trailer != undefined) {
                    for (let j = 0; j < element.trailer.length; j++) {
                        const element1 = element.trailer[j];
                        obj.assetID.push(element1.id);
                    }
                }
                
                // obj.assetID = element.trailer;

                obj.driverUsername = element.driverUsername;
                obj.codriverUsername = element.coDriverUsername;
                obj.carrierID = element.carrierID;

                this.tripData.tripPlanning.push(obj);
            }
        }
        // console.log('end data');
        // console.log(this.tripData);

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
                            const path = val.path;
                            // We Can Use This Method
                            const key = val.message.match(/"([^']+)"/)[1];
                            // console.log(key);
                            val.message = val.message.replace(/".*"/, 'This Field');
                            this.errors[key] = val.message;
                            this.spinner.hide();
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
                this.toastr.success('Trip added successfully');
                this.router.navigateByUrl('/dispatch/trips/trip-list');
            },
        });
    }

    throwErrors() {
        console.log(this.errors);
        this.form.showErrors(this.errors);
        this.spinner.hide();
    }
}
