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
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {

  carriers = [];
  routes = [];
  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private hereMap: HereMapService) { }

  tripID = '';
  errors: {};
  trips = [];
  vehicles = [];
  assets = [];
  drivers = [];
  codrivers = [];
  tripData = {
    tripID: '',
    reeferTemperature: '',
    reeferTemperatureUnit: '',
    orderId: {},
    tripPlanning: [],
    notifications: {},
  };
  ltlOrders = [
    {
      orderId: '5',
      orderNumber: '11',
      customer: 'iLoadTrucking Ltd',
      pickupLocation: 'Regina Sk',
      deliveryLocation: 'Ontario',
      orderAmount: '2300',
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '6',
      orderNumber: '12',
      customer: 'samsara Ltd',
      pickupLocation: 'Regina Sk',
      deliveryLocation: 'Ontario',
      orderAmount: '2400',
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '7',
      orderNumber: '13',
      customer: 'fleet Ltd',
      pickupLocation: 'Montreal',
      deliveryLocation: 'Ontario',
      orderAmount: '2500',
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '8',
      orderNumber: '14',
      customer: 'iLoadTrucking Ltd',
      pickupLocation: 'Surrey',
      deliveryLocation: 'Ontario',
      orderAmount: '2300',
      status: 'unassigned',
      selected: false,
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
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '2',
      orderNumber: '22',
      customer: 'samsara Ltd',
      pickupLocation: 'Regina Sk',
      deliveryLocation: 'Ontario',
      orderAmount: '2400',
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '3',
      orderNumber: '23',
      customer: 'fleet Ltd',
      pickupLocation: 'Montreal',
      deliveryLocation: 'Ontario',
      orderAmount: '2500',
      status: 'unassigned',
      selected: false,
    },
    {
      orderId: '4',
      orderNumber: '24',
      customer: 'iLoadTrucking Ltd',
      pickupLocation: 'Surrey',
      deliveryLocation: 'Ontario',
      orderAmount: '2300',
      status: 'unassigned',
      selected: false,
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
    time: '',
    pickupTime: '',
    dropTime: '',
    actualPickupTime: '',
    actualDropTime: '',
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

  locationCityName = '';
  locationStateName = '';
  locationCountryName = '';
  locationDriverName = '';
  locationVehicleName = '';
  locationAssetName = '';
  allAssetName = '';
  OrderIdsSelected = [];

  assetDataVehicleID = '';
  assetDataDriverUsername = '';
  assetDataCoDriverUsername = '';
  informationAsset = [];

  ngOnInit() {

    this.tripID = this.route.snapshot.params['tripID'];
    this.fetchCarriers();
    this.fetchRoutes();
    this.mapShow();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchTripDetail();

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
      $('#assetModal').modal('show');
    }
  }

  // showAssetModal(type, index) {
  //   $("#driverSelect").val('');
  //   $("#coDriverSelect").val('');
  //   $("#vehicleSelect").val('');
  //   $('#driverSelect').children('option').show();
  //   $('#coDriverSelect').children('option').show();
  //   $('#informationAsset').children('option').show();
  //   this.selectedAssets = [];

  //   if (type === 'add') {
  //     this.tempTextFieldValues.type = 'add';
  //     this.tempTextFieldValues.index = '';
  //     $('#assetModal').modal('show');
  //   } else {
  //     this.tempTextFieldValues.type = 'edit';
  //     this.tempTextFieldValues.index = index;

  //     let editRowValues = this.trips[index];
  //     $("#vehicleSelect").val(editRowValues.vehicleID);
  //     // $("#informationAsset").val();
  //     // set selected asset values
  //     for (let i = 0; i < editRowValues.trailer.length; i++) {
  //       const element = editRowValues.trailer[i];
  //       $('#informationAsset').children("option[value^=" + element.id + "]").hide();
  //     }
  //     this.selectedAssets = editRowValues.trailer;

  //     $("#driverSelect").val(editRowValues.driverUsername);
  //     $("#coDriverSelect").val(editRowValues.coDriverUsername);
  //     $('#assetModal').modal('show');
  //   }
  // }

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
        // this.drivers = result.Items;
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

  updateTrip() {
    // console.log('tripData');
    if (this.tripData.reeferTemperature != '' && this.tripData.reeferTemperatureUnit != undefined) {
      this.tripData.reeferTemperature = this.tripData.reeferTemperature + this.tripData.reeferTemperatureUnit;
    } else {
      this.tripData.reeferTemperature = '';
    }

    delete this.tripData.reeferTemperatureUnit;
    this.tripData.orderId = this.OrderIDs;
    this.tripData.tripPlanning = [];
    this.tripData.tripID = this.route.snapshot.params['tripID'];

    // console.log(this.tripData);
    // console.log(this.OrderIDs);

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

    this.spinner.show();
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    // delete this.tripData.carrierID;
    console.log('this.tripData')
    console.log(this.tripData)
    this.apiService.putData('trips', this.tripData).subscribe({
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
        this.toastr.success('Trip updated successfully');
        // this.router.navigateByUrl('/dispatch/trips/trip-list');
      },
    });
  }

  fetchTripDetail() {
    this.spinner.show();
    this.apiService.getData('trips/' + this.tripID).
      subscribe((result: any) => {
        result = result.Items[0];
        this.tripData = result;
        // console.log('result');
        // console.log(result);
        let refTemp = this.tripData.reeferTemperature;
        let temp = refTemp.substring(0, refTemp.length - 1);
        let tempUnit = refTemp.substring(refTemp.length - 1, refTemp.length);

        this.tripData.reeferTemperature = temp;
        this.tripData.reeferTemperatureUnit = tempUnit;

        let tripPlanning = this.tripData.tripPlanning;
        if (result.orderId.length > 0) {
          // show order ids in trip plan dropdown
          for (let m = 0; m < result.orderId.length; m++) {
            const element = result.orderId[m];
            this.typeOptions.unshift(element);
          }
        }

        // checkbox checked of ftl orders
        for (let m = 0; m < this.ftlOrders.length; m++) {
          const element = this.ftlOrders[m];
          if (result.orderId.indexOf(element.orderNumber) !== -1) {
            this.ftlOrders[m].selected = true;
          } else{
            this.ftlOrders[m].selected = false;
          }
        }

        for (let m = 0; m < this.ltlOrders.length; m++) {
          const element = this.ltlOrders[m];
          if (result.orderId.indexOf(element.orderNumber) !== -1) {
            this.ltlOrders[m].selected = true;
          } else{
            this.ltlOrders[m].selected = false;
          }
        }

        for (let i = 0; i < tripPlanning.length; i++) {
          const element = tripPlanning[i];

          // this.fetchAssetDetail();

          let obj = {
            carrierID: element.carrierID,
            carrierName: "",
            coDriverName: "",
            coDriverUsername: element.codriverUsername,
            date: element.date,
            time: element.time,
            pickupTime: element.pickupTime,
            dropTime: element.dropTime,
            actualPickupTime: element.actualPickupTime,
            actualDropTime: element.actualDropTime,
            driverName: "",
            driverUsername: element.driverUsername,
            location: {
              countryID: element.location.countryID,
              cityID: element.location.cityID,
              cityName: '',
              countryName: '',
              locationName: '',
              stateID: element.location.stateID,
              stateName: '',
              zipcode: element.location.zipcode,
              address1: element.location.address1,
              address2: element.location.address2,
            },
            locationName: "",
            mileType: element.mileType,
            miles: element.miles,
            name: element.name,
            trailer: '',
            trailerName: "",
            type: element.type,
            vehicleID: element.vehicleID,
            vehicleName: ""
          };

          this.trips.push(obj);
          let assetName = '';

          let assetArr = [];
          for (let j = 0; j < element.assetID.length; j++) {
            const assetID = element.assetID[j];
            // let assetName = this.fetchAssetDetail(assetID,j);

            this.apiService.getData('assets/' + assetID)
              .subscribe((result: any) => {
                // console.log('========here');
                if (result.Items[0].assetIdentification != undefined) {
                  assetName = result.Items[0].assetIdentification;
                  // console.log('assetName', assetName)

                  let assObj = {
                    id: assetID,
                    name: assetName
                  }

                  this.allAssetName += assetName + ', ';
                  assetArr.push(assObj);
                  this.trips[i].trailerName = this.allAssetName;
                }
              })

            // console.log('========now here');
            this.trips[i].trailer = assetArr;
          }
          this.fetchVehicleDetail(element.vehicleID, i);
          this.fetchDriverDetail(element.driverUsername, 'driver', i);
          this.fetchDriverDetail(element.codriverUsername, 'codriver', i);
          this.fetchCountryName(element.location.countryID, i);
          this.fetchStateDetail(element.location.stateID, i);
          this.fetchCityDetail(element.location.cityID, i);
          this.fetchCarrierName(element.carrierID, i)
        }
        this.spinner.hide();
      })
  }

  fetchAssetDetail(assetID, index) {
    this.apiService.getData('assets/' + assetID)
      .subscribe((result: any) => {
        if (result.Items[0].assetIdentification != undefined) {
          return result.Items[0].assetIdentification;
        }
      })
  }

  fetchVehicleDetail(vehicleID, index) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].vehicleIdentification != undefined) {
          this.trips[index].vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchDriverDetail(driverUserName, type, index) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          if (type === 'driver') {
            this.trips[index].driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
          } else {
            this.trips[index].coDriverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
          }
        }
      })
  }

  fetchCountryName(countryID, index) {
    this.apiService.getData('countries/' + countryID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].countryName != undefined) {
          this.trips[index].location.countryName = result.Items[0].countryName;
        }
      })
  }

  fetchCarrierName(carrierID, index) {
    this.apiService.getData('carriers/' + carrierID)
      .subscribe((result: any) => {
        // console.log('carrier');
        // console.log(result.Items[0]);
        if (result.Items[0].businessDetail.carrierName != undefined) {
          this.trips[index].carrierName = result.Items[0].businessDetail.carrierName;
        }
      })
  }

  fetchStateDetail(stateID, index) {
    this.apiService.getData('states/' + stateID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].stateName != undefined) {
          this.trips[index].location.stateName = result.Items[0].stateName;
        }
      })
  }

  fetchCityDetail(cityID, index) {
    this.apiService.getData('cities/' + cityID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].cityName != undefined) {
          this.trips[index].location.cityName = result.Items[0].cityName;
          this.trips[index].locationName = this.trips[index].location.address1 + ', ' + this.trips[index].location.address2 + ', ' + this.trips[index].location.zipcode + ', ' + this.trips[index].location.cityName + ', ' + this.trips[index].location.stateName + ', ' + this.trips[index].location.countryName;
        }
      })
  }

  throwErrors() {
    // console.log(this.errors);
    this.form.showErrors(this.errors);
  }
}
