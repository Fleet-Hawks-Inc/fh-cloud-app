import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Auth } from 'aws-amplify';
import { ListService } from '../../../../../services';
declare var $: any;

@Component({
  selector: 'app-new-ace-manifest',
  templateUrl: './new-ace-manifest.component.html',
  styleUrls: ['./new-ace-manifest.component.css'],
  providers: [],
})
export class NewAceManifestComponent implements OnInit {
  public entryID;
  sendId;
  title = 'Add ACE e-Manifest';
  modalTitle = 'Add';
  vehicles = [];
  assets = [];
  fetchedDrivers = [];
  mainDriver = '';
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
  carriers: any = [];
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  currentUser: any = '';
  getcurrentDate: any;
  truck = {
    truckID: '',
    sealNumbers: [
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
      { sealNumber: '' },
    ],
  };
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
    },
  ];
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
        fda: '',
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
    },
  ];
  usAddress = {
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
  };
  borderAssetTypes = [];
  /**
   * for front end validation of US address
   */
  errorClassState = false;
  errorClassCity = false;
  errorClassAddress = false;
  errorClassZip = false;
  address = false;
  amendManifest = false;
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
    private location: Location,
    private listService: ListService,
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
  }
  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    if (this.entryID) {
      this.title = 'Edit ACE e-Manifest';
      this.modalTitle = 'Edit';
      this.fetchACEEntry();
      this.route.queryParams.subscribe((params) => {
        if(params.amendManifest !== undefined){
          this.amendManifest = params.amendManifest; // to get query parameter amend
        }
       });
    } else {
      this.title = 'Add ACE e-Manifest';
      this.modalTitle = 'Add';
    }
    this.listService.fetchStates();
    this.listService.fetchCities();
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchDrivers();
    this.fetchCountries();
    this.listService.fetchShippers();
    this.listService.fetchReceivers();
    this.fetchBrokers();
    this.getStates();
    this.getUSStates();
    this.fetchCarrier();
    this.getCurrentuser();
    this.shippers = this.listService.shipperList;
    this.consignees = this.listService.receiverList;
    this.thirdPartyStates = this.listService.stateList;
    this.thirdPartyCities = this.listService.cityList;
    this.passengerDocStates = this.listService.stateList;
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
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

  }
  fetchAssets() {
    this.apiService.getData('assets').subscribe((result: any) => {
      this.assets = result.Items;
      console.log('assets', this.assets);
    });
  }
  /***
   * fetch asset types from mapped table
   */
 async getBorderAssetTypes(e) {
    const assetID = e;
    let fetchedAsset = await this.apiService.getData('assets/' + assetID).toPromise();
    let resultData = await this.apiService.getData('borderAssetTypes/' +   fetchedAsset.Items[0].assetDetails.assetType).toPromise(); // border aset types are fetched whose parent is asset type of selected asset
    this.borderAssetTypes = resultData.Items;
  }
  getStates() {
    this.apiService
      .getData('states/getCanadianStates')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getUSStates() {
    this.apiService.getData('states/getUSStates').subscribe((result: any) => {
      this.addressStates = result.Items;
    });
  }
  onChangeHideErrors(fieldname = '') {
    $(`[name='' + fieldname + '']`)
      .removeClass('error')
      .next()
      .remove('label');
  }
  resetThirdPartyState(s, p) {
    this.shipments[s].thirdParties[p].address.stateProvince = '';
    $('#thirdPartyStateSelect').val('');
  }
  resetThirdPartyCity(s, p) {
    this.shipments[s].thirdParties[p].address.city = '';
    $('#thirdPartyCitySelect').val('');
  }
  getAddressCities() {
    this.apiService
      .getData('cities/state/' + this.usAddress.state)
      .subscribe((result: any) => {
        this.addressCities = result.Items;
      });
  }
  getThirdPartyStatesCities() {
    this.apiService.getData('states').subscribe((result: any) => {
      this.thirdPartyStates = result.Items;
    });
    this.apiService.getData('cities').subscribe((result: any) => {
      this.thirdPartyCities = result.Items;
    });
  }
  getThirdPartyStates(s, p) {
    const countryID = this.shipments[s].thirdParties[p].address.country;
    this.apiService
      .getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.thirdPartyStates = result.Items;
      });
  }
  getThirdPartyCities(s, p) {
    const stateID = this.shipments[s].thirdParties[p].address.stateProvince;
    this.apiService
      .getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.thirdPartyCities = result.Items;
      });
  }
  resetpassengerDocState(i, j) {
    this.passengers[i].travelDocuments[j].stateProvince = '';
    $('#passengerDocStateSelect').val('');
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.fetchedDrivers = result.Items;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  fetchCarrier() {
    this.apiService.getData('carriers/getCarrier').subscribe((result: any) => {
      this.carriers = result.Items;
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
      assetID: '',
      assetTypeCode: '',
      sealNumbers: [
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
        { sealNumber: '' },
      ],
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
        fda: '',
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
        },
      ],
    });
  }
  deletePassenger(i: number) {
    this.passengers.splice(i, 1);
  }
  addDocument(i) {
    this.passengers[i].travelDocuments.push({
      type: '',
      number: '',
      country: '',
      stateProvince: '',
    });
  }
  deleteDocument(i: number, p: number) {
    this.passengers[p].travelDocuments.splice(i, 1);
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
          addressLine: '',
          city: '',
          stateProvince: '',
          country: '',
          postalCode: '',
        },
      });
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
    if (this.shipments.length == 0) {
      // to show error on empty US address
      if (this.usAddress.state == '') {
        this.errorClassState = true;
      } else {
        this.errorClassState = false;
      }
      if (this.usAddress.city == '') {
        this.errorClassCity = true;
      } else {
        this.errorClassCity = false;
      }
      if (this.usAddress.addressLine === '') {
        this.errorClassAddress = true;
      } else {
        this.errorClassAddress = false;
      }
      if (this.usAddress.zipCode === '') {
        this.errorClassZip = true;
      } else {
        this.errorClassZip = false;
      }
      if (
        this.usAddress.state !== '' &&
        this.usAddress.city !== '' &&
        this.usAddress.addressLine !== '' &&
        this.usAddress.zipCode !== ''
      ) {
        this.address = true;
      }
    }
    if (this.shipments.length > 0 || this.address) {
      this.coDrivers.unshift(this.mainDriver);
      const data = {
        SCAC: this.SCAC,
        tripNumber: this.tripNumber,
        usPortOfArrival: this.usPortOfArrival,
        estimatedArrivalDate: this.estimatedArrivalDate,
        estimatedArrivalTime: this.estimatedArrivalTime,
        truck: this.truck,
        trailers: this.trailers,
        drivers: this.coDrivers,
        usAddress: this.usAddress,
        passengers: this.passengers,
        shipments: this.shipments,
        currentStatus: 'Draft',
      };
      this.apiService.postData('ACEeManifest', data).subscribe({
        complete: () => {},
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
              error: () => {},
              next: () => {},
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
  } throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
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
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.currentUser = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  };
  fetchACEEntry() {
    this.apiService
      .getData('ACEeManifest/' + this.entryID).subscribe((result: any) => {
        result = result.Items[0];
        this.entryID = this.entryID;
        this.sendId = result.sendId;
        this.timeCreated = result.timeCreated;
        this.SCAC = result.SCAC;
        this.tripNumber = result.tripNumber.substring(4, (result.tripNumber.length));
        this.usPortOfArrival = result.usPortOfArrival;
        this.estimatedArrivalDate = result.estimatedArrivalDate;
        this.estimatedArrivalTime = result.estimatedArrivalTime;
        this.truck = result.truck;
        this.mainDriver = result.drivers[0];
        this.coDrivers = result.drivers.slice(1);
        this.trailers = result.trailers;
        this.passengers = result.passengers;
        this.shipments = result.shipments;
        this.currentStatus = result.currentStatus;
        this.usAddress.addressLine = result.usAddress.addressLine;
        this.usAddress.state = result.usAddress.state;
        this.usAddress.city = result.usAddress.city;
        this.usAddress.zipCode = result.usAddress.zipCode;
        setTimeout(() => {
            this.getStates();
            this.getAddressCities();
          }, 2000);
      });
  }
  updateACEManifest() {
    this.hideErrors();
    if (this.shipments.length == 0) {
      // to show error on empty US address
      if (this.usAddress.state == '') {
        this.errorClassState = true;
      } else {
        this.errorClassState = false;
      }
      if (this.usAddress.city == '') {
        this.errorClassCity = true;
      } else {
        this.errorClassCity = false;
      }
      if (this.usAddress.addressLine == '') {
        this.errorClassAddress = true;
      } else {
        this.errorClassAddress = false;
      }
      if (this.usAddress.zipCode == '') {
        this.errorClassZip = true;
      } else {
        this.errorClassZip = false;
      }
      if (
        this.usAddress.state !== '' &&
        this.usAddress.city !== '' &&
        this.usAddress.addressLine !== '' &&
        this.usAddress.zipCode !== ''
      ) {
        this.address = true;
      }
    }
    if (this.shipments.length > 0 || this.address) {
      this.coDrivers.unshift(this.mainDriver);
      const data = {
        entryID: this.entryID,
        timeCreated: this.timeCreated,
        sendId: this.sendId,
        SCAC: this.SCAC,
        tripNumber: this.tripNumber,
        usPortOfArrival: this.usPortOfArrival,
        estimatedArrivalDate: this.estimatedArrivalDate,
        estimatedArrivalTime: this.estimatedArrivalTime,
        truck: this.truck,
        trailers: this.trailers,
        drivers: this.coDrivers,
        passengers: this.passengers,
        shipments: this.shipments,
        currentStatus: this.currentStatus,
        usAddress: this.usAddress,
        modifiedBy: this.currentUser,
      };
      this.apiService
        .putData(`ACEeManifest/${this.amendManifest}`, data)
        .subscribe({
          complete: () => {},
          error: (err: any) => {
            from(err.error)
              .pipe(
                map((val: any) => {
                  val.message = val.message.replace(/'.*'/, 'This Field');
                  this.errors[val.context.label] = val.message;
                })
              )
              .subscribe({
                complete: () => {
                  this.throwErrors();
                },
                error: () => {},
                next: () => {},
              });
          },
          next: (res) => {
            this.response = res;
            this.hasSuccess = true;
            this.toastr.success('Manifest Updated successfully.');
            this.location.back(); // <-- go back to previous location
          },
        });
    }
  }
}
