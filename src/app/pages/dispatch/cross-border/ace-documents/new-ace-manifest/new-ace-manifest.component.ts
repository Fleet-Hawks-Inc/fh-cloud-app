import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { from, Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Auth } from 'aws-amplify';
import { ListService } from '../../../../../services';
import { HereMapService } from '../../../../../services';
import { updateFunctionDeclaration } from 'typescript';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
declare var $: any;

@Component({
  selector: 'app-new-ace-manifest',
  templateUrl: './new-ace-manifest.component.html',
  styleUrls: ['./new-ace-manifest.component.css'],
  providers: [MessageService],
})
export class NewAceManifestComponent implements OnInit {
  @ViewChild("aAce1") aAce1: NgForm;
  activeState: boolean[] = [true, false, false];
  public mID;
  public pk;
  sendId;
  title = 'Add ACE e-Manifest';
  modalTitle = 'Add';
  vehicles = [];
  assets = [];
  fetchedDrivers = [];
  mainDriver = null;
  coDrivers = [];
  shippers: any = [];
  consignees: any = [];
  brokers = [];
  inbondTypesList: any = [];
  foreignPortsList: any = [];
  countriesList: any = [];
  thirdPartiesList: any = [];
  thirdPartyStates: any = [];
  thirdPartyCities: any = [];
  modalStates: any = [];
  modalCities: any = [];
  carriers: any = [];
  birthDateMinLimit: any;
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  currentUser: any = '';
  getcurrentDate: any;
  manifestType = 'ACE';
  truck = {
    truckID: null,
    sealNumbers: [
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
    ],
    IIT: null

  };
  trailers = [
    {
      assetID: null,
      assetTypeCode: null,
      sealNumbers: [
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
      ],
      IIT: null
    },
  ];
  borderResponses: any = [];
  createdDate: '';
  createdTime: '';
  addTrailerSealBtn = true;
  drivers: any = [];
  estimatedArrivalDate: any = '';
  estimatedArrivalTime: string;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  USports: any = [];
  addressStates: any = [];
  addressCities: any = [];
  documentTypeList: any = [];
  shipmentTypeList: any = [];
  brokersList: any = [];
  timeList: any = [];
  tripNumber = '';
  SCAC: string;
  shipmentControlNumber: string;
  currentStatus: string;
  provinceOfLoading: string;
  states: any = [];
  countries: any = [];
  packagingUnitsList: any = [];
  addTrailerBtn = true;
  timeCreated = '';
  passengers = [];
  passengerDocStates: any = [];
  addedPassengers = [];
  shipments = [
    {
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      goodsAstrayDateOfExit: '',
      inBondDetails: {
        type: '',
        paperInBondNumber: '',
        usDestination: '',
        foreignDestination: '',
        onwardCarrierScac: '',
        irsNumber: '',
        estimatedDepartureDate: '',
        fda: false,
      },
      SCAC: '',
      shipperID: '',
      consigneeID: '',
      broker: {
        filerCode: '',
        portLocation: '',
      },
      thirdParties: [
        {
          type: '',
          name: '',
          address: {
            countryName: '',
            countryCode: '',
            stateName: '',
            stateCode: '',
            cityName: '',
            postalCode: '',
            addressLine: '',
            geoCords: {
              lat: '',
              lng: ''
            },
            manual: false,
            userLocation: '',
            thirdPartyStates: [],
            thirdPartyCities: [],
          }
        }
      ],
      commodities: [
        {
          loadedOn: {
            type: '',
            number: '',
          },
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: [
            { markNumber: '' },
            { markNumber: '' },
            { markNumber: '' },
            { markNumber: '' },
          ],
          c4LineReleaseNumber: '',
          harmonizedCode: '',
          value: '',
          countryOfOrigin: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            contactEmail: '',
          }
        }
      ]
    }
  ];
  public searchTerm = new Subject<string>();
  public searchResults: any;
  usAddress = {
    address: {
      countryName: '',
      countryCode: '',
      stateName: '',
      stateCode: '',
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
  };
  fetchedCoDrivers = [];
  borderAssetTypes: any = [];
  borderAssetType: any = [];
  USStates: any = [];
  USCities: any = [];
  /**
   * for front end validation of US address
   */
  errorClassUserLocation = false;
  errorClassCountry = false;
  errorClassState = false;
  errorClassCity = false;
  errorClassAddress = false;
  errorClassPostal = false;
  errorFastCard = false;
  address = false;
  amendManifest = false;
  shipperDetails: any = [];
  receiverDetails: any = [];
  trips = [];
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
    private location: Location,
    private HereMap: HereMapService,
    private listService: ListService,
    config: NgbTimepickerConfig,
    private dateAdapter: NgbDateAdapter<string>,
    private messageService: MessageService,
    private countryStateCity: CountryStateCityService
  ) {
    config.seconds = true;
    config.spinners = true;
    const date = new Date();
    this.birthDateMinLimit = { year: date.getFullYear() - 60, month: date.getMonth() + 1, day: date.getDate() };
    this.getcurrentDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  fetchTrips() {
    this.apiService.getData("common/trips/get/list").subscribe((result: any) => {
      this.trips = result;
    });
  }

  async ngOnInit() {
    this.mID = this.route.snapshot.params[`mID`];
    if (this.mID) {
      this.title = 'Edit ACE e-Manifest';
      this.modalTitle = 'Edit';
      this.fetchACEEntry();
      await this.getCAProvinces();
      this.route.queryParams.subscribe((params) => {
        if (params.amendManifest !== undefined) {
          this.amendManifest = params.amendManifest; // to get query parameter amend
        }
      });
    } else {
      this.title = 'Add ACE e-Manifest';
      this.modalTitle = 'Add';
    }
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.fetchTrips();
    this.listService.fetchShippers();
    this.listService.fetchReceivers();
    // this.fetchBrokers();
    this.getCAProvinces(); // fetch al provinces of Canada
    this.fetchCarrier();
    this.getCurrentuser();
    this.searchLocation();
    this.fetchAssetType();
    this.fetchUSStates(); // it fetches the US states
    this.shippers = this.listService.shipperList;
    this.consignees = this.listService.receiverList;
    this.httpClient.get('assets/USports.json').subscribe((data) => {
      this.USports = data;
    });
    this.httpClient.get('assets/manifestETA.json').subscribe((data) => {
      this.timeList = data;
    });
    this.httpClient.get('assets/ACEShipmentType.json').subscribe((data) => {
      this.shipmentTypeList = data;
    });
    this.httpClient.get('assets/packagingUnit.json').subscribe((data) => {
      this.packagingUnitsList = data;
    });
    this.httpClient.get('assets/travelDocumentType.json').subscribe((data) => {
      this.documentTypeList = data;
    });
    this.httpClient.get('assets/ACEBrokersList.json').subscribe((data) => {
      this.brokersList = data;
    });

    this.httpClient
      .get('assets/jsonFiles/ACEinbond-types.json')
      .subscribe((data) => {
        this.inbondTypesList = data;
      });
    this.httpClient
      .get('assets/jsonFiles/ACEforeignPorts.json')
      .subscribe((data) => {
        this.foreignPortsList = data;
      });
    this.httpClient
      .get('assets/jsonFiles/worldCountries.json')
      .subscribe((data) => {
        this.countriesList = data;
      });
    this.httpClient
      .get('assets/jsonFiles/ACEthirdPartyTypes.json')
      .subscribe((data) => {
        this.thirdPartiesList = data;
      });
    // $(document).ready(() => {
    //   this.form = $('#form_').validate();
    // });
  }
  shipmentLoadedFn(s, i) {
    this.shipments[s].commodities[i].loadedOn.number = '';
  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
    });
  }

  /***
  * fetch asset types from json file
  */
  fetchAssetType() {
    this.httpClient.get('assets/jsonFiles/trailers.json').subscribe((data) => {
      this.borderAssetType = data;
    });
  }
  async getBorderAssetTypes(e) {
    // const assetID = e;
    // let fetchedAsset = await this.apiService.getData('assets/' + assetID).toPromise();
    // this.borderAssetTypes = this.testBorderAsset.find(con => con.name === fetchedAsset.Items[0].assetDetails.assetType).borderTypes;

  }
  async getCAProvinces() {
    this.states = await this.countryStateCity.GetStatesByCountryCode(['CA']);
  }
  async fetchUSStates() {
    this.USStates = await this.countryStateCity.GetStatesByCountryCode(['US']);
  }
  async getUSCities(event: any) {
    const stateCode = event;
    const countryCode = 'US';
    this.usAddress.address.cityName = '';
    this.usAddress.address.stateName = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.usAddress.address.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.USCities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }

  // PASSENGER FUNCTIONS
  async getPassengerDocStates(countryCode: any, Pindex: any, Dindex: any) {
    this.passengers[Pindex].travelDocuments[Dindex].stateProvince = '';
    this.passengers[Pindex].travelDocuments[Dindex].docStates = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async fetchPassengerDocStates(passengers: any) {
    for (let p = 0; p < passengers.length; p++) {
      for (let d = 0; d < passengers[p].travelDocuments.length; d++) {
        const countryCode = this.passengers[p].travelDocuments[d].country;
        this.passengers[p].travelDocuments[d].docStates = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
      }
    }
  }
  // THIRD PARTY FUNCTION
  async getThirdPartyState(countryCode: any, sIndex: any, pIndex: any) {
    this.shipments[sIndex].thirdParties[pIndex].address.stateCode = '';
    this.shipments[sIndex].thirdParties[pIndex].address.thirdPartyStates = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async getThirdPartyCity(stateCode: any, sIndex: any, pIndex: any) {
    const countryCode = this.shipments[sIndex].thirdParties[pIndex].address.countryCode;
    this.shipments[sIndex].thirdParties[pIndex].address.cityName = '';
    this.shipments[sIndex].thirdParties[pIndex].address.stateName = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.shipments[sIndex].thirdParties[pIndex].address.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.shipments[sIndex].thirdParties[pIndex].address.thirdPartyCities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  async fetchThirdPartyAddress(shipments: any) {
    for (let s = 0; s < shipments.length; s++) {
      for (let p = 0; p < shipments[s].thirdParties.length; p++) {
        const countryCode: any = this.shipments[s].thirdParties[p].address.countryCode;
        const stateCode: any = this.shipments[s].thirdParties[p].address.stateCode;
        this.shipments[s].thirdParties[p].address.thirdPartyStates = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
        this.shipments[s].thirdParties[p].address.thirdPartyCities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
      }
    }
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }

  fetchDrivers() {
    this.apiService.getData('drivers/get/all/active').subscribe((result: any) => {
      result.Items.forEach((element) => {
        if (element.isDeleted === 0) {
          this.fetchedDrivers.push(element);
        }
      });
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  async fetchCountries() {
    this.countries = await this.countryStateCity.GetAllCountries(); //fetch countries from library
  }
  fetchCarrier() {
    this.apiService.getData('carriers/getCarrier').subscribe((result: any) => {
      if (result && result.Items.length > 0) {
        if (result.Items[0].SCAC != '' && result.Items[0].SCAC != undefined && result.Items[0].SCAC != null) {
          this.SCAC = result.Items[0].SCAC;
        } else {
          this.messageService.add({ sticky: true, closable: false, severity: 'error', summary: 'Carrier\'s SCAC Error!', detail: 'Please update your profile to add manifest.' });
        }
      }

    });
  }
  fetchBrokers() {
    this.apiService.getData('brokers').subscribe((result: any) => {
      this.brokers = result.Items;
    });
  }
  // TRAILER DATA
  addTrailer() {
    this.trailers.push({
      assetID: null,
      assetTypeCode: null,
      sealNumbers: [
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
      ],
      IIT: null
    });
    this.addTrailerBtn = true;

    if (this.trailers.length >= 9999) {
      this.addTrailerBtn = false;
    } else {
      this.addTrailerBtn = true;
    }
  }
  deleteTrailer(i: number) {
    this.trailers.splice(i, 1);
    this.addTrailerBtn = true;
  }
  addShipment() {
    this.shipments.push({
      type: '',
      shipmentControlNumber: '',
      provinceOfLoading: '',
      goodsAstrayDateOfExit: '',
      inBondDetails: {
        type: '',
        paperInBondNumber: '',
        usDestination: '',
        foreignDestination: '',
        onwardCarrierScac: '',
        irsNumber: '',
        estimatedDepartureDate: '',
        fda: false,
      },
      SCAC: '',
      shipperID: '',
      consigneeID: '',
      broker: {
        filerCode: '',
        portLocation: '',
      },
      thirdParties: [],
      commodities: [
        {
          loadedOn: {
            type: '',
            number: '',
          },
          description: '',
          quantity: '',
          packagingUnit: '',
          weight: '',
          weightUnit: '',
          marksAndNumbers: [
            { markNumber: '' },
            { markNumber: '' },
            { markNumber: '' },
            { markNumber: '' },
          ],
          c4LineReleaseNumber: '',
          harmonizedCode: '',
          value: '',
          countryOfOrigin: '',
          hazmatDetails: {
            unCode: '',
            emergencyContactName: '',
            contactPhone: '',
            contactEmail: '',
          },
        },
      ],
    });
  }
  deleteShipment(i: number) {
    this.shipments.splice(i, 1);
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addMarksAndNumbers(s, i) {
    if (this.shipments[s].commodities[i].marksAndNumbers.length <= 3) {
      this.shipments[s].commodities[i].marksAndNumbers.push({ markNumber: '' });
    }
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
          docStates: []
        },
      ],
    });
  }
  deletePassenger(i: number) {
    this.passengers.splice(i, 1);
  }
  addDocument(i) {
    if (this.passengers[i].travelDocuments.length < 3) {
      this.passengers[i].travelDocuments.push({
        type: '',
        number: '',
        country: '',
        stateProvince: '',
      });
      if (this.passengers[i].travelDocuments.length >= 3) {
        $('#addDocBtn').hide();
      }
    }
  }
  deleteDocument(i: number, p: number) {
    this.passengers[p].travelDocuments.splice(i, 1);
    if (this.passengers[p].travelDocuments.length < 3) {
      $('#addDocBtn').show();
    }
  }

  addCommodity(i) {
    this.shipments[i].commodities.push({
      loadedOn: {
        type: '',
        number: '',
      },
      description: '',
      quantity: '',
      packagingUnit: '',
      weight: '',
      weightUnit: '',
      marksAndNumbers: [
        { markNumber: '' },
        { markNumber: '' },
        { markNumber: '' },
        { markNumber: '' },
      ],
      c4LineReleaseNumber: '',
      harmonizedCode: '',
      value: '',
      countryOfOrigin: '',
      hazmatDetails: {
        unCode: '',
        emergencyContactName: '',
        contactPhone: '',
        contactEmail: '',
      },
    });
  }
  deleteCommodity(i: number, s: number) {
    this.shipments[s].commodities.splice(i, 1);
  }
  addThirdParty(p) {
    if (this.shipments[p].thirdParties.length <= 20) {
      this.shipments[p].thirdParties.push({
        type: '',
        name: '',
        address: {
          countryName: '',
          countryCode: '',
          stateName: '',
          stateCode: '',
          cityName: '',
          postalCode: '',
          addressLine: '',
          geoCords: {
            lat: '',
            lng: ''
          },
          manual: false,
          userLocation: '',
          thirdPartyStates: [],
          thirdPartyCities: []
        }
      });
    }
  }
  // third party address
  clearUserLocation(s, p, callType) {
    if (callType === 'thirdParty') {
      this.shipments[s].thirdParties[p].address[`userLocation`] = '';
      $('div').removeClass('show-search__result');
    } else {
      this.usAddress.address[`userLocation`] = '';
      $('div').removeClass('show-search__result');
    }
  }
  public searchLocation() {
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $('div').removeClass('show-search__result');
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
      if (callType === 'thirdParty') {
        $(event.target).closest('.address-item').addClass('open');
        this.shipments[s].thirdParties[p].address[`userLocation`] = '';
        this.shipments[s].thirdParties[p].address.countryCode = '';
        this.shipments[s].thirdParties[p].address.stateCode = '';
        this.shipments[s].thirdParties[p].address.stateName = '';
        this.shipments[s].thirdParties[p].address.cityName = '';
        this.shipments[s].thirdParties[p].address.postalCode = '';
      } else {
        $(event.target).closest('.address-item').addClass('open');
        this.usAddress.address[`userLocation`] = '';
        this.usAddress.address.countryCode = '';
        this.usAddress.address.stateCode = '';
        this.usAddress.address.cityName = '';
        this.usAddress.address.postalCode = '';
      }
    } else {
      if (callType === 'thirdParty') {
        $(event.target).closest('.address-item').removeClass('open');
        this.shipments[s].thirdParties[p].address.countryCode = '';
        this.shipments[s].thirdParties[p].address.countryName = '';
        this.shipments[s].thirdParties[p].address.stateCode = '';
        this.shipments[s].thirdParties[p].address.stateName = '';
        this.shipments[s].thirdParties[p].address.cityName = '';
        this.shipments[s].thirdParties[p].address.postalCode = '';
        this.shipments[s].thirdParties[p].address.addressLine = '';
        this.shipments[s].thirdParties[p].address.geoCords.lat = '';
        this.shipments[s].thirdParties[p].address.geoCords.lng = '';
      } else {
        $(event.target).closest('.address-item').removeClass('open');
        this.usAddress.address.countryCode = '';
        this.usAddress.address.countryName = '';
        this.usAddress.address.stateCode = '';
        this.usAddress.address.stateName = '';
        this.usAddress.address.cityName = '';
        this.usAddress.address.postalCode = '';
        this.usAddress.address.addressLine = '';
        this.usAddress.address.geoCords.lat = '';
        this.usAddress.address.geoCords.lng = '';
      }
    }
  }
  async getAddressDetail(id) {
    let result = await this.apiService
      .getData(`pcMiles/detail/${id}`).toPromise();
    return result;
  }

  async userAddress(s, p, item, callType) {
    if (callType === 'thirdParty') {
      this.shipments[s].thirdParties[p].address.userLocation = item.address;
    } else {
      this.usAddress.address.userLocation = item.address;
    }
    let result = await this.getAddressDetail(item.place_id);
    if (result != undefined) {
      if (callType === 'thirdParty') {
        this.shipments[s].thirdParties[p].address.geoCords.lat = result.position.lat;
        this.shipments[s].thirdParties[p].address.geoCords.lng = result.position.lng;
        this.shipments[s].thirdParties[p].address.countryName = result.address.CountryFullName;
        this.shipments[s].thirdParties[p].address.countryCode = result.address.Country;
        this.shipments[s].thirdParties[p].address.addressLine = result.address.StreetAddress;
        this.shipments[s].thirdParties[p].address.stateName = result.address.StateName;
        this.shipments[s].thirdParties[p].address.stateCode = result.address.State;
        this.shipments[s].thirdParties[p].address.cityName = result.address.City;
        this.shipments[s].thirdParties[p].address.postalCode = result.address.Zip;
        if (result.address.houseNumber === undefined) {
          result.address.houseNumber = '';
        }
        if (result.address.street === undefined) {
          result.address.street = '';
        }
      } else {

        this.usAddress.address.geoCords.lat = result.position.lat;
        this.usAddress.address.geoCords.lng = result.position.lng;
        this.usAddress.address.countryName = result.address.CountryFullName;
        this.usAddress.address.countryCode = result.address.Country;
        this.usAddress.address.addressLine = result.address.StreetAddress;
        this.usAddress.address.stateName = result.address.StateName;
        this.usAddress.address.stateCode = result.address.State;
        this.usAddress.address.cityName = result.address.City;
        this.usAddress.address.postalCode = result.address.Zip;

        if (result.address.houseNumber === undefined) {
          result.address.houseNumber = '';
        }
        if (result.address.street === undefined) {
          result.address.street = '';
        }
      }
      console.log($('.show-search__result').length)
      $('div').removeClass('show-search__result');
    }
  }

  deleteThirdParty(i: number, s: number) {
    this.shipments[s].thirdParties.splice(i, 1);
  }
  savePassengers() {
    this.addedPassengers = this.passengers;
  }
  addACEManifest() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    if (this.shipments.length === 0) {
      if (this.usAddress.address.manual === true) {
        this.errorClassUserLocation = false;
        // to show error on empty US address
        if (this.usAddress.address.countryCode === '') {
          this.errorClassCountry = true;
        } else {
          this.errorClassCountry = false;
        }
        if (this.usAddress.address.stateCode === '') {
          this.errorClassState = true;
        } else {
          this.errorClassState = false;
        }
        if (this.usAddress.address.cityName === '') {
          this.errorClassCity = true;
        } else {
          this.errorClassCity = false;
        }
        if (this.usAddress.address.addressLine === '') {
          this.errorClassAddress = true;
        } else {
          this.errorClassAddress = false;
        }
        if (this.usAddress.address.postalCode === '') {
          this.errorClassPostal = true;
        } else {
          this.errorClassPostal = false;
        }
        if (
          this.usAddress.address.stateCode !== '' &&
          this.usAddress.address.cityName !== '' &&
          this.usAddress.address.addressLine !== '' &&
          this.usAddress.address.postalCode !== ''
        ) {
          this.address = true;
        }
      }
      else {
        if (this.usAddress.address.userLocation === '') {
          this.errorClassUserLocation = true;
        } else {
          this.address = true;
          this.errorClassUserLocation = false;
        }
      }
      if (this.address === true) {
        const data = {
          type: this.manifestType,
          tripNumber: `${this.SCAC}${this.tripNumber}`,
          currentStatus: 'DRAFT',
          estimatedArrivalDate: this.estimatedArrivalDate,
          estimatedArrivalTime: this.estimatedArrivalTime,
          manifestInfo: {
            SCAC: this.SCAC,
            usPortOfArrival: this.usPortOfArrival,
            truck: this.truck,
            trailers: this.trailers,
            mainDriver: this.mainDriver,
            coDrivers: this.coDrivers,
            usAddress: this.usAddress,
            passengers: this.passengers,
            shipments: this.shipments,
          }
        };
        for (let p = 0; p < data.manifestInfo.passengers.length; p++) {
          for (let d = 0; d < data.manifestInfo.passengers[p].travelDocuments.length; d++) {
            const element = data.manifestInfo.passengers[p].travelDocuments[d];
            delete element.docStates;
          }
        }
        for (let s = 0; s < data.manifestInfo.shipments.length; s++) {
          for (let p = 0; p < data.manifestInfo.shipments[s].thirdParties.length; p++) {
            const element = data.manifestInfo.shipments[s].thirdParties[p].address;
            delete element.thirdPartyStates;
            delete element.thirdPartyCities;
          }
        }
        this.addFunction(data);
      }
    } else {
      this.usAddress = {
        address: {
          countryName: '',
          countryCode: '',
          stateName: '',
          stateCode: '',
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
      };
      const data = {
        type: this.manifestType,
        tripNumber: `${this.SCAC}${this.tripNumber}`,
        currentStatus: 'DRAFT',
        estimatedArrivalDate: this.estimatedArrivalDate,
        estimatedArrivalTime: this.estimatedArrivalTime,
        manifestInfo: {
          SCAC: this.SCAC,
          usPortOfArrival: this.usPortOfArrival,
          truck: this.truck,
          trailers: this.trailers,
          mainDriver: this.mainDriver,
          coDrivers: this.coDrivers,
          usAddress: this.usAddress,
          passengers: this.passengers,
          shipments: this.shipments,
        }

      };
      for (let p = 0; p < data.manifestInfo.passengers.length; p++) {
        for (let d = 0; d < data.manifestInfo.passengers[p].travelDocuments.length; d++) {
          const element = data.manifestInfo.passengers[p].travelDocuments[d];
          delete element.docStates;
        }
      }
      for (let s = 0; s < data.manifestInfo.shipments.length; s++) {
        for (let p = 0; p < data.manifestInfo.shipments[s].thirdParties.length; p++) {
          const element = data.manifestInfo.shipments[s].thirdParties[p].address;
          delete element.thirdPartyStates;
          delete element.thirdPartyCities;
        }
      }
      this.addFunction(data);
    }
  }
  throwErrors() {
    from(Object.keys(this.errors)).subscribe((v) => {
      if (v === 'tripNumber') {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      }
    });
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  }
  getCurrentuser = async () => {
    // this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    // this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    this.currentUser = localStorage.getItem("currentUserName");
  };
  fetchACEEntry() {
    this.apiService
      .getData('eManifests/ACE/' + this.mID).subscribe(async (result: any) => {
        result = result[0];
        this.pk = result.pk;
        this.mID = result.mID;
        this.manifestType = result.type;
        this.sendId = result.sendId;
        this.timeCreated = result.timeCreated;
        this.SCAC = result.manifestInfo.SCAC;
        this.tripNumber = result.tripNumber.substring(4, (result.tripNumber.length));
        this.usPortOfArrival = result.manifestInfo.usPortOfArrival;
        this.estimatedArrivalDate = result.arvDate;
        this.estimatedArrivalTime = result.arvTime;
        this.truck = result.manifestInfo.truck;
        this.mainDriver = result.manifestInfo.mainDriver;
        this.coDrivers = result.manifestInfo.coDrivers;
        this.trailers = result.manifestInfo.trailers;
        this.passengers = result.manifestInfo.passengers;
        await this.fetchPassengerDocStates(this.passengers);
        this.shipments = result.manifestInfo.shipments;
        await this.fetchThirdPartyAddress(this.shipments);
        this.currentStatus = result.status;
        this.usAddress = result.manifestInfo.usAddress;
        this.borderResponses = result.manifestInfo.borderResponses;
        this.createdDate = result.createdDate;
        this.createdTime = result.createdTime;
      });
  }

  updateACEManifest() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    if (this.shipments.length === 0) {
      if (this.usAddress.address.manual === true) {
        this.errorClassUserLocation = false;
        // to show error on empty US address
        if (this.usAddress.address.countryCode === '') {
          this.errorClassCountry = true;
        } else {
          this.errorClassCountry = false;
        }
        if (this.usAddress.address.stateCode === '') {
          this.errorClassState = true;
        } else {
          this.errorClassState = false;
        }
        if (this.usAddress.address.cityName === '') {
          this.errorClassCity = true;
        } else {
          this.errorClassCity = false;
        }
        if (this.usAddress.address.addressLine === '') {
          this.errorClassAddress = true;
        } else {
          this.errorClassAddress = false;
        }
        if (this.usAddress.address.postalCode === '') {
          this.errorClassPostal = true;
        } else {
          this.errorClassPostal = false;
        }
        if (
          this.usAddress.address.stateCode !== '' &&
          this.usAddress.address.cityName !== '' &&
          this.usAddress.address.addressLine !== '' &&
          this.usAddress.address.postalCode !== ''
        ) {
          this.address = true;
        }
      }
      else {
        if (this.usAddress.address.userLocation === '') {
          this.errorClassUserLocation = true;
        } else {
          this.address = true;
          this.errorClassUserLocation = false;
        }
      }
      if (this.address === true) {
        const data = {
          mID: this.mID,
          type: this.manifestType,
          tripNumber: `${this.SCAC}${this.tripNumber}`,
          currentStatus: 'DRAFT',
          sendId: this.sendId,
          estimatedArrivalDate: this.estimatedArrivalDate,
          estimatedArrivalTime: this.estimatedArrivalTime,
          manifestInfo: {
            SCAC: this.SCAC,
            usPortOfArrival: this.usPortOfArrival,
            truck: this.truck,
            trailers: this.trailers,
            mainDriver: this.mainDriver,
            coDrivers: this.coDrivers,
            usAddress: this.usAddress,
            passengers: this.passengers,
            shipments: this.shipments,
            borderResponses: this.borderResponses,
          },
          createdDate: this.createdDate,
          createdTime: this.createdTime,
        };

        for (let p = 0; p < data.manifestInfo.passengers.length; p++) {
          for (let d = 0; d < data.manifestInfo.passengers[p].travelDocuments.length; d++) {
            const element = data.manifestInfo.passengers[p].travelDocuments[d];
            delete element.docStates;
          }
        }
        for (let s = 0; s < data.manifestInfo.shipments.length; s++) {
          for (let p = 0; p < data.manifestInfo.shipments[s].thirdParties.length; p++) {
            const element = data.manifestInfo.shipments[s].thirdParties[p].address;
            delete element.thirdPartyStates;
            delete element.thirdPartyCities;
          }
        }
        this.updateFunction(data);
      }
    } else {
      this.usAddress = {
        address: {
          countryName: '',
          countryCode: '',
          stateName: '',
          stateCode: '',
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
      };
      // this.coDrivers.unshift(this.mainDriver);
      const data = {
        mID: this.mID,
        type: this.manifestType,
        tripNumber: `${this.SCAC}${this.tripNumber}`,
        currentStatus: 'DRAFT',
        sendId: this.sendId,
        estimatedArrivalDate: this.estimatedArrivalDate,
        estimatedArrivalTime: this.estimatedArrivalTime,
        manifestInfo: {
          SCAC: this.SCAC,
          usPortOfArrival: this.usPortOfArrival,
          truck: this.truck,
          trailers: this.trailers,
          mainDriver: this.mainDriver,
          coDrivers: this.coDrivers,
          usAddress: this.usAddress,
          passengers: this.passengers,
          shipments: this.shipments,
          borderResponses: this.borderResponses,
        },
        createdDate: this.createdDate,
        createdTime: this.createdTime,
      };

      for (let p = 0; p < data.manifestInfo.passengers.length; p++) {
        for (let d = 0; d < data.manifestInfo.passengers[p].travelDocuments.length; d++) {
          const element = data.manifestInfo.passengers[p].travelDocuments[d];
          delete element.docStates;
        }
      }
      for (let s = 0; s < data.manifestInfo.shipments.length; s++) {
        for (let p = 0; p < data.manifestInfo.shipments[s].thirdParties.length; p++) {
          const element = data.manifestInfo.shipments[s].thirdParties[p].address;
          delete element.thirdPartyStates;
          delete element.thirdPartyCities;
        }
      }
      this.updateFunction(data);
    }
  }
  // update function
  updateFunction(data) {
    data.pk = this.pk;
    this.apiService
      .putData(`eManifests/update-ace/${this.amendManifest}`, data)
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
                // this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.toastr.success('Manifest updated successfully.');
          this.location.back(); // <-- go back to previous location
        },
      });
  }
  // add Function
  addFunction(data) {

    this.apiService.postData('eManifests/add-ace', data).subscribe({
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
              // this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.toastr.success('Manifest added successfully.');
        //  this.location.back(); // <-- go back to previous location
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
      }
      else {
        const fastStart = newString[0].concat(newString[1], newString[2], newString[3]);
        const fastEnd = newString[12].concat(newString[13]);
        if (fastStart != '4270' && fastStart != '4110') {
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

  changeBroker(s) {
    if (s != null) {
      let portIdentifier = this.shipments[s].broker.filerCode;

      const result = this.brokersList.find((elem) => elem.portIdentifier == portIdentifier);
      if (result) {
        this.shipments[s].broker.filerCode = result.filerCode;
        this.shipments[s].broker.portLocation = result.portIdentifier;
      }

    }
  }

  getAddressID(type: string, value: boolean, i: number, id: string) {
    if (value === true && type == 'shipper') {
      this.shipments[i].shipperID = id;
    } else {
      this.shipments[i].consigneeID = id;
    }
  }

  selectedCustomer(type: string, customerID: any, index: any) {
    if (type === 'shipper') {
      this.shipperDetails = [];
    }
    if (type === 'receiver') {
      this.receiverDetails = [];
    }
    if (customerID != '' && customerID != undefined && customerID != null) {
      console.log('type', type)
      this.apiService
        .getData(`contacts/detail/${customerID}`)
        .subscribe((result: any) => {
          if (result && result.Items.length > 0) {
            if (result.Items[0].adrs && result.Items[0].adrs.length > 0) {
              for (let i = 0; i < result.Items[0].adrs.length; i++) {
                const element = result.Items[0].adrs[i];
                if (element.cCode == 'US' || element.cCode == 'CA') {
                  element["isChecked"] = false;
                  if (type === 'shipper') {
                    this.shipperDetails.push(element);
                  }
                  if (type === 'receiver') {
                    this.receiverDetails.push(element);
                  }
                }
              }
              if (type === 'shipper') {
                this.shipperDetails[0].isChecked = true;
              }
              if (type === 'receiver') {
                this.receiverDetails[0].isChecked = true;
              }
            }
            if (type === 'shipper' && this.shipperDetails.length > 0) {
              this.shipments[index]['shipAdrsID'] = this.shipperDetails[0].addressID;
            }
            if (type === 'receiver' && this.receiverDetails.length > 0) {
              this.shipments[index]['conAdrsID'] = this.receiverDetails[0].addressID;
            }
            console.log('this.shipmentss', this.shipments)
            //if (this.manifestID) {
            // this.shipperDetails[0].adrs.filter((elem) => {
            //   if (elem.addressID === this.orderData.cusAddressID) {
            //     elem.isChecked = true;
            //   }
            //   // address id doesnot match when address deleted from address book of particular entry
            //   if (
            //     this.customerSelected[0].adrs.length === 1 &&
            //     elem.addressID != this.orderData.cusAddressID
            //   ) {
            //     this.orderData.cusAddressID = elem.addressID;
            //   }
            // });
            //}
          }
        });
    }
  }
}
