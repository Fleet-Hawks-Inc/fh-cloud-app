import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from '../../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
// import { v4 as uuidv4 } from 'uuid';
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
    tripData = {
        reeferTemperature: '',
        reeferTemperatureUnit: '',
        orderId: {},
        tripPlanning: [],
        notifications: {}
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
        trailer: {}
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

        $(document).on('change', '#informationAsset', function () {
            let selected = $("#informationAsset option:selected");
            if(selected.val() !== ''){
                let objj = {
                    id: selected.val(),
                    name: selected.text()
                }
                console.log('objj');
                console.log(objj);
                current.selectedAssets.push(objj);
                selected.hide();
                $('#informationAsset').val('');
                current.saveSelectedAssets();
            }
        })

        $(document).on('change', '#driverSelect', function () {
            let selected = $("#driverSelect option:selected");
            $('#coDriverSelect').children('option').show();
            $('#coDriverSelect').children('option[value^=' + selected.val() + ']').hide();
            current.tempTextFieldValues.driverName = selected.text();
            current.tempTextFieldValues.driverUsername = selected.val();
        })

        $(document).on('change', '#coDriverSelect', function () {
            let selected = $("#coDriverSelect option:selected");
            $('#driverSelect').children('option').show();
            $('#driverSelect').children('option[value^=' + selected.val() + ']').hide();
            current.tempTextFieldValues.coDriverName = selected.text();
            current.tempTextFieldValues.coDriverUsername = selected.val();
        })

        $(document).on('change', '#vehicleSelect', function () {
            let selected = $("#vehicleSelect option:selected");
            current.tempTextFieldValues.vehicleName = selected.text();
            current.tempTextFieldValues.vehicleID = selected.val();
        })

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
        if (this.textFieldValues.type != '' && this.textFieldValues.date != '' && this.textFieldValues.name != ''
            && this.textFieldValues.mileType != '' && this.textFieldValues.miles != '' && this.textFieldValues.vehicleName != ''
            && this.textFieldValues.driverName != '' && this.textFieldValues.carrierName != '' && this.textFieldValues.trailerName != ''
            && this.textFieldValues.locationName != '') {
        this.trips.push(this.textFieldValues);
        this.textFieldValues = {};
        $('.newRow').val('');

        $("#driverSelect").val('');
        $("#coDriverSelect").val('');
        $("#vehicleSelect").val('');
        $('#driverSelect').children('option').show();
        $('#coDriverSelect').children('option').show();
        $('#informationAsset').children('option').show();

        // location modal
        $("#locationAddress1").val('');
        $("#locationAddress2").val('');
        $("#locationZipcode").val('');
        $("#locationCountry").val('');
        this.states = [];
        this.cities = [];
        this.selectedAssets = [];

        // console.log('this.trips');
        // console.log(this.trips);
        } else {
            this.toastr.error('Please fill all the fields to add trip');
            return false;
        }
    }

    delRow(index) {
        this.trips.splice(index, 1);
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
        $("#driverSelect").val('');
        $("#coDriverSelect").val('');
        $("#vehicleSelect").val('');
        $('#driverSelect').children('option').show();
        $('#coDriverSelect').children('option').show();
        $('#informationAsset').children('option').show();
        this.selectedAssets = [];

        if (type === 'add') {
            this.tempTextFieldValues.type = 'add';
            this.tempTextFieldValues.index = '';
            $('#assetModal').modal('show');
        } else {
            this.tempTextFieldValues.type = 'edit';
            this.tempTextFieldValues.index = index;

            let editRowValues = this.trips[index];
            $("#vehicleSelect").val(editRowValues.vehicleID);
            // $("#informationAsset").val();
            // set selected asset values
            for (let i = 0; i < editRowValues.trailer.length; i++) {
                const element = editRowValues.trailer[i];
                $('#informationAsset').children("option[value^=" + element.id + "]").hide();
            }
            this.selectedAssets = editRowValues.trailer;

            $("#driverSelect").val(editRowValues.driverUsername);
            $("#coDriverSelect").val(editRowValues.coDriverUsername);
            $('#assetModal').modal('show');
        }
    }

    showlocationModal(type, index: any) {
        if (type === 'add') {
            this.tempLocation.type = 'add';
            this.tempLocation.index = '';
            $("#locationModal").modal('show');
        } else {
            // alert('loc '+index);
            this.spinner.show();
            this.tempLocation.type = 'edit';
            this.tempLocation.index = index;
            let editRowValues = this.trips[index];
            console.log('edit loc val');
            console.log(editRowValues);

            this.getStates(editRowValues.location.countryID);
            this.getCities(editRowValues.location.stateID);

            // set values in modal
            $("#locationCountry").val(editRowValues.location.countryID);
            // this.selectedLocationCountryId = editRowValues.location.countryID;
            this.selectedLocationStateId = editRowValues.location.stateID;
            this.selectedLocationCityId = editRowValues.location.cityID;

            $("#locationAddress1").val(editRowValues.location.address1);
            $("#locationAddress2").val(editRowValues.location.address2);
            $("#locationZipcode").val(editRowValues.location.zipcode);
            // this.selectedLocationAddress1 = editRowValues.location.address1;
            // this.selectedLocationAddress2 = editRowValues.location.address2;
            // this.selectedLocationAddress3 = editRowValues.location.zipcode;
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
                this.drivers = result.Items;
            })
    }

    removeSelectedAsset(index, assetID) {
        this.selectedAssets.splice(index, 1);
        $('#informationAsset').children("option[value^=" + assetID + "]").show();
        this.saveSelectedAssets();
    }

    saveSelectedAssets() {
        this.tempTextFieldValues.trailer = [];
        for (let i = 0; i < this.selectedAssets.length; i++) {
            const element = this.selectedAssets[i];
            this.tempTextFieldValues.trailer.push(element);
        }
        let trailerNames = this.tempTextFieldValues.trailer.map(function (v) { return v.name; });
        trailerNames = trailerNames.join();
        this.tempTextFieldValues.trailerName = trailerNames;
        // console.log(this.tempTextFieldValues);
    }

    saveAssetModalData() {
        if (this.tempTextFieldValues.type === 'add') {
            this.textFieldValues.vehicleName = this.tempTextFieldValues.vehicleName;
            this.textFieldValues.vehicleID = this.tempTextFieldValues.vehicleID;
            this.textFieldValues.trailer = this.tempTextFieldValues.trailer;
            this.textFieldValues.driverName = this.tempTextFieldValues.driverName;
            this.textFieldValues.driverUsername = this.tempTextFieldValues.driverUsername;
            this.textFieldValues.coDriverName = this.tempTextFieldValues.coDriverName;
            this.textFieldValues.coDriverUsername = this.tempTextFieldValues.coDriverUsername;
            this.textFieldValues.trailerName = this.tempTextFieldValues.trailerName;
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

        let locationName = this.tempLocation.address1 + ', ';
        if (this.tempLocation.address2 != '' && this.tempLocation.address2 != undefined) {
            locationName += this.tempLocation.address2 + ', ';
        }
        locationName += this.tempLocation.zipcode + ', ' + this.tempLocation.cityName + ', ' + this.tempLocation.stateName + ', ' + this.tempLocation.countryName;
        this.tempLocation.locationName = locationName;

        if (this.tempLocation.type === 'add') {
            this.textFieldValues.location = this.tempLocation;
            this.textFieldValues.locationName = this.tempLocation.locationName;
            // console.log('this.textFieldValues');
            // console.log(this.textFieldValues);
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

        console.log(this.tripData);
        console.log(this.OrderIDs);

        let planData = this.trips;

        if (planData.length == 0) {
            this.toastr.error('Please add trip plan');
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
                carrierID: ''
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

            for (let j = 0; j < element.trailer.length; j++) {
                const element1 = element.trailer[j];
                obj.assetID.push(element1.id);
            }
            // obj.assetID = element.trailer;

            obj.driverUsername = element.driverUsername;
            obj.codriverUsername = element.coDriverUsername;
            obj.carrierID = element.carrierID;

            this.tripData.tripPlanning.push(obj);
        }
        console.log('end data');
        console.log(this.tripData);
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
        // console.log(this.errors);
        this.form.showErrors(this.errors);
    }
}
