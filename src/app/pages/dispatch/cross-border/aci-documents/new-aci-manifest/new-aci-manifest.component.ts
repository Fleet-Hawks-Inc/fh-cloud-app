
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { from, Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ListService } from '../../../../../services';
import { HereMapService } from '../../../../../services';

declare var $: any;
@Component({
  selector: 'app-new-aci-manifest',
  templateUrl: './new-aci-manifest.component.html',
  styleUrls: ['./new-aci-manifest.component.css'],
  providers: [],
})
export class NewAciManifestComponent implements OnInit {
  public entryID;
  title = 'Add ACI e-Manifest';
  modalTitle = 'Add';
  public searchTerm = new Subject<string>();
  public searchResults: any;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  carriers = [];
  timeCreated: string;
  countries: any = [];
  stateID: string;
  states: any = [];
  cities: any = [];
  CANPorts: any = [];
  vehicles: any = [];
  vehicleData: any = [];
  loadingCities: any = [];
  acceptanceCities: any = [];
  assets: any = [];
  drivers: any = [];
  mainDriver = '';
  coDrivers = [];
  shippers: any = [];
  consignees: any = [];
  ACIReleaseOfficeList: any = [];
  timeList: any = [];
  cityList: any = [];
  modalStates: any = [];
  modalCities: any = [];
  subLocationsList: any = [];
  cargoExemptionsList: any = [];
  documentTypeList: any = [];
  amendmentReasonsList: any = [];
  amendTripReason = '';
  countriesList: any = [];
  currentStatus: string;
  getcurrentDate: any;
  birthDateMinLimit: any;
  CCC: string;
  addTrailerBtn = true;
  data: string;
  sendId: string;
  tripNumber: string;
  portOfEntry: string;
  subLocation: string;
  estimatedArrivalDate: '';
  estimatedArrivalTime: '';
  estimatedArrivalTimeZone: '';
  estimatedArrivalDateTime: string;
  addTruckSealBtn = true;
  fetchedCoDrivers=[];
  truck = {
    truckID: '',
    sealNumbers: [
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
    ],
    cargoExemptions: [],
  };
  driverArray = [];
  trailers = [
    {
      assetID: '',
      assetTypeCode: '',
      sealNumbers: [
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
      ],
      cargoExemptions: [],
    },
  ];
  passengers = [];
  addedPassengers = [];
  containers = [];
  addedContainers = [];
  passengerDocStates: any = [];
  shipments = [
    {
      shipmentType: '',
      loadedOn: {
        type: '',
        number: '',
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: false,
      portOfEntry: '',
      releaseOffice: '',
      subLocation: '',
      importerCsaBusinessNumber: '',
      uniqueConsignmentReferenceNumber: '',
      estimatedArrivalDate: '',
      estimatedArrivalTime: '',
      estimatedArrivalTimeZone: '',
      cityOfLoading: {
        cityName: '',
        stateProvince: '',
      },
      cityOfAcceptance: {
        cityName: '',
        stateProvince: '',
      },
      consolidatedFreight: false,
      specialInstructions: '',
      shipperID: '',
      consigneeID: '',
      deliveryDestinations: [{
        name: '',
        contactNumber: '',
        address: {
          countryID: '',
          countryName: '',
          countryCode: '',
          stateID: '',
          stateName: '',
          stateCode: '',
          cityID: '',
          cityName: '',
          postalCode: '',
          addressLine: '',
          geoCords: {
            lat: '',
            lng: ''
          },
          manual: false,
          userLocation: ''
        }
      }],
      notifyParties: [
        {
          name: '',
          contactNumber: '',
          address: {
            countryID: '',
            countryName: '',
            countryCode: '',
            stateID: '',
            stateName: '',
            stateCode: '',
            cityID: '',
            cityName: '',
            postalCode: '',
            addressLine: '',
            geoCords: {
              lat: '',
              lng: ''
            },
            manual: false,
            userLocation: ''
          }
        }
      ],
      commodities: [
        {
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            handlingInstructions: '',
          },
        },
      ],
    },
  ];
  borderAssetTypes = [];
  packagingUnitsList: any = [];
  loadedType = 'TRAILER';
  containerLoaded = 'TRAILER';
  shipmentTypeList: any = [];
  CCCShipment: string;
  cargoControlNumberInput: string;
  amendManifest = false;
  errorFastCard = false;
  constructor(
    private httpClient: HttpClient,
    private HereMap: HereMapService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private listService: ListService,
    private apiService: ApiService,
    private location: Location,
    config: NgbTimepickerConfig,
    private dateAdapter: NgbDateAdapter<string>
  ) {
    config.seconds = true;
    config.spinners = true;
    const date = new Date();
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    this.birthDateMinLimit = { year: date.getFullYear() - 60, month: date.getMonth() + 1, day: date.getDate() };

  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    if (this.entryID) {
      this.title = 'Edit ACI e-Manifest';
      this.modalTitle = 'Edit';
      this.fetchACIEntry();
      this.route.queryParams.subscribe((params) => {
        if (params.amendManifest !== undefined) {
          this.amendManifest = params.amendManifest; // to get query parameter amend
        }
      });
    } else {
      this.title = 'Add ACI e-Manifest';
      this.modalTitle = 'Add';
    }
    this.searchLocation();
    this.listService.fetchStates();
    this.listService.fetchCities();
    this.listService.fetchShippers();
    this.listService.fetchReceivers();
    this.shippers = this.listService.shipperList;
    this.consignees = this.listService.receiverList;
    this.modalStates = this.listService.stateList;
    this.modalCities = this.listService.cityList;
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchUSStates();
    // this.fetchCities();
    this.fetchCarrier();
    this.httpClient.get('assets/canadianPorts.json').subscribe((data) => {
      this.CANPorts = data;
    });
    this.httpClient
      .get('assets/jsonFiles/ACIpackagingUnit.json')
      .subscribe((data) => {
        this.packagingUnitsList = data;
      });
    this.httpClient.get('assets/travelDocumentType.json').subscribe((data) => {
      this.documentTypeList = data;
    });
    this.httpClient
      .get('assets/jsonFiles/ACIShipmentType.json')
      .subscribe((data) => {
        this.shipmentTypeList = data;
      });
    this.httpClient
      .get('assets/jsonFiles/ACI-amendment-reason-codes.json')
      .subscribe((data) => {
        this.amendmentReasonsList = data;
      });
    this.httpClient.get('assets/ACIReleaseOffice.json').subscribe((data) => {
      this.ACIReleaseOfficeList = data;
    });
    this.httpClient.get('assets/manifestETA.json').subscribe((data) => {
      this.timeList = data;
    });
    this.httpClient.get('assets/ACIsubLocations.json').subscribe((data) => {
      this.subLocationsList = data;
    });
    this.httpClient.get('assets/ACIcargoExemption.json').subscribe((data) => {
      this.cargoExemptionsList = data;
    });
    this.httpClient
      .get('assets/jsonFiles/worldCountries.json')
      .subscribe((data) => {
        this.countriesList = data;
      });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }


  fixCoDrivers(){
    if(this.mainDriver){
      let currentDriver =this.mainDriver;
      this.fetchedCoDrivers=this.drivers.filter(function(value, index, arr){ 
        return value.driverID !=currentDriver;
    });
    }
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  fetchUSStates() {
    this.apiService.getData('states/getUSStates').subscribe((result: any) => {
      this.states = result.Items;
    });
  }
  fetchCarrier() {
    this.apiService.getData('carriers/getCarrier').subscribe((result: any) => {
      this.carriers = result.Items;
    });
  }
  savePassengers() {
    this.addedPassengers = this.passengers;
  }
  saveContainers() {
    this.addedContainers = this.containers;
  }
  getLoadingCities(s) {
    const stateID = this.shipments[s].cityOfLoading.stateProvince;
    this.apiService
      .getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.loadingCities = result.Items;
      });
  }
  getAcceptanceCities(s) {
    const stateID = this.shipments[s].cityOfAcceptance.stateProvince;
    this.apiService
      .getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.acceptanceCities = result.Items;
      });
  }
  fetchCities() {
    this.apiService.getData('cities').subscribe((result: any) => {
      this.acceptanceCities = result.Items;
      this.loadingCities = result.Items;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  // TRUCK DATA
  addTruckSeal() {
    this.truck.sealNumbers.push({ sealNumber: '' });
    if (this.truck.sealNumbers.length <= 19) {
      this.addTruckSealBtn = true;
    } else {
      this.addTruckSealBtn = false;
    }
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }
  /***
    * fetch asset types from mapped table
    */
  async getBorderAssetTypes(e) {
    const assetID = e;
    let fetchedAsset = await this.apiService.getData('assets/' + assetID).toPromise();
    let resultData = await this.apiService.getData('borderAssetTypes/' + fetchedAsset.Items[0].assetDetails.assetType).toPromise(); // border aset types are fetched whose parent is asset type of selected asset
    if (resultData.Items.length > 0) {// if parent asset type exists
      this.borderAssetTypes = resultData.Items;
    } else {
      let fetchedBorderAssets: any = await this.apiService.getData('borderAssetTypes').toPromise();
      this.borderAssetTypes = fetchedBorderAssets.Items;
    }
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  // container data
  addContainer() {
    if (this.containers.length <= 4) {
      this.containers.push({
        loadedOn: {
          type: '',
          number: '',
        },
        number: '',
        cargoExemptions: [],
        sealNumbers: [{ sealNumber: '' }],
      });
    } else {
      this.toastr.warning('Only 5 containers are allowed in ACI manifest!');
    }
  }
  deleteContainer(i: number) {
    this.containers.splice(i, 1);
  }
  addContainerSeal(i) {
    if (this.containers[i].sealNumbers.length <= 19) {
      this.containers[i].sealNumbers.push({ sealNumber: '' });
    }
  }
  // trailer data
  addTrailer() {
    this.trailers.push({
      assetID: '',
      assetTypeCode: '',
      cargoExemptions: [],
      sealNumbers: [{ sealNumber: '' }],
    });
    this.addTrailerBtn = true;

    if (this.trailers.length >= 3) {
      this.addTrailerBtn = false;
    } else {
      this.addTrailerBtn = true;
    }
  }
  addTrailerSeal(i) {
    if (this.trailers[i].sealNumbers.length <= 19) {
      this.trailers[i].sealNumbers.push({ sealNumber: '' });
    }
  }
  deleteTrailer(i: number) {
    this.trailers.splice(i, 1);
    this.addTrailerBtn = true;
  }
  addMorePassenger() {
    this.passengers.push({
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      citizenshipCountry: '',
      fastCardNumber: '',
      travelDocuments: [
        {
          type: '',
          number: '',
          country: '',
          stateProvince: '',
        },
      ],
    });
  }
  deletePassenger(i: number) {
    this.passengers.splice(i, 1);
  }
  resetpassengerDocState(i, j) {
    this.passengers[i].travelDocuments[j].stateProvince = '';
    $('#passengerDocStateSelect').val('');
  }
  addDocument(i) {
    if (this.passengers[i].travelDocuments.length <= 2) {
      this.passengers[i].travelDocuments.push({
        type: '',
        number: '',
        country: '',
        stateProvince: '',
      });
    } else {
      this.toastr.warning(
        'Only 3 travel documents of passenger are allowed in ACI manifest'
      );
    }
  }
  deleteDocument(i: number, p: number) {
    this.passengers[p].travelDocuments.splice(i, 1);
  }
  // delivery destinations
  resetDeliveryDestinationState(s, p) {
    this.shipments[s].notifyParties[p].address.stateID = '';
    $('#deliveryDestinationStateSelect').val('');
  }
  resetDeliveryDestinationCity(s, p) {
    this.shipments[s].notifyParties[p].address.cityID = '';
    $('#deliveryDestinationCitySelect').val('');
  }
  addDeliveryDestination(p) {
    if (this.shipments[p].deliveryDestinations.length <= 96) {
      this.shipments[p].deliveryDestinations.push(
        {
          name: '',
          contactNumber: '',
          address: {
            countryID: '',
            countryName: '',
            countryCode: '',
            stateID: '',
            stateName: '',
            stateCode: '',
            cityID: '',
            cityName: '',
            postalCode: '',
            addressLine: '',
            geoCords: {
              lat: '',
              lng: ''
            },
            manual: false,
            userLocation: ''
          }
        }
      );
    }
  }
  deleteDeliveryDestination(i: number, s: number) {
    this.shipments[s].deliveryDestinations.splice(i, 1);
  }
  // address section
  clearUserLocation(s, p, callType) {
    if (callType == 'delivery') {
      this.shipments[s].deliveryDestinations[p].address[`userLocation`] = '';
      $('div').removeClass('show-search__result');
    }
    else {
      this.shipments[s].notifyParties[p].address[`userLocation`] = '';
      $('div').removeClass('show-search__result');
    }
  }
  public searchLocation() {
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }
  manAddress(event, s, p, callType) {
    if (event.target.checked) {
      if (callType === 'notify') {
        $(event.target).closest('.address-item').addClass('open');
        this.shipments[s].notifyParties[p].address[`userLocation`] = '';
      } else {
        $(event.target).closest('.address-item').addClass('open');
        this.shipments[s].deliveryDestinations[p].address[`userLocation`] = '';
      }
    } else {
      if (callType === 'notify') {
        $(event.target).closest('.address-item').removeClass('open');
        this.shipments[s].notifyParties[p].address.countryID = '';
        this.shipments[s].notifyParties[p].address.countryName = '';
        this.shipments[s].notifyParties[p].address.stateID = '';
        this.shipments[s].notifyParties[p].address.stateName = '';
        this.shipments[s].notifyParties[p].address.cityID = '';
        this.shipments[s].notifyParties[p].address.cityName = '';
        this.shipments[s].notifyParties[p].address.postalCode = '';
        this.shipments[s].notifyParties[p].address.addressLine = '';
        this.shipments[s].notifyParties[p].address.geoCords.lat = '';
        this.shipments[s].notifyParties[p].address.geoCords.lng = '';
      } else {
        $(event.target).closest('.address-item').removeClass('open');
        this.shipments[s].deliveryDestinations[p].address.countryID = '';
        this.shipments[s].deliveryDestinations[p].address.countryName = '';
        this.shipments[s].deliveryDestinations[p].address.stateID = '';
        this.shipments[s].deliveryDestinations[p].address.stateName = '';
        this.shipments[s].deliveryDestinations[p].address.cityID = '';
        this.shipments[s].deliveryDestinations[p].address.cityName = '';
        this.shipments[s].deliveryDestinations[p].address.postalCode = '';
        this.shipments[s].deliveryDestinations[p].address.addressLine = '';
        this.shipments[s].deliveryDestinations[p].address.geoCords.lat = '';
        this.shipments[s].deliveryDestinations[p].address.geoCords.lng = '';
      }
    }
  }
  async userAddress(s, p, item, callType) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    if (callType === 'delivery') {
      this.shipments[s].deliveryDestinations[p].address.userLocation = result.address.label;
      this.shipments[s].deliveryDestinations[p].address.geoCords.lat = result.position.lat;
      this.shipments[s].deliveryDestinations[p].address.geoCords.lng = result.position.lng;
      this.shipments[s].deliveryDestinations[p].address.countryName = result.address.countryName;
      this.shipments[s].deliveryDestinations[p].address.countryCode = result.address.countryCode;
      this.shipments[s].deliveryDestinations[p].address.addressLine = result.address.houseNumber + ' ' + result.address.street;
      $('div').removeClass('show-search__result');
      this.shipments[s].deliveryDestinations[p].address.stateName = result.address.state;
      this.shipments[s].deliveryDestinations[p].address.stateCode = result.address.stateCode;
      this.shipments[s].deliveryDestinations[p].address.cityName = result.address.city;
      this.shipments[s].deliveryDestinations[p].address.postalCode = result.address.postalCode;
      if (result.address.houseNumber === undefined) {
        result.address.houseNumber = '';
      }
      if (result.address.street === undefined) {
        result.address.street = '';
      }
    } else {
      this.shipments[s].notifyParties[p].address.userLocation = result.address.label;
      this.shipments[s].notifyParties[p].address.geoCords.lat = result.position.lat;
      this.shipments[s].notifyParties[p].address.geoCords.lng = result.position.lng;
      this.shipments[s].notifyParties[p].address.countryName = result.address.countryName;
      this.shipments[s].notifyParties[p].address.countryCode = result.address.countryCode;
      this.shipments[s].notifyParties[p].address.addressLine = result.address.houseNumber + ' ' + result.address.street;
      $('div').removeClass('show-search__result');
      this.shipments[s].notifyParties[p].address.stateName = result.address.state;
      this.shipments[s].notifyParties[p].address.stateCode = result.address.stateCode;
      this.shipments[s].notifyParties[p].address.cityName = result.address.city;
      this.shipments[s].notifyParties[p].address.postalCode = result.address.postalCode;
      if (result.address.houseNumber === undefined) {
        result.address.houseNumber = '';
      }
      if (result.address.street === undefined) {
        result.address.street = '';
      }
    }
  }
  // notify parties
  resetNotifyPartyState(s, p) {
    this.shipments[s].notifyParties[p].address.stateID = '';
    $('#notifyPartyStateSelect').val('');
  }
  resetNotifyPartyCity(s, p) {
    this.shipments[s].notifyParties[p].address.cityID = '';
    $('#notifyPartyCitySelect').val('');
  }
  addNotifyParty(p) {
    if (this.shipments[p].notifyParties.length <= 97) {
      this.shipments[p].notifyParties.push(
        {
          name: '',
          contactNumber: '',
          address: {
            countryID: '',
            countryName: '',
            countryCode: '',
            stateID: '',
            stateName: '',
            stateCode: '',
            cityID: '',
            cityName: '',
            postalCode: '',
            addressLine: '',
            geoCords: {
              lat: '',
              lng: ''
            },
            manual: false,
            userLocation: ''
          }
        }
      );
    }
  }
  deleteNotifyParty(p: number, s: number) {
    this.shipments[s].notifyParties.splice(p, 1);
  }
  addCommodity(s) {
    this.shipments[s].commodities.push({
      description: '',
      quantity: '',
      packagingUnit: '',
      weight: '',
      weightUnit: '',
      marksAndNumbers: '',
      hazmatDetails: {
        unCode: '',
        emergencyContactName: '',
        contactPhone: '',
        handlingInstructions: '',
      },
    });
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
  addShipment() {
    this.shipments.push({
      shipmentType: '',
      loadedOn: {
        type: '',
        number: '',
      },
      CCC: '',
      cargoControlNumber: '',
      referenceOnlyShipment: false,
      portOfEntry: '',
      releaseOffice: '',
      subLocation: '',
      importerCsaBusinessNumber: '',
      uniqueConsignmentReferenceNumber: '',
      estimatedArrivalDate: '',
      estimatedArrivalTime: '',
      estimatedArrivalTimeZone: '',
      cityOfLoading: {
        cityName: '',
        stateProvince: '',
      },
      cityOfAcceptance: {
        cityName: '',
        stateProvince: '',
      },
      consolidatedFreight: false,
      specialInstructions: '',
      shipperID: '',
      consigneeID: '',
      notifyParties: [],
      deliveryDestinations: [],
      commodities: [
        {
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            handlingInstructions: '',
          },
        },
      ],
    });
  }
  deleteShipment(i: number) {
    this.shipments.splice(i, 1);
  }

  addACIManifest() {
    const data = {
      CCC: this.CCC,
      tripNumber: this.CCC + this.tripNumber,
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
      trailers: this.trailers,
      mainDriver: this.mainDriver,
      coDrivers: this.coDrivers,
      passengers: this.passengers,
      containers: this.containers,
      shipments: this.shipments,
      currentStatus: 'Draft',
    };
    this.apiService.postData('ACIeManifest', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Manifest added successfully.');
        this.location.back(); // <-- go back to previous location
      },
    });
  }
  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .after(
          '<label id="' +
          v +
          '-error" class="error" for="' +
          v +
          '">' +
          this.errors[v] +
          '</label>'
        )
        .addClass('error');
    });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      $('[name="' + v + '"]')
        .removeClass('error')
        .next()
        .remove('label');
    });
    this.errors = {};
  }

  fetchACIEntry() {
    this.apiService
      .getData('ACIeManifest/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.timeCreated = result.timeCreated;
        this.entryID = this.entryID;
        this.sendId = result.sendId;
        this.CCC = result.CCC;
        this.tripNumber = result.tripNumber.substring(4, (result.tripNumber.length));
        this.portOfEntry = result.portOfEntry;
        this.subLocation = result.subLocation;
        this.estimatedArrivalDate = result.estimatedArrivalDate;
        this.estimatedArrivalTime = result.estimatedArrivalTime;
        this.estimatedArrivalTimeZone = result.estimatedArrivalTimeZone;
        this.truck = result.truck;
        this.mainDriver = result.mainDriver;
        this.coDrivers = result.coDrivers;
        this.trailers = result.trailers;
        this.containers = result.containers;
        this.passengers = result.passengers;
        this.shipments = result.shipments;
        this.currentStatus = result.currentStatus;
        setTimeout(() => {
          this.fetchUSStates();
        }, 2000);
      });
  }
  updateACIManifest() {
    const data = {
      entryID: this.entryID,
      sendId: this.sendId,
      CCC: this.CCC,
      tripNumber: this.CCC + this.tripNumber,
      portOfEntry: this.portOfEntry,
      subLocation: this.subLocation,
      estimatedArrivalDate: this.estimatedArrivalDate,
      estimatedArrivalTime: this.estimatedArrivalTime,
      estimatedArrivalTimeZone: this.estimatedArrivalTimeZone,
      truck: this.truck,
      trailers: this.trailers,
      mainDriver: this.mainDriver,
      coDrivers: this.coDrivers,
      passengers: this.passengers,
      containers: this.containers,
      shipments: this.shipments,
      currentStatus: this.currentStatus,
      timeCreated: this.timeCreated,
    };
    this.apiService
      .putData(
        `ACIeManifest/${this.amendManifest}?amendTripReason=${this.amendTripReason}`,
        data
      )
      .subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.toastr.success('Manifest Updated Successfully.');
          this.location.back(); // <-- go back to previous location
        },
      });
  }

  fastValidation(e) {
    const fastCard = e.target.value;
    const newString = fastCard.split('');
    if (newString.length == 0) {
      this.errorFastCard = false;
    } else {
      if (newString.length != 14) {
        this.errorFastCard = true;
      } else {
        const fastStart = newString[0].concat(newString[1], newString[2], newString[3]);
        const fastEnd = newString[12].concat(newString[13]);
        if (fastStart != '4270') {
          this.errorFastCard = true;
        }
        else if (fastEnd != '00' && fastEnd != '01' && fastEnd != '02') {
          this.errorFastCard = true;
        } else {
          this.errorFastCard = false;
        }
      }
    }
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }
}
