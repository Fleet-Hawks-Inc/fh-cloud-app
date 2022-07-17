import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Subject, BehaviorSubject } from "rxjs";
import { AccountService } from "src/app/services/account.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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

  shipperObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
  shipperObjectList = this.shipperObjectDataSource.asObservable();

  receiverObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
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

  ownerOperatorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
  ownerOperatorList = this.ownerOperatorDataSource.asObservable();

  serviceProgramDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
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

  carrierDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  carrierList = this.carrierDataSource.asObservable();



  docModalSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  docModalList = this.docModalSource.asObservable();

  getDocsModalSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  getDocsModalList = this.getDocsModalSource.asObservable();


  closeModalSource: BehaviorSubject<any> = new BehaviorSubject(String);
  closeModalList = this.closeModalSource.asObservable();

  paymentModelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  paymentModelList = this.paymentModelDataSource.asObservable();

  otherModelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  otherModelList = this.otherModelDataSource.asObservable();

  paymentSaveDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  paymentSaveList = this.paymentSaveDataSource.asObservable();

  contactsObjectDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
  contactsList = this.contactsObjectDataSource.asObservable();

  paymentPdfObjDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject(
    []
  );
  paymentPdfList = this.paymentPdfObjDataSource.asObservable();

  brokeragePdfDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  brokeragePdfList = this.brokeragePdfDataSource.asObservable();

  bolPdfDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  bolPdfList = this.bolPdfDataSource.asObservable();

  paymentDetailSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  paymentDetail = this.paymentDetailSource.asObservable();

  voidPaymentSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  voidPayment = this.voidPaymentSource.asObservable();

  voidStatusSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  voidStatus = this.voidStatusSource.asObservable();

  settlementDetailsDataSource: BehaviorSubject<Array<any>> =
    new BehaviorSubject([]);
  settlementDetails = this.settlementDetailsDataSource.asObservable();

  public _subject = new BehaviorSubject<any>({});
  statusChanged$: any;

  public popup: Subject<any> = new Subject<any>();

  public maxUnit: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private modalService: NgbModal
  ) { }

  fetchVendors() {
    this.apiService
      .getData("contacts/get/type/vendor")
      .subscribe((result: any) => {
        this.vendorDataSource.next(result);
      });
  }

  fetchShippers() {
    this.apiService
      .getData("contacts/get/type/consignor")
      .subscribe((result: any) => {
        this.shipperDataSource.next(result);
      });
  }
  fetchReceivers() {
    this.apiService
      .getData("contacts/get/type/consignee")
      .subscribe((result: any) => {
        this.receiverDataSource.next(result);
      });
  }


  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countryDataSource.next(result.Items);
    });
  }

  fetchStates() {
    this.apiService.getData(`states`).subscribe((result: any) => {
      this.stateDataSource.next(result.Items);
    });
  }

  fetchCities() {
    this.apiService.getData(`cities`).subscribe((result: any) => {
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

  fetchServicePrograms() {
    this.apiService.getData('servicePrograms').subscribe((result: any) => {
      this.serviceProgramDataSource.next(result);
    });
  }

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
    this.apiService
      .getData(`contacts/fetch/order/customers`)
      .subscribe((result: any) => {
        this.customersDataSource.next(result);
      });
  }
  /*
   * Get all taskList
   */
  fetchTasks() {
    this.apiService.getData(`tasks?type=service`).subscribe((result: any) => {
      this.tasksDataSource.next(result);
    });
  }

  async fetchVehicleIssues(id: any) {
    let promise: any = await this.apiService
      .getData(`issues/vehicle/${id}`)
      .toPromise();
    let newIssues = [];
    promise.filter((elem) => {
      if (elem.currentStatus == "OPEN") {
        newIssues.push(elem);
      }
    });
    this.issuesDataSource.next(newIssues);
  }

  async fetchAssetsIssues(id: any) {
    let promise: any = await this.apiService
      .getData(`issues/asset/${id}`)
      .toPromise();
    let newIssues = [];
    promise.filter((elem) => {
      if (elem.currentStatus == "OPEN") {
        newIssues.push(elem);
      }
    });
    this.issuesDataSource.next(newIssues);
  }

  fetchAssets() {
    this.apiService.getData(`assets`).subscribe((result: any) => {
      this.assetsDataSource.next(result.Items);
    });
  }

  appendIssues(data: any) {
    this._subject.next(data);
    this.fetchAppendIssues();
  }

  fetchAppendIssues() {
    return this._subject.asObservable();
  }

  // fetch accounts of chart of accounts
  fetchChartAccounts() {
    this.accountService.getData("chartAc/fetch/list").subscribe((res: any) => {
      this.accountsDataSource.next(res);
    });
  }

  fetchShippersByIDs() {
    this.apiService
      .getData("contacts/get/list/consignor")
      .subscribe((result: any) => {
        this.shipperObjectDataSource.next(result);
      });
  }

  fetchReceiversByIDs() {
    this.apiService
      .getData("contacts/get/list/consignee")
      .subscribe((result: any) => {
        this.receiverObjectDataSource.next(result);
      });
  }



  fetchContactsByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.contactsObjectDataSource.next(result);
    });
  }
  fetchCarriers() {
    this.apiService
      .getData(`contacts/get/type/carrier`)
      .subscribe((result: any) => {
        // this.carriers = result;
        result.forEach((element) => {
          if (element.isDeleted === 0) {
            this.carrierDataSource.next(element);
          }
        });
      });
  }
  public changeButton(value: boolean) {
    this.isTrueDataSource.next(value);
  }

  triggerModal(value: any) {
    this.addressDataSource.next(value);
  }

  // triggerCarrierModal(value: any) {
  //   this.addressDataSource.next(value);
  // }

  openDocTypeMOdal(value: any) {
    this.docModalSource.next(value);
  }

  getAllDocs(value: any) {
    this.getDocsModalSource.next(value);
  }
  openPaymentChequeModal(value) {
    this.paymentModelDataSource.next(value);
  }

  triggerPaymentSave(value) {
    this.paymentSaveDataSource.next(value);
  }

  separateModals(value) {
    this.otherModelDataSource.next(value);
  }

  triggerDownloadPaymentPdf(value) {
    this.paymentPdfObjDataSource.next(value);
  }

  triggerBrokeragePdf(value) {
    this.brokeragePdfDataSource.next(value);
  }

  triggerBolPdf(value) {
    this.bolPdfDataSource.next(value);
  }

  showSettlementsDetailPreview(value) {
    this.settlementDetailsDataSource.next(value);
  }

  passMaxUnit(value) {
    this.maxUnit.next(value);
  }

  triggerFetchPaymentDetail(value) {
    this.paymentDetailSource.next(value);
  }

  closeModel(value) {
    this.closeModalSource.next(value)
      ;
  }

  triggerVoidDriverPayment(value) {
    console.log('listvalue', value)
    this.voidPaymentSource.next(value);
  }

  triggerVoidStatus(value) {
    this.voidStatusSource.next(value);
  }
}
