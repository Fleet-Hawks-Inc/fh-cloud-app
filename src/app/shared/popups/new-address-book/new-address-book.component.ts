import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, HereMapService, ListService } from 'src/app/services';
import { from, Subject, Subscription, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import * as _ from 'lodash';
import Constants from 'src/app/pages/fleet/constants';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';

declare var $: any;

@Component({
  selector: 'app-new-address-book',
  templateUrl: './new-address-book.component.html',
  styleUrls: ['./new-address-book.component.css']
})
export class NewAddressBookComponent implements OnInit {
  @ViewChild('allUnitModal', { static: true }) allUnitModal: TemplateRef<any>;
  @ViewChild('newUnitModal', { static: true }) newUnitModal: TemplateRef<any>;
  @ViewChild('unitDetailModal', { static: true }) unitDetailModal: TemplateRef<any>;
  @ViewChild('showPhotoModal', { static: true }) showPhotoModal: TemplateRef<any>;


  Asseturl = this.apiService.AssetUrl;
  public defaultProfilePath: any = 'assets/img/driver/driver.png';

  environment = environment.isFeatureEnabled;
  modalTitle = 'Add ';
  imageText = 'Add Picture';
  public profilePath: any = 'assets/img/driver/driver.png';
  uploadedPhotos = [];
  closeResult = '';
  public searchTerm = new Subject<string>();
  public searchResults: any;
  paymentOptions = [{ name: "Pay Per Mile", value: "ppm" }, { name: "Percentage", value: "pp" }, { name: "Pay Per Hour", value: "pph" }, { name: "Pay Per Delivery", value: "ppd" }, { name: "Pay Flat Rate", value: "pfr" }]
  mapPayment = { ppm: "Pay Per Mile", pp: "Percentage", pph: "Pay Per Hour", ppd: "Pay Per Delivery", pfr: "Pay Flat Rate" }
  payPerMile = {
    pType: "ppm",
    loadedMiles: null,
    currency: null,
    emptyMiles: null,
    emptyMilesTeam: null,
    loadedMilesTeam: null,
    default: false
  }
  payPerHour = {
    pType: "pph",
    rate: null,
    currency: null,
    waitingPay: null,
    waitingHourAfter: null,
    default: false
  }
  payPercentage = {
    pType: "pp",
    loadPayPercentage: null,
    loadPayPercentageOf: null,
    default: false
  }
  payPerDelivery = {
    pType: "ppd",
    deliveryRate: null,
    currency: null,
    default: false
  }
  payFlatRate = {
    pType: "pfr",
    flatRate: null,
    currency: null,
    default: false
  }
  units: any = [];
  filterVal = {
    cName: '',
  }

  similarVal = {
    cName: '',
  }



  formModalRef: any;
  updateButton: boolean = false;
  suggestions = [];
  actualSuggestions = [];
  customers = [];
  brokers = [];
  vendors = [];
  carriers = [];
  shippers = [];
  receivers = [];
  staffs = [];
  fcCompanies = [];
  owners = [];
  allData = [];
  similarSuggestions = [];
  additionalDisabled = false;
  unitDisabled = false;

  dataMessage: string = Constants.FETCHING_DATA;

  newArr = [];
  isBroker: boolean = false;
  bType: boolean = false;
  unitData = {
    cName: '',
    dba: '',
    workPhone: '',
    workPhone1: '',
    workEmail: '',
    eTypes: [],
    secondaryEmails: [],
    adrs: [{
      careOption: '',
      aType: 'Billing Address',
      cName: '',
      sName: '',
      ctyName: null,
      zip: '',
      add1: '',
      add2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLoc: '',
      manual: false,
      cCode: null,
      sCode: null,
      houseNo: '',
      street: '',
      states: [],
      cities: [],
      isSuggest: false
    }],
    addlCnt: [{
      flName: '',
      fName: '',
      lName: '',
      phone: '',
      des: '',
      email: '',
      fax: ''
    }],
    data: []
  }
  secondaryEmails;
  unitTypes = [
    {
      value: 'broker',
      label: 'broker',
      disabled: false
    },
    {
      value: 'carrier',
      label: 'carrier',
      disabled: false
    },
    {
      value: 'shipper',
      label: 'shipper',
      disabled: false
    },
    {
      value: 'receiver',
      label: 'receiver',
      disabled: false
    },
    {
      value: 'customer',
      label: 'customer',
      disabled: false
    },
    {
      value: 'fc',
      label: 'factoring company',
      disabled: false
    },
    {
      value: 'owner_operator',
      label: 'owner operator',
      disabled: false
    }, {
      value: 'vendor',
      label: 'vendor',
      disabled: false
    },

  ]

  errors = {};
  errorClass = false;
  errorClassMsg = 'Password and Confirm Password must match and can not be empty.';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';

  isSearched: boolean = false;

  countries = [];
  states = [];
  cities = [];
  selectedItems = [];
  lastKey: any = '';
  updatedKey: any = '';
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  modalSubscription: Subscription;

  constructor(private HereMap: HereMapService, private toastr: ToastrService, private modalService: NgbModal, private apiService: ApiService,
    private listService: ListService,
    private countryStateCity: CountryStateCityService) {

  }

  ngOnInit() {
    this.searchLocation();
    // this.fetchCountries();

    this.modalSubscription = this.listService.addressList.subscribe((res: any) => {
      if (res === 'list') {

        let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          windowClass: 'units-list__main'
        };
        this.modalService.dismissAll();
        const allUnitModel = this.modalService.open(this.allUnitModal, ngbModalOptions)
        allUnitModel.result.then((data) => {
          this.units = [];
          this.customers = [];
          this.brokers = [];
          this.vendors = [];
          this.receivers = [];
          this.shippers = [];
          this.owners = [];
          this.fcCompanies = [];
          this.carriers = [];
        }, (reason) => {
          this.units = [];
          this.customers = [];
          this.brokers = [];
          this.vendors = [];
          this.receivers = [];
          this.shippers = [];
          this.owners = [];
          this.fcCompanies = [];
          this.carriers = [];
        });
        this.lastKey = '';
        this.updatedKey = '';
        this.updateButton = false;
        this.fetchUnits();
      } else if (res === 'form') {
        this.bType = false;
        this.unitTypes = [
          {
            value: 'broker',
            label: 'broker',
            disabled: false
          },
          {
            value: 'carrier',
            label: 'carrier',
            disabled: false
          },
          {
            value: 'shipper',
            label: 'shipper',
            disabled: false
          },
          {
            value: 'receiver',
            label: 'receiver',
            disabled: false
          },
          {
            value: 'customer',
            label: 'customer',
            disabled: false
          },
          {
            value: 'fc',
            label: 'factoring company',
            disabled: false
          },
          {
            value: 'owner_operator',
            label: 'owner operator',
            disabled: false
          }, {
            value: 'vendor',
            label: 'vendor',
            disabled: false
          },

        ]
        this.updateButton = false;
        let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          windowClass: 'units-form__main',
          backdropClass: 'light-backdrop'
        };
        // this.modalService.dismissAll();
        this.formModalRef = this.modalService.open(this.newUnitModal, ngbModalOptions)
        this.imageText = 'Add Picture';
        this.formModalRef.result.then((data) => {
          this.emptyEntry();
        }, (reason) => {
          this.emptyEntry();
        });
      } else {
        this.modalService.dismissAll();
      }
    })
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }

  resetPaymentOption() {
    this.payPerMile = {
      pType: "ppm",
      loadedMiles: null,
      currency: null,
      emptyMiles: null,
      emptyMilesTeam: null,
      loadedMilesTeam: null,
      default: false
    }
    this.payPerHour = {
      pType: "pph",
      rate: null,
      currency: null,
      waitingPay: null,
      waitingHourAfter: null,
      default: false
    }
    this.payPercentage = {
      pType: "pp",
      loadPayPercentage: null,
      loadPayPercentageOf: null,
      default: false
    }
    this.payPerDelivery = {
      pType: "ppd",
      deliveryRate: null,
      currency: null,
      default: false
    }
    this.payFlatRate = {
      pType: "pfr",
      flatRate: null,
      currency: null,
      default: false
    }
  }
  /*
   * Get all countries from api
   */
  async fetchCountries() {
    this.countries = await this.countryStateCity.GetAllCountries();
  }

  async getStates(countryCode, type, index: any = '', data: any) {
    let states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
    let countryName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    if (type === 'unit') {
      this.unitData.adrs[index].cName = countryName;
      this.unitData.adrs[index].states = states;
    } else {
      data.adrs[index].cName = countryName;
      data.adrs[index].states = states;
    }
  }

  async getCities(stateCode, type = '', index: any = '', data) {
    let countryCode = '';
    if (type == 'unit') {
      countryCode = this.unitData.adrs[index].cCode;
    } else {
      countryCode = data.adrs[index].cCode;
    }

    let stateResult = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
    let cities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);

    if (type === 'unit') {
      this.unitData.adrs[index].sName = stateResult;
      this.unitData.adrs[index].cities = cities;
    } else {
      data.adrs[index].sName = stateResult;
      data.adrs[index].cities = cities;
    }
  }

  getSuggestions = _.debounce(function (value) {
    if (value != '') {
      value = encodeURIComponent(value.toLowerCase())
      this.apiService
        .getData(`address-book/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestions = _.uniqBy(result.Items, 'cName');
        });
    }
  }, 800);

  //For Similar Company Name Suggestions
  getSimilarNamesSuggestions = _.debounce(function (value) {
    if (value != '') {
      value = value.toLowerCase()
      this.apiService
        .getData(`address-book/similar/cName/suggestion/${value}`)
        .subscribe((result) => {
          this.actualSuggestions = _.uniqBy(result.Items, 'cName');
          this.similarSuggestions = _.uniqBy(result.Items, 'cName');
        });
    }
  }, 800);

  setSearchValues(searchValue) {
    this.filterVal.cName = searchValue;
    this.suggestions = [];
  }

  setSimilarValue(similarValue) {
    this.similarVal.cName = similarValue;
    this.actualSuggestions = [];
  }

  async searchFilter() {
    if (this.filterVal.cName != '') {
      this.isSearched = true;
      $('#addressbook-content .tab-pane').removeClass('active show');
      $('#all').addClass('active show');
      $('#addressbook-tabs .nav-link').removeClass('active');
      $('#addressbook-tabs #all-tab').addClass('active');
      this.setActiveDiv('all');
      this.filterVal.cName = this.filterVal.cName.toLowerCase().trim();
      this.suggestions = [];
      this.units = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastKey = '';
      this.fetchUnits();
    } else {
      return false
    }
  }

  setActiveDiv(item) {
    if (item === 'all') {
      this.units = this.allData;
    } else if (item === 'broker') {
      this.brokers = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('broker')) {
          this.brokers.push(element);
        }
      });
      if (this.brokers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'carrier') {
      this.carriers = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('carrier')) {
          this.carriers.push(element)
        }
      });
      if (this.carriers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'shipper') {
      this.shippers = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('shipper')) {
          this.shippers.push(element)
        }
      });
      if (this.shippers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'receiver') {
      this.receivers = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('receiver')) {
          this.receivers.push(element)
        }
      });
      if (this.receivers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'customer') {
      this.customers = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('customer')) {
          this.customers.push(element)
        }
      });
      if (this.customers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'fc') {
      this.fcCompanies = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('fc')) {
          this.fcCompanies.push(element)
        }
      });
      if (this.fcCompanies.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'vendor') {
      this.vendors = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('vendor')) {
          this.vendors.push(element)
        }
      });
      if (this.vendors.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    } else if (item === 'op') {
      this.owners = [];
      this.units.forEach(element => {
        if (element.eTypes.includes('owner_operator')) {
          this.owners.push(element)
        }
      });
      if (this.owners.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
    }

  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);
    this.updateButton = false;
    this.unitData = {
      cName: '',
      dba: '',
      workPhone: '',
      workEmail: '',
      workPhone1: '',
      eTypes: [],
      secondaryEmails: [],
      adrs: [{
        careOption: '',
        aType: 'Billing Address',
        cName: '',
        sName: '',
        ctyName: null,
        zip: '',
        add1: '',
        add2: '',
        geoCords: {
          lat: '',
          lng: ''
        },
        userLoc: '',
        manual: false,
        cCode: null,
        sCode: null,
        houseNo: '',
        street: '',
        states: [],
        cities: [],
        isSuggest: false
      }],
      addlCnt: [{
        flName: '',
        fName: '',
        lName: '',
        phone: '',
        des: '',
        email: '',
        fax: ''
      }],
      data: []
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
      if (res) {
        this.searchResults = res;
      }
    });
  }

  addAdditionalContact(data) {
    if (data.addlCnt.length < 3) {
      this.additionalDisabled = false;
      let newObj = {
        flName: '',
        fName: '',
        lName: '',
        des: '',
        phone: '',
        email: '',
        fax: '',
      };
      data.addlCnt.push(newObj);
      if (data.addlCnt.length == 3) {
        this.additionalDisabled = true;
      }
    } else {
      this.additionalDisabled = true;
      return false
    }
  }

  async userAddress(unit: string, data: any, i: number, item: any) {
    data.adrs[i].userLoc = item.address;
    let result = await this.getAddressDetail(item.place_id)
    if (unit === 'unit') {

      if (result != undefined) {
        data.adrs[i].geoCords.lat = result.position.lat;
        data.adrs[i].geoCords.lng = result.position.lng;
        data.adrs[i].cName = result.address.CountryFullName;
        data.adrs[i].sName = result.address.StateName;
        data.adrs[i].ctyName = result.address.City;

        data.adrs[i].cCode = result.address.Country;
        data.adrs[i].sCode = result.address.State;
        data.adrs[i].zip = result.address.Zip;
        data.adrs[i].street = result.address.StreetAddress;
        data.adrs[i].isSuggest = true;
      }

    } else {
      if (result != undefined) {
        data.adrs[i].geoCords.lat = result.position.lat;
        data.adrs[i].geoCords.lng = result.position.lng;
        data.adrs[i].cName = result.address.CountryFullName;
        data.adrs[i].cCode = result.address.Country;
        data.adrs[i].sCode = result.address.State;
        data.adrs[i].sName = result.address.StateName;
        data.adrs[i].ctyName = result.address.City;
        data.adrs[i].zip = result.address.Zip;
        data.adrs[i].add = result.address.StreetAddress;
        data.adrs[i].isSuggest = true;
      }

    }


    $('div').removeClass('show-search__result');
  }

  async getAddressDetail(id) {
    let result = await this.apiService
      .getData(`pcMiles/detail/${id}`).toPromise();
    return result;
  }

  delAdditionalContact(index: number) {
    this.unitData.addlCnt.splice(index, 1);
    if (this.unitData.addlCnt.length < 3) {
      this.additionalDisabled = false;
    } else {
      this.additionalDisabled = true;
    }
  }

  unitChange(types: any) {

    this.unitData.eTypes.forEach(element => {
      if (element === 'broker') {
        if (!this.newArr.includes('broker')) {
          let data = {
            brokerData: {
              type: 'company',
              dot: '',
              fn: '',
              ln: '',
              acc: '',
              ein: '',
              mc: ''
            }
          }
          this.newArr.push('broker');
          this.unitData.data.push(data)
        }
      } else if (element === 'carrier') {
        if (!this.newArr.includes('carrier')) {
          this.resetPaymentOption();
          let data = {
            carrierData: {
              csa: false,
              ctpat: false,
              pip: false,
              bond: false,
              mc: '',
              dot: '',
              fast: '',
              fastExp: null,
              ccc: '',
              scac: '',
              cvor: '',
              lTax: '',
              fTax: '',
              pType: 'ppm',
              ppd: this.payPerDelivery,
              pph: this.payPerHour,
              ppm: this.payPerMile,
              pp: this.payPercentage,
              pfr: this.payFlatRate,
              // pRate: '',
              // pRCurr: null,
              // pPnt: '',
              // perType: '',
              // lm: '',
              // lmCur: null,
              // em: '',
              // emCur: null,
              // dr: '',
              // drCur: null,
              aTax: false,
              wsib: false,
              wsibAcc: '',
              wsibExp: null,
              wcb: false,
              wcbAcc: '',
              wcbExp: null,
              banks: [{
                bName: '',
                acc: '',
                rNo: '',
                trnNo: '',
                insNo: '',
                adrs: [{
                  aType: 'branch',
                  cName: '',
                  sName: '',
                  ctyName: null,
                  zip: '',
                  add1: '',
                  add2: '',
                  geoCords: {
                    lat: '',
                    lng: ''
                  },
                  userLoc: '',
                  manual: false,
                  cCode: null,
                  sCode: null,
                  houseNo: '',
                  street: '',
                  states: [],
                  cities: []

                }]
              }]
            }
          }
          this.newArr.push('carrier');
          this.unitData.data.push(data)
        }
      } else if (element === 'shipper') {
        if (!this.newArr.includes('shipper')) {
          let data = {
            shipperData: {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('shipper');
          this.unitData.data.push(data)
        }
      } else if (element === 'receiver') {
        if (!this.newArr.includes('receiver')) {
          let data = {
            receiverData: {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('receiver');
          this.unitData.data.push(data)
        }
      } else if (element === 'customer') {
        if (!this.newArr.includes('customer')) {
          let data = {
            customerData: {
              ein: '',
              acc: '',
              dot: '',
              mc: '',
              fast: '',
              fastExp: null,
              csa: false,
              ctpat: false,
              pip: false,
            }
          }
          this.newArr.push('customer');
          this.unitData.data.push(data)
        }
      } else if (element === 'fc') {
        if (!this.newArr.includes('fc')) {
          let data = {
            fcData: {
              acc: '',
              fcRate: '',
              fcUnit: null
            }
          }
          this.newArr.push('fc');
          this.unitData.data.push(data)
        }
      } else if (element === 'owner_operator') {
        if (!this.newArr.includes('owner_operator')) {
          this.resetPaymentOption();
          let data = {
            opData: {
              csa: false,
              fast: '',
              fastExp: null,
              sin: '',
              pType: 'ppm',
              ppd: this.payPerDelivery,
              pph: this.payPerHour,
              ppm: this.payPerMile,
              pp: this.payPercentage,
              pfr: this.payFlatRate,
              // pRate: '',
              // pRCur: null,
              // pPnt: '',
              // perType: '',
              // lm: '',
              // lmCur: null,
              // em: '',
              // emCur: null,
              // dr: '',
              // drCur: null,
              wsib: false,
              wsibAcc: '',
              wsibExp: null,
              wcb: false,
              wcbAcc: '',
              wcbExp: null,
            }
          }
          this.newArr.push('owner_operator');
          this.unitData.data.push(data)
        }
      } else if (element === 'vendor') {
        if (!this.newArr.includes('vendor')) {
          let data = {
            vendorData: {
              acc: ''
            }
          }
          this.newArr.push('vendor');
          this.unitData.data.push(data)
        }
      }
    });

    let difference = this.newArr.filter(x => !this.unitData.eTypes.includes(x));
    difference.forEach(elem => {
      if (elem === 'broker') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.brokerData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('broker');
        this.newArr.splice(index, 1);
      } else if (elem === 'carrier') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.carrierData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('carrier');
        this.newArr.splice(index, 1);
      } else if (elem === 'shipper') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.shipperData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('shipper');
        this.newArr.splice(index, 1);
      } else if (elem === 'receiver') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.receiverData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('receiver');
        this.newArr.splice(index, 1);
      } else if (elem === 'customer') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.customerData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('customer');
        this.newArr.splice(index, 1);
      } else if (elem === 'fc') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.fcData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('fc');
        this.newArr.splice(index, 1);
      } else if (elem === 'vendor') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.vendorData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('vendor');
        this.newArr.splice(index, 1);
      } else if (elem === 'owner_operator') {
        for (let index = 0; index < this.unitData.data.length; index++) {
          const element = this.unitData.data[index];
          if (element.opData) {
            this.unitData.data.splice(index, 1);
          }
        }
        let index = this.newArr.indexOf('owner_operator');
        this.newArr.splice(index, 1);
      }

    })
  }


  brokerType(value: any) {
    this.unitData.data.forEach(elem => {
      if (elem.brokerData) {
        if (value == 'company') {
          elem.brokerData.fn = '';
          elem.brokerData.ln = '';
          this.bType = false;
          this.isBroker = false;
        } else {
          this.bType = true;
          this.isBroker = true;
        }
        elem.brokerData.type = value;
      }
    });

  }

  manAddress(data: any = '', type, event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
    if (type === 'unit') {
      this.unitData.adrs[i].userLoc = '';
      this.unitData.adrs[i].cCode = null;
      this.unitData.adrs[i].cName = '';
      this.unitData.adrs[i].sCode = null;
      this.unitData.adrs[i].sName = '';
      this.unitData.adrs[i].ctyName = null;
      this.unitData.adrs[i].zip = '';
      this.unitData.adrs[i].add1 = '';
      this.unitData.adrs[i].add2 = '';
      if (this.unitData.adrs[i].geoCords != undefined) {
        this.unitData.adrs[i].geoCords.lat = '';
        this.unitData.adrs[i].geoCords.lng = '';
      }
    } else {
      data.adrs[i].userLoc = '';
      data.adrs[i].cCode = null;
      data.adrs[i].cName = '';
      data.adrs[i].sCode = null;
      data.adrs[i].sName = '';
      data.adrs[i].ctyName = null;
      data.adrs[i].zip = '';
      data.adrs[i].add1 = '';
      data.adrs[i].add2 = '';
      if (data.adrs[i].geoCords != undefined) {
        data.adrs[i].geoCords.lat = '';
        data.adrs[i].geoCords.lng = '';
      }
    }

  }

  addAddress(data) {
    this.searchResults = [];
    data.adrs.push({
      aType: null,
      cName: '',
      sName: '',
      ctyName: '',
      zip: '',
      add1: '',
      add2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLoc: '',
      manual: false,
      cCode: '',
      sCode: '',
      houseNo: '',
      street: ''
    });
  }

  removeAddress(index) {
    if (confirm("This address might be associated with order(s) and those will be affected. Do you want to delete it? If you want to update the address you can edit it.") === true) {
      this.unitData.adrs.splice(index, 1);
    }

  }

  carrierWSIB(value) {
    if (value !== true) {
      this.unitData.data.forEach(elem => {
        if (elem.carrierData) {
          delete elem.carrierData.wsibAcc;
          delete elem.carrierData.wsibExp;
        }
      });

    }
  }
  carrierWCB(value) {
    if (value !== true) {
      this.unitData.data.forEach(elem => {
        if (elem.carrierData) {
          delete elem.carrierData.wcbAcc;
          delete elem.carrierData.wcbExp;
        }
      });

    }
  }

  // uploadDriverImg(event): void {
  //   if (event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = e => this.profilePath = reader.result;
  //     reader.readAsDataURL(file);

  //     this.uploadedPhotos.push(file)
  //     if(this.uploadedPhotos.length > 0) {
  //       this.imageText = 'Change Photo';
  //     }
  //   }
  // }

  clearBankLocation(data, i: any, bankIndex: any) {
    data.adrs[bankIndex].userLoc = '';
    $('div').removeClass('show-search__result');
  }

  clearAddress(index: number) {
    this.unitData.adrs[index].add1 = '';
    this.unitData.adrs[index].add2 = '';
    this.unitData.adrs[index].ctyName = null;
    this.unitData.adrs[index].cName = '';
    this.unitData.adrs[index].sName = '';
    this.unitData.adrs[index].userLoc = '';
    this.unitData.adrs[index].zip = '';
    this.unitData.adrs[index].cCode = null;
    this.unitData.adrs[index].sCode = null;
    this.unitData.adrs[index].geoCords.lat = '';
    this.unitData.adrs[index].geoCords.lng = '';
    this.unitData.adrs[index].houseNo = '';
    this.unitData.adrs[index].street = '';

  }

  updateCurrency(value) {
    this.unitData.data.forEach(elem => {
      if (elem.opData) {
        elem.opData.lmCur = value;
        elem.opData.pRCurr = value;
        elem.opData.emCur = value;
        elem.opData.drCur = value;

      } else if (elem.carrierData) {

        elem.carrierData.lmCur = value;
        elem.carrierData.pRCurr = value;
        elem.carrierData.emCur = value;
        elem.carrierData.drCur = value;
      }
    })
  }

  async checkCarrierBank(newUnitData: any) {
    newUnitData.data.forEach(element => {
      if (element.carrierData) {
        element.carrierData.banks.forEach(elem => {
          elem.adrs.forEach(async (res: any) => {
            delete res.states;
            delete res.cities;
            if (res.manual === true) {
              let data = {
                address1: res.add1,
                address2: res.add2,
                cityName: res.ctyName,
                stateName: res.sName,
                countryName: res.cName,
                zipCode: res.zip
              }

              let result = await this.newGeoCode(data);
              if (result != undefined || result != null) {
                res.geoCords = result;
              }
            }
          });
        });
      }
    });
  }

  async addEntry() {
    const isValid = this.validatePopUp();
    if (isValid) {
      this.hideErrors();
      this.unitDisabled = true;
      let isFlag = true;
      let userEmails = [];
      if (this.unitData.secondaryEmails.length > 0) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.unitData.secondaryEmails.forEach((elem) => {
          let result = re.test(String(elem.label).toLowerCase());
          if (!result) {
            this.toastr.error("Please enter valid email(s)");
            this.unitDisabled = false;
            isFlag = false;
            return;
          } else {
            if (!userEmails.includes(elem.label)) {
              userEmails.push(elem.label);
            }
          }
        });
      }
      if (isFlag) {
        this.unitData.secondaryEmails = userEmails;
        for (let i = 0; i < this.unitData.adrs.length; i++) {
          const element = this.unitData.adrs[i];
          if (element.manual === true) {
            let data = {
              address1: element.add1,
              address2: element.add2,
              cityName: element.ctyName,
              stateName: element.sName,
              countryName: element.cName,
              zipCode: element.zip
            }
            $('#addressErr' + i).css('display', 'none');
            let result = await this.newGeoCode(data);
            if (result == null) {
              $('#addressErr' + i).css('display', 'block');
              this.unitDisabled = false;
              return false;
            }
            if (result != undefined || result != null) {
              element.geoCords = result;
            }
          } else {
            $('#addressErr' + i).css('display', 'none');
            if (element.isSuggest != true && element.userLoc != '') {
              $('#addressErr' + i).css('display', 'block');
              this.unitDisabled = false;
              return;
            }
          }
          delete element.states;
          delete element.cities;
        }
        await this.checkCarrierBank(this.unitData);
        for (let j = 0; j < this.unitData.addlCnt.length; j++) {
          const element = this.unitData.addlCnt[j];
          element.flName = element.fName + ' ' + element.lName;
        }

        if (this.unitData.data.length > 0) {
          for (let element of this.unitData.data) {
            if (element.carrierData || element.opData) {
              const el = element.carrierData ? element.carrierData : element.opData
              el.ppd.default = false
              el.pph.default = false
              el.ppm.default = false
              el.pp.default = false
              el.pfr.default = false
              switch (el.pType) {
                case "ppd":
                  el.ppd.default = true
                  break;
                case "pph":
                  el.pph.default = true
                  break;
                case "pp":
                  el.pp.default = true
                  break;
                case "ppm":
                  el.ppm.default = true
                  break;
                case "pfr":
                  el.pfr.default = true
                  break;

              }
              el.paymentOption = [el.pp, el.ppd, el.pph, el.ppm, el.pfr]
              delete el.pType
              delete el.pp
              delete el.ppd
              delete el.pph
              delete el.ppm
              delete el.pfr
              if (element.carrierData) element.carrierData = el
              if (element.opData) element.opData = el
            }
          }
        }

        // create form data instance
        const formData = new FormData();
        formData.append('data', JSON.stringify(this.unitData));
        this.apiService.postData('address-book', formData, true).
          subscribe({
            complete: () => { },
            error: (err: any) => {
              this.unitDisabled = false;
              from(err.error)
                .pipe(
                  map((val: any) => {
                    val.message = val.message.replace(/".*"/, 'This Field');
                    this.errors[val.context.key] = val.message;
                  })
                )
                .subscribe({
                  complete: () => {
                    this.throwErrors();
                    this.hasError = true;
                    this.Error = 'Please see the errors';
                  },
                  error: () => {
                    this.unitDisabled = false;
                  },
                  next: () => { },
                });
            },
            next: (res) => {
              // this.response = res;
              this.hasSuccess = true;
              this.unitDisabled = false;
              this.dataMessage = Constants.FETCHING_DATA;
              this.lastKey = '';
              this.emptyTabs();
              this.showMainModal();
              this.listService.fetchContactsByIDs();
              if (this.unitData.eTypes.includes('owner_operator')) {
                this.listService.fetchOwnerOperators();
              } else if (this.unitData.eTypes.includes('shipper')) {
                this.listService.fetchShippers();
              } else if (this.unitData.eTypes.includes('receiver')) {
                this.listService.fetchReceivers();
              } else if (this.unitData.eTypes.includes('vendor')) {
                this.listService.fetchVendors();
              } else if (this.unitData.eTypes.includes('customer')) {
                this.listService.fetchCustomers();
              }
              this.toastr.success('Entry added successfully');
            }
          });
      }
    }
  }



  validatePopUp() {
    const found = this.similarSuggestions.some(a => a.cName.toLowerCase() === this.unitData.cName.toLowerCase())
    if (found) {
      if (confirm('Company name is already exists ! Are you sure want to continue?') === true) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }


  showMainModal() {
    if (localStorage.getItem('isOpen') != 'true') {
      this.listService.triggerModal('list');
    } else {
      this.listService.triggerModal('');
      localStorage.setItem('isOpen', 'false');
    }

  }

  deactivate(id) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
        .deleteData(`address-book/delete/CONT/${id}`)
        .subscribe(async (result: any) => {
          this.lastKey = '';
          this.dataMessage = Constants.FETCHING_DATA;
          this.units = [];
          this.customers = [];
          this.brokers = [];
          this.vendors = [];
          this.receivers = [];
          this.shippers = [];
          this.owners = [];
          this.fcCompanies = [];
          this.carriers = [];
          this.fetchUnits();
          this.toastr.success('Entry deleted successfully');
        });
    }
  }

  async updateEntry() {
    const isValid = this.validatePopUp();
    if (isValid) {
      this.hasError = false;
      this.hasSuccess = false;
      this.unitDisabled = true;
      this.hideErrors();
      let isFlag = true;
      let userEmails = [];
      if (this.unitData.secondaryEmails.length > 0) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.unitData.secondaryEmails.forEach((elem) => {
          let result = re.test(String(elem.label).toLowerCase());
          if (!result) {
            this.toastr.error("Please enter valid email(s)");
            this.unitDisabled = false;
            isFlag = false;
            return;
          } else {
            if (!userEmails.includes(elem.label)) {
              userEmails.push(elem.label);
            }
          }
        });
      }
      if (isFlag) {
        this.unitData.secondaryEmails = userEmails;
        for (let i = 0; i < this.unitData.adrs.length; i++) {
          const element = this.unitData.adrs[i];
          if (element.manual === true) {
            let data = {
              address1: element.add1,
              address2: element.add2,
              cityName: element.ctyName,
              stateName: element.sName,
              countryName: element.cName,
              zipCode: element.zip
            }
            $('#addressErr' + i).css('display', 'none');
            let result = await this.newGeoCode(data);

            if (result == null) {
              $('#addressErr' + i).css('display', 'block');
              return false;
            }
            if (result != undefined || result != null) {
              element.geoCords = result;
            }
          } else {
            $('#addressErr' + i).css('display', 'none');
            if (element.isSuggest != true && element.userLoc != '') {
              $('#addressErr' + i).css('display', 'block');
              return;
            }
          }
          delete element.states;
          delete element.cities;
        }
        for (let j = 0; j < this.unitData.addlCnt.length; j++) {
          const element = this.unitData.addlCnt[j];
          element.flName = element.fName + ' ' + element.lName;
        }
        // create form data instance
        const formData = new FormData();
        //append photos if any
        for (let i = 0; i < this.uploadedPhotos.length; i++) {
          formData.append('uploadedPhotos', this.uploadedPhotos[i]);
        }
        //append other fields
        if (this.unitData.data.length > 0) {
          for (let element of this.unitData.data) {
            if (element.carrierData || element.opData) {
              const el = element.carrierData ? element.carrierData : element.opData
              if (el.ppd) el.ppd.default = false
              if (el.pph) el.pph.default = false
              if (el.ppm) el.ppm.default = false
              if (el.pp) el.pp.default = false
              if (el.pfr) el.pfr.default = false
              switch (el.pType) {
                case "ppd":
                  el.ppd.default = true
                  break;
                case "pph":
                  el.pph.default = true
                  break;
                case "pp":
                  el.pp.default = true
                  break;
                case "ppm":
                  el.ppm.default = true
                  break;
                case "pfr":
                  el.pfr.default = true
                  break;

              }
              el.paymentOption = [el.pp, el.ppd, el.pph, el.ppm, el.pfr]
              if (el.pType) delete el.pType
              if (el.pp) delete el.pp
              if (el.ppd) delete el.ppd
              if (el.pph) delete el.pph
              if (el.ppm) delete el.ppm
              if (el.pfr) delete el.pfr
              if (element.carrierData) element.carrierData = el
              if (element.opData) element.opData = el
            }
          }
        }
        formData.append('data', JSON.stringify(this.unitData));
        this.apiService.putData('address-book', formData, true).subscribe({
          complete: () => { },
          error: (err: any) => {
            this.unitDisabled = false;
            from(err.error)
              .pipe(
                map((val: any) => {
                  val.message = val.message.replace(/".*"/, 'This Field');
                  this.errors[val.context.key] = val.message;
                })
              )
              .subscribe({
                complete: () => {
                  this.throwErrors();
                  this.hasError = true;
                  this.unitDisabled = false;
                  this.Error = 'Please see the errors';
                },
                error: () => {
                  this.unitDisabled = false;
                },
                next: () => { },
              });
          },
          next: (res) => {
            this.hasSuccess = true;
            this.unitDisabled = false;
            this.listService.fetchContactsByIDs();
            if (this.unitData.eTypes.includes('owner_operator')) {
              this.listService.fetchOwnerOperators();
            } else if (this.unitData.eTypes.includes('shipper')) {
              this.listService.fetchShippers();
            } else if (this.unitData.eTypes.includes('receiver')) {
              this.listService.fetchReceivers();
            } else if (this.unitData.eTypes.includes('vendor')) {
              this.listService.fetchVendors();
            } else if (this.unitData.eTypes.includes('customer')) {
              this.listService.fetchCustomers();
            }
            const index = this.units.findIndex(object => {
              return object.cName === this.unitData.cName && object.workPhone === this.unitData.workPhone && object.workEmail === this.unitData.workEmail;
            });
            this.units.splice(index, 1);
            this.units.unshift({
              cName: this.unitData.cName,
              address: this.unitData.adrs,
              workPhone: this.unitData.workPhone,
              workEmail: this.unitData.workEmail,
              eTypes: this.unitData.eTypes,
              contactID: this.unitData['contactID']
            })
            this.formModalRef.close();
            this.units.forEach(element => {
              if (element.eTypes.includes('customer')) {
                this.customers.push(element);
              } else if (element.eTypes.includes('broker')) {
                this.brokers.push(element);
              } else if (element.eTypes.includes('carrier')) {
                this.carriers.push(element);
              } else if (element.eTypes.includes('shipper')) {
                this.shippers.push(element);
              } else if (element.eTypes.includes('receiver')) {
                this.receivers.push(element);
              } else if (element.eTypes.includes('fc')) {
                this.fcCompanies.push(element);
              } else if (element.eTypes.includes('vendor')) {
                this.vendors.push(element);
              } else if (element.eTypes.includes('owner_operator')) {
                this.owners.push(element);
              }
            });
            if (this.customers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.brokers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.carriers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.shippers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.receivers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.fcCompanies.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.vendors.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            if (this.owners.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.toastr.success('Entry updated successfully');
          },
        });
      }
    }
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

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if (v == 'CognitoPassword') {
          this.errorClass = true;
          this.errorClassMsg = this.errors[v];
        } else {
          if (v == 'cName' || v == 'email') {
            $('[name="' + v + '"]')
              .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
              .addClass('error');
          }
        }
      });
  }

  fetchUnits() {
    this.dataMessage = Constants.FETCHING_DATA;
    if (this.lastKey !== 'end') {
      this.apiService.getData(`address-book/fetch/records?lastKey=${this.lastKey}&updatedKey=${this.updatedKey}&companyName=` + encodeURIComponent(this.filterVal.cName)).subscribe(res => {
        if (res.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        res.forEach(element => {
          this.units.push(element);
          if (element.eTypes.includes('customer')) {
            this.customers.push(element);
          } else if (element.eTypes.includes('broker')) {
            this.brokers.push(element);
          } else if (element.eTypes.includes('carrier')) {
            this.carriers.push(element);
          } else if (element.eTypes.includes('shipper')) {
            this.shippers.push(element);
          } else if (element.eTypes.includes('receiver')) {
            this.receivers.push(element);
          } else if (element.eTypes.includes('fc')) {
            this.fcCompanies.push(element);
          } else if (element.eTypes.includes('vendor')) {
            this.vendors.push(element);
          } else if (element.eTypes.includes('owner_operator')) {
            this.owners.push(element);
          }
        });
        if (this.customers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.brokers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.carriers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.shippers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.receivers.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.fcCompanies.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.vendors.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;
        if (this.owners.length === 0) this.dataMessage = Constants.NO_RECORDS_FOUND;

        if (this.units.length > 0) {
          if (this.units[this.units.length - 1].contactSK != undefined) {
            this.lastKey = this.units[this.units.length - 1].contactSK.replace(/#/g, '--');
            this.updatedKey = this.units[this.units.length - 1].updatedSK.replace(/#/g, '--');
          } else {
            this.lastKey = 'end';
          }

          this.allData = this.units;
        }
        this.isSearched = false;
      })
    }
  }

  async newGeoCode(data: any) {
    let result = await this.apiService.getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`).toPromise();
    if (result.items != undefined && result.items.length > 0) {
      return result.items[0].position;
    }
  }

  async resetFilter() {
    if (this.filterVal.cName != '') {
      $('#addressbook-content .tab-pane').removeClass('active show');
      $('#all').addClass('active show');
      $('#addressbook-tabs .nav-link').removeClass('active');
      $('#addressbook-tabs #all-tab').addClass('active');
      this.setActiveDiv('all');
      this.customers = [];
      this.filterVal.cName = '';
      this.suggestions = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.lastKey = '';
      this.units = [];
      this.fetchUnits();
    } else {
      return false;
    }

  }

  editUser(item: any) {
    this.listService.triggerModal('form');
    this.updateButton = true;
    this.newEditUnit(item);
  }

  newEditUnit(item: any) {
    this.apiService.getData(`address-book/detail/${item.contactID}`).subscribe(res => {
      res = res.Items[0];

      this.unitData.eTypes = res.eTypes;

      this.unitTypes.filter((item: any) => {
        if (this.unitData.eTypes.includes(item.value)) {
          let index = this.unitTypes.indexOf(item);
          this.unitTypes[index].disabled = true;
        }
      })

      this.newArr = res.eTypes;
      this.unitData.cName = res.cName;
      this.unitData.dba = res.dba;
      this.unitData.workEmail = res.workEmail;
      this.unitData.workPhone = res.workPhone;
      this.unitData.workPhone1 = res.workPhone1 ? res.workPhone1 : '';
      if (res.secondaryEmails && res.secondaryEmails.length > 0) {
        let emails = [];
        this.unitData.secondaryEmails = [];
        for (const iterator of res.secondaryEmails) {
          if (this.updateButton) {
            emails.push({ label: iterator })
          }
          if (!this.updateButton) {
            emails.push(iterator)
          }
        }
        this.unitData.secondaryEmails = emails;
      } else {
        this.unitData.secondaryEmails = [];
      }
      this.unitData.adrs = res.adrs;
      for (let index = 0; index < this.unitData.adrs.length; index++) {
        const element = this.unitData.adrs[index];
        if (element.manual) {
          this.getStates(element.cCode, 'unit', index, '');
          this.getCities(element.sCode, 'unit', index, '');
          element.isSuggest = false;
        } else {
          element.isSuggest = true;
        }
      }
      this.unitData.addlCnt = res.addlCnt;
      this.unitData.data = res.data;

      for (const data of this.unitData.data) {
        if (data.carrierData) {
          let newData = data.carrierData
          for (const element of data.carrierData.paymentOption) {
            if (element.default) {
              newData.pType = element.pType
            }
            if (element.pType == "ppm") {
              newData.ppm = element
            }
            if (element.pType == "pph") {
              newData.pph = element
            }
            if (element.pType == "pp") {
              newData.pp = element
            }
            if (element.pType == "ppd") {
              newData.ppd = element
            }
            if (element.pType == "pfr") {
              newData.pfr = element
            }
          }
        }
        if (data.opData) {
          let newData = data.opData
          for (const element of data.opData.paymentOption) {
            if (element.default) {
              newData.pType = element.pType
            }
            if (element.pType == "ppm") {
              newData.ppm = element
            }
            if (element.pType == "pph") {
              newData.pph = element
            }
            if (element.pType == "pp") {
              newData.pp = element
            }
            if (element.pType == "ppd") {
              newData.ppd = element
            }
            if (element.pType == "pfr") {
              newData.pfr = element
            }
          }
        }
      }
      //to show profile image
      if (res.profileImg !== '' && res.profileImg !== undefined) {
        this.profilePath = `${this.Asseturl}/${res.carrierID}/${res.profileImg}`;
        this.imageText = 'Update Picture';
      } else {
        this.profilePath = this.defaultProfilePath;
        this.imageText = 'Add Picture';
      }
      this.unitData[`contactID`] = res.contactID;
      this.unitData[`createdDate`] = res.createdDate;
      this.unitData[`createdTime`] = res.createdTime;

    })
  }

  showPhoto() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'photo__main'
    };
    this.modalService.open(this.showPhotoModal, ngbModalOptions)
  }

  openDetail(targetModal, item) {
    this.emptyEntry();
    this.newEditUnit(item);

    // this.modalService.dismissAll();
    this.updateButton = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'units-detail__main',
      backdropClass: 'light-backdrop'
    };
    this.modalService.open(targetModal, ngbModalOptions);

  }

  onModalScrollDown() {
    this.fetchUnits();
  }

  emptyTabs() {
    this.units = [];
    this.customers = [];
    this.brokers = [];
    this.vendors = [];
    this.carriers = [];
    this.shippers = [];
    this.receivers = [];
    this.fcCompanies = [];
    this.owners = [];
    this.allData = [];
  }

  emptyEntry() {
    this.newArr = [];
    this.similarVal = {
      cName: '',
    }
    this.unitData = {
      cName: '',
      dba: '',
      workPhone: '',
      workEmail: '',
      workPhone1: '',
      eTypes: [],
      secondaryEmails: [],
      adrs: [{
        careOption: '',
        aType: null,
        cName: '',
        sName: '',
        ctyName: null,
        zip: '',
        add1: '',
        add2: '',
        geoCords: {
          lat: '',
          lng: ''
        },
        userLoc: '',
        manual: false,
        cCode: null,
        sCode: null,
        houseNo: '',
        street: '',
        states: [],
        cities: [],
        isSuggest: false
      }],
      addlCnt: [{
        flName: '',
        fName: '',
        lName: '',
        phone: '',
        des: '',
        email: '',
        fax: ''
      }],
      data: []
    }
  }
}