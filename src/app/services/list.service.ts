import { EventEmitter, Injectable, Output, TemplateRef, ViewChild } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable, Subject } from "rxjs";
import { AccountService } from 'src/app/services/account.service';
import { HttpClient } from "@angular/common/http"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
@Injectable({
  providedIn: "root",
})
export class ListService {
  vendorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  vendorList = this.vendorDataSource.asObservable();

  shipperDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  shipperList = this.shipperDataSource.asObservable();

  public isTrueDataSource = new BehaviorSubject<boolean>(false);
  isTrueList = this.isTrueDataSource.asObservable();
  

  shipperObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  shipperObjectList = this.shipperObjectDataSource.asObservable();

  receiverObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  receiverObjectList = this.receiverObjectDataSource.asObservable();

  receiverDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  receiverList = this.receiverDataSource.asObservable();

  manufacturerDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  manufacturerList = this.manufacturerDataSource.asObservable();

  modelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  modelList = this.modelDataSource.asObservable();

  countryDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  countryList = this.countryDataSource.asObservable();

  stateDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  stateList = this.stateDataSource.asObservable();

  cityDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  cityList = this.cityDataSource.asObservable();


  assetManuDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  assetManufacturesList = this.assetManuDataSource.asObservable();

  assetModelsDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  assetModelsList = this.assetModelsDataSource.asObservable();

  ownerOperatorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  ownerOperatorList = this.ownerOperatorDataSource.asObservable();

  serviceProgramDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  serviceProgramList = this.serviceProgramDataSource.asObservable();

  vehicleDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  vehicleList = this.vehicleDataSource.asObservable();

  driversDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  driversList = this.driversDataSource.asObservable();

  customersDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  customersList = this.customersDataSource.asObservable();

  issuesDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  issuesList = this.issuesDataSource.asObservable();

  tasksDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  tasksList = this.tasksDataSource.asObservable();

  assetsDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  assetsList = this.assetsDataSource.asObservable();

  accountsDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  accountsList = this.accountsDataSource.asObservable();

  addressDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  addressList = this.addressDataSource.asObservable();

  paymentModelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  paymentModelList = this.paymentModelDataSource.asObservable();

  otherModelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  otherModelList = this.otherModelDataSource.asObservable();

  paymentSaveDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  paymentSaveList = this.paymentSaveDataSource.asObservable();

  contactsObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  contactsList = this.contactsObjectDataSource.asObservable();


  public _subject = new BehaviorSubject<any>({});
  statusChanged$: any;

  public popup: Subject<any> = new Subject<any>();

  constructor(private apiService: ApiService,private accountService: AccountService,private modalService: NgbModal) {}

  fetchVendors() {
    this.apiService.getData("contacts/get/type/vendor").subscribe((result: any) => {
      this.vendorDataSource.next(result);
    });
  }

fetchShippers() {
  this.apiService.getData("contacts/get/type/consignor").subscribe((result: any) => {
    this.shipperDataSource.next(result);
  });
}
fetchReceivers() {
  this.apiService.getData("contacts/get/type/consignee").subscribe((result: any) => {
    this.receiverDataSource.next(result);
  });
}
  // fetchManufacturers() {
  //   this.apiService.getData('manufacturers').subscribe((result: any) => {
  //     this.manufacturerDataSource.next(result.Items);
  //   });
  // }

  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countryDataSource.next(result.Items);
    });
  }

  // fetchModels() {
  //   this.apiService
  //     .getData(`vehicleModels`)
  //     .subscribe((result: any) => {
  //       this.modelDataSource.next(result.Items);
  //     });
  // }

  fetchStates() {
    this.apiService
      .getData(`states`)
      .subscribe((result: any) => {
        this.stateDataSource.next(result.Items);
      });
  }

  fetchCities() {
    this.apiService
      .getData(`cities`)
      .subscribe((result: any) => {
        this.cityDataSource.next(result.Items);
      });
  }

  fetchOwnerOperators() {
    this.apiService
      .getData(`contacts/get/type/ownerOperator`)
      .subscribe((result: any) => {
        this.ownerOperatorDataSource.next(result);
      });
  }

  // fetchAssetManufacturers() {
  //   this.apiService
  //     .getData(`assetManufacturers`)
  //     .subscribe((result: any) => {
  //       this.assetManuDataSource.next(result.Items);
  //   });
  // }

  fetchServicePrograms() {
    this.apiService
      .getData(`servicePrograms`)
      .subscribe((result: any) => {
        this.serviceProgramDataSource.next(result.Items);
    });
  }
  // fetchAssetModels() {
  //   this.apiService
  //     .getData(`assetModels`)
  //     .subscribe((result: any) => {
  //       this.assetModelsDataSource.next(result.Items);
  //     });
  // }
  fetchVehicles() {
    this.apiService.getData(`vehicles`).subscribe((result: any) => {
      this.vehicleDataSource.next(result.Items);
    });
  }

  fetchDrivers() {
    this.apiService.getData(`drivers`).subscribe((result: any) => {
      this.driversDataSource.next(result.Items);
    });
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/fetch/order/customers`).subscribe((result: any) => {
      this.customersDataSource.next(result);
    });
  }

  fetchTasks() {
    this.apiService.getData(`tasks`).subscribe((result: any) => {
      this.tasksDataSource.next(result.Items);
    });
  }

  async fetchVehicleIssues(id: any) {
    let promise: any = await this.apiService.getData(`issues/vehicle/${id}`).toPromise();
    let newIssues = [];
    promise.Items.filter(elem => {
      if(elem.currentStatus == 'OPEN') {
        newIssues.push(elem);
      }
    })
    this.issuesDataSource.next(newIssues);

  }

  async fetchAssetsIssues(id: any) {
    let promise: any = await this.apiService.getData(`issues/asset/${id}`).toPromise();
    let newIssues = [];
    promise.Items.filter(elem => {
      if(elem.currentStatus == 'OPEN') {
        newIssues.push(elem);
      }
    })
    this.issuesDataSource.next(newIssues);
  }

  fetchAssets() {
    this.apiService.getData(`assets`).subscribe((result: any) => {
      this.assetsDataSource.next(result.Items);
    });
  }

  appendIssues(data: any){
    this._subject.next(data);
    this.fetchAppendIssues();
  }

  fetchAppendIssues() {
    return this._subject.asObservable()
  }


  // fetch accounts of chart of accounts
  fetchChartAccounts() {
    this.accountService.getData('chartAc/fetch/list').subscribe((res: any) => {
      this.accountsDataSource.next(res);
      });
  }

  fetchShippersByIDs() {
    this.apiService.getData("contacts/get/list/consignor").subscribe((result: any) => {
      this.shipperObjectDataSource.next(result);
    });
  }

  fetchReceiversByIDs() {
    this.apiService.getData("contacts/get/list/consignee").subscribe((result: any) => {
      this.receiverObjectDataSource.next(result);
    });
  }

  fetchContactsByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.contactsObjectDataSource.next(result);
    });
  }

  public changeButton(value: boolean){
    this.isTrueDataSource.next(value);
  }


  triggerModal(value: any) {
    this.addressDataSource.next(value)
  }
  openPaymentChequeModal(value){
    this.paymentModelDataSource.next(value);
  }

  triggerPaymentSave(value) {
    this.paymentSaveDataSource.next(value);
  }
  
  separateModals(value){
    this.otherModelDataSource.next(value);
  }
}
