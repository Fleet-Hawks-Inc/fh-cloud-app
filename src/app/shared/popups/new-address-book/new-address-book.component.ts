import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ApiService, HereMapService, ListService } from 'src/app/services';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-new-address-book',
  templateUrl: './new-address-book.component.html',
  styleUrls: ['./new-address-book.component.css']
})
export class NewAddressBookComponent implements OnInit {
  @ViewChild('allUnitModal', { static: true }) allUnitModal: TemplateRef<any>;
  @ViewChild('newUnitModal', { static: true }) newUnitModal: TemplateRef<any>;
  environment = environment.isFeatureEnabled;
  modalTitle = 'Add ';
  imageText = 'Add Picture';
  public profilePath: any = 'assets/img/driver/driver.png';
  uploadedPhotos = [];
  closeResult = '';
  public searchTerm = new Subject<string>();
  public searchResults: any;
  
  units: any = [];
  filterVal = {
    customerName : '',
    customerID: '',
    brokerID: '',
    brokerName: '',
    vendorID: '',
    vendorName: '',
    carrierID: '',
    carrierName: '',
    operatorID: '',
    operatorName: '',
    shipperID: '',
    shipperName: '',
    consigneeID: '',
    consigneeName: '',
    staffID: '',
    staffName: '',
    companyID: '',
    fcompanyName: '',

    shipperCompanyName: '',
    brokerCompanyName: '',
    carrierCompanyName: '',
    receiverCompanyName: '',
    customerCompanyName: '',
    staffCompanyName: '',
    factoringCompanyName: '',
    operatorCompanyName: '',
    vendorCompanyName: '',
  }
  
  updateButton: boolean = false;

  suggestedShipperCompanies = [];
  suggestedBrokerCompanies = [];
  suggestedCarrierCompanies = [];
  suggestedConsigneeCompanies = [];
  suggestedCustomerCompanies = [];
  suggestedStaffCompanies = [];
  suggestedFactoringCompanies = [];
  suggestedOperatorCompanies = [];
  suggestedVendorCompanies = [];

  customers = [];
  brokers = [];
  vendors = [];
  carriers = [];
  shippers = [];
  receivers = [];
  staffs = [];
  fcCompanies = [];
  allData = [];

  additionalDisabled = false;
  unitDisabled = false;

  newArr = [];
  unitData = {
    cName: '',
    dba: '',
    workPhone: '',
    workEmail: '',
    eTypes: [],
    adrs: [{
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
      cities: []
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

  errors = {};
  errorClass = false;
  errorClassMsg = 'Password and Confirm Password must match and can not be empty.';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';

  constructor( private HereMap: HereMapService, private toastr: ToastrService, private modalService: NgbModal, private apiService: ApiService, private listService: ListService) {
    this.listService.addressList.subscribe((res: any) => {
      if(res === 'list') {
        let ngbModalOptions: NgbModalOptions = {
          backdrop : 'static',
          keyboard : false,
          windowClass: 'units-list__main'
        };
        this.modalService.dismissAll();
        this.modalService.open(this.allUnitModal, ngbModalOptions)
      } else if(res === 'form') {
        let ngbModalOptions: NgbModalOptions = {
          backdrop : 'static',
          keyboard : false,
        };
        this.modalService.dismissAll();
        this.modalService.open(this.newUnitModal, ngbModalOptions)
      }
    })
   }

  ngOnInit() {
    this.searchLocation();
    this.fetchUnits();
  }
  
  setActiveDiv (){

  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);
    this.updateButton = false;
    this.unitData = {
      cName: '',
      dba: '',
      workPhone: '',
      workEmail: '',
      eTypes: [],
      adrs: [{
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
        cities: []
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

  addAdditionalContact(data){
    if(data.addlCnt.length < 3) {
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
      if(data.addlCnt.length == 3) {
        this.additionalDisabled = true;
      }
    } else {
      this.additionalDisabled = true;
      return false
    }
  }

  async userAddress(unit: string, data: any, i: number, item: any) {
    if(unit === 'unit') {
      data.adrs[i].userLoc = item.address.label;
      data.adrs[i].geoCords.lat = item.position.lat;
      data.adrs[i].geoCords.lng = item.position.lng;
      data.adrs[i].cName = item.address.CountryFullName;
      data.adrs[i].sName = item.address.StateName;
      data.adrs[i].ctyName = item.address.City;

      data.adrs[i].cCode = item.address.Country;
      data.adrs[i].sCode = item.address.State;
      data.adrs[i].zip = item.address.Zip;
      data.adrs[i].street = item.address.StreetAddress;
    } else {
      console.log('else', unit, data, i, item)
      data.adrs[i].userLoc = item.address.label;
      data.adrs[i].geoCords.lat = item.position.lat;
      data.adrs[i].geoCords.lng = item.position.lng;
      data.adrs[i].cName = item.address.CountryFullName;
      data.adrs[i].cCode = item.address.Country;
      data.adrs[i].sCode = item.address.State;
      data.adrs[i].sName = item.address.StateName;
      data.adrs[i].ctyName = item.address.City;
      data.adrs[i].zip = item.address.Zip;
      data.adrs[i].add = item.address.StreetAddress;
    }
    
    
    $('div').removeClass('show-search__result');
  }

  delAdditionalContact(index: number) {
    this.unitData.addlCnt.splice(index, 1);
      if(this.unitData.addlCnt.length < 3) {
        this.additionalDisabled = false;
      } else {
        this.additionalDisabled = true;
      }
  }

  unitChange(types: any) {
    console.log('types', this.unitData.eTypes)
    this.unitData.eTypes.forEach(element => {
      if(element === 'broker') {
        if(!this.newArr.includes('broker')){
          let data = {
            brokerData : {
              type: 'individual',
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
        if(!this.newArr.includes('carrier')){
          let data = {
            carrierData : {
              csa: false,
              ctpat: false,
              pip: false,
              bond: false,
              mc: '',
              dot: '',
              fast: '',
              fastExp: '',
              ccc: '',
              scac: '',
              cvor: '',
              lTax: '',
              fTax: '',
              pType: null,
              pRate: '',
              pRCurr: null,
              pPnt: '',
              perType: '',
              lm: '',
              lmCur: null,
              em: '',
              emCur: null,
              dr: '',
              drCur: null,
              aTax: false,
              wsib: false,
              wsibAcc: '',
              wsibExp: '',
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
                  add: '',
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
        if(!this.newArr.includes('shipper')){
          let data = {
            shipperData : {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('shipper');
          this.unitData.data.push(data)
        } 
      } else if (element === 'receiver') {
        if(!this.newArr.includes('receiver')){
          let data = {
            receiverData : {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('receiver');
          this.unitData.data.push(data)
        } 
      } else if (element === 'customer') {
        if(!this.newArr.includes('customer')){
          let data = {
            customerData : {
              ein: '',
              acc: '',
              dot: '',
              mc: '',
              fast: '',
              fastExp: '',
              csa: false,
              ctpat: false,
              pip: false,
            }
          }
          this.newArr.push('customer');
          this.unitData.data.push(data)
        } 
      } else if (element === 'fc') {
        if(!this.newArr.includes('fc')){
          let data = {
            fcData : {
              acc: '',
              fcRate: '',
              fcUnit: null
            }
          }
          this.newArr.push('fc');
          this.unitData.data.push(data)
        } 
      } else if (element === 'owner_operator') {
        if(!this.newArr.includes('op')){
          let data = {
            opData : {
              csa: false,
              fast: '',
              fastExp: null,
              sin: '',
              pType: '',
              pRate: '',
              pRCur: null,
              pPnt: '',
              perType: '',
              lm: '',
              lmCur: null,
              em: '',
              emCur: null,
              dr: '',
              drCur: null
            }
          }
          this.newArr.push('op');
          this.unitData.data.push(data)
        } 
      } else if (element === 'vendor') {
        if(!this.newArr.includes('vendor')){
          let data = {
            vendorData : {
              acc: ''
            }
          }
          this.newArr.push('vendor');
          this.unitData.data.push(data)
        } 
      }
    });
    
   
    console.log('data', this.unitData);
  }

  unitRemove(types){ 
    console.log('remove', types, this.unitData.eTypes);
  }

  brokerType(value: any) {
    this.unitData.data.forEach(elem => {
      if(elem.brokerData) {
        if(value == 'company') {
          elem.brokerData.fn = '';
          elem.brokerData.ln = '';
        }
        elem.brokerData.type = value;
      }
    });
    
  }

  manAddress(event, i) {
    if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.unitData.adrs[i]['userLocation'] = '';
      this.unitData.adrs[i].cCode = null;
      this.unitData.adrs[i].cName = '';
      this.unitData.adrs[i].sCode = null;
      this.unitData.adrs[i].sName = '';
      this.unitData.adrs[i].ctyName = null;
      this.unitData.adrs[i].zip = '';
      this.unitData.adrs[i].add1 = '';
      this.unitData.adrs[i].add2 = '';
      if(this.unitData.adrs[i].geoCords != undefined){
        this.unitData.adrs[i].geoCords.lat = '';
        this.unitData.adrs[i].geoCords.lng = '';
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
    
    this.unitData.adrs.splice(index, 1);
  }
  
  carrierWSIB(value) {
    if (value !== true) {
      this.unitData.data.forEach(elem => {
        if(elem.carrierData){
          delete elem.carrierData.wsibAcc;
          delete elem.carrierData.wsibExp;
        }
      })
      
    }
  }

  uploadDriverImg(event): void {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.profilePath = reader.result;
      reader.readAsDataURL(file);

      this.uploadedPhotos.push(file)
      if(this.uploadedPhotos.length > 0) {
        this.imageText = 'Change Photo';
      }
    }
  }

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
        if(elem.opData){
          elem.opData.lmCur = value;
          elem.opData.pRCurr = value;
          elem.opData.emCur = value;
          elem.opData.drCur = value;

        } else if(elem.carrierData) {
          
          elem.carrierData.lmCur = value;
          elem.carrierData.pRCurr = value;
          elem.carrierData.emCur = value;
          elem.carrierData.drCur = value;
        }
      })
  }

  async addEntry () {
    console.log('data', this.unitData)
    this.unitDisabled = true;

    for (let i = 0; i < this.unitData.adrs.length; i++) {
      const element = this.unitData.adrs[i];
      delete element.states;
      delete element.cities;
      
      if(element.manual === true){
       let data = {
          address1: element.add1,
          address2: element.add2,
          cityName: element.ctyName,
          stateName: element.sName,
          countryName: element.cName,
          zipCode: element.zip
        }

        let result = await this.newGeoCode(data);
        
        if(result != undefined){
          element.geoCords = result;
        }
      }
    }
    
    for (let j = 0; j < this.unitData.addlCnt.length; j++) {
      const element = this.unitData.addlCnt[j];
      element.flName = element.fName + ' '+ element.lName;
    }
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.unitData));

    this.apiService.postData('contacts', formData, true).
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
        // this.listService.fetchCustomers();
        // this.dataMessageCustomer = Constants.FETCHING_DATA;
        // $('#addCustomerModal').modal('hide');
        // this.customers = [];
        this.listService.triggerModal('list');
        this.fetchUnits();
        // this.activeDiv = 'customerTable';
        this.toastr.success('Entry added successfully');
      }
    });
  }


  async updateEntry() {
    this.hasError = false;
    this.hasSuccess = false;
    this.unitDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.unitData.adrs.length; i++) {
      const element = this.unitData.adrs[i];
      delete element.states;
      delete element.cities;
      
      if(element.manual === true){
       let data = {
          address1: element.add1,
          address2: element.add2,
          cityName: element.ctyName,
          stateName: element.sName,
          countryName: element.cName,
          zipCode: element.zip
        }

        let result = await this.newGeoCode(data);
        
        if(result != undefined){
          element.geoCords = result;
        }
      }
    }
    
    for (let j = 0; j < this.unitData.addlCnt.length; j++) {
      const element = this.unitData.addlCnt[j];
      element.flName = element.fName + ' '+ element.lName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.unitData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
        // $('#addCustomerModal').modal('hide');
        // this.customerDraw = 0;
        // this.lastEvaluatedKeyCustomer = '';
        // this.dataMessageCustomer = Constants.FETCHING_DATA;
        // this.listService.fetchCustomers();
        // this.showMainModal();
        // this.activeDiv = 'customerTable';
        // this.fetchCustomersCount();
        this.listService.triggerModal('list');
        this.toastr.success('Customer updated successfully');
      },
    });
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
        if(v == 'CognitoPassword') {
          this.errorClass = true;
          this.errorClassMsg = this.errors[v];
        } else {
          if(v == 'companyName' || v == 'email') {
            $('[name="' + v + '"]')
            .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
            .addClass('error');
          }
        }
      });

  }

  fetchUnits(){
    this.apiService.getData('contacts/fetch/records?lastKey=').subscribe(res => {
      console.log('res', res);
      this.units = res;
    })
  }

  async newGeoCode(data: any) {
   
    let result = await this.apiService.getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`).toPromise();
    
    if(result.items != undefined && result.items.length > 0) {
      return result.items[0].position;
    }
  }

  editUser(item: any) {
    console.log('item', item);
    this.listService.triggerModal('form');
    this.updateButton = true;
    this.apiService.getData(`contacts/detail/${item.contactID}`).subscribe(res => {
      res = res.Items[0];
      console.log('edit data', res);
      this.unitData.eTypes = res.eTypes;
      this.unitData.cName = res.cName;
      this.unitData.dba = res.dba;
      this.unitData.workEmail = res.workEmail;
      this.unitData.workPhone = res.workPhone;
      this.unitData.adrs = res.adrs;
      this.unitData.addlCnt = res.addlCnt;
      this.unitData.data = res.data;
      this.unitData['contactID'] = res.contactID;
      this.unitData['createdDate'] = res.createdDate;
      this.unitData['createdTime'] = res.createdTime;
      
    })
  }

  
}
