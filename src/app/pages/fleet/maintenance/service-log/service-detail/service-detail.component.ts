import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService, ListService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Constants from '../../../constants';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as html2pdf from "html2pdf.js";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  @ViewChild("previewExpTransaction", { static: true })
  previewExpTransaction: TemplateRef<any>;
  @ViewChild("logModal", { static: true })
  logModal: TemplateRef<any>;
  logurl = this.apiService.AssetUrl;
  noRecordMessage: string = Constants.NO_RECORDS_FOUND;
  public logID;
  programs;
  logsData: any = {
    unitType: '-'
  };
  allServiceTasks: any = [];
  allServiceParts: any = [];
  vehicle: any;
  assetID: any;
  sessionID: string;

  completionDate: any;
  startDate: any;
  odometer: any;
  reference: any;
  vendorID: any;
  description: any;
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = [];
  assetsObject: any = {};

  taskSubTotal: number;
  taskDiscountAmount: number;
  taskDiscountPercent: number;
  taskTaxAmount: number;
  taskTaxPercent: number;
  taskTotal: number;

  partsSubTotal: number;
  partsQuantity: number;
  partsDiscountAmount: number;
  partsDiscountPercent: number;
  partsTaxAmount: number;
  partsTaxPercent: number;
  partsTotal: number;

  currency: any;
  photos: any = [];
  docs: any = [];
  users: any = [];
  carrier = {
    carrierName: "",
    phone: "",
    email: "",
  };
  logImages = []
  logDocs = [];
  logModalRef: any;
  showModal = false;
  companyLogo = "";
  tagLine: "";
  companyName: any = "";
  carrierAddress = {
    address: "",
    userLocation: "",
    manual: "",
    stateName: "",
    countryName: "",
    cityName: "",
    zipCode: "",
  };
  showDetails = false;
  vehiclePlateNo: any
  vehicleVIN = ''
  assetPlateNo: any;
  assetVin: any;
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  subTotal: 0;
  taxes: any;
  finalTotal: any;
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private listService: ListService,
    private countryStateCity: CountryStateCityService,
    private routerMgmtService: RouteManagementServiceService

  ) {
    this.sessionID = this.routerMgmtService.serviceLogSessionID;
   }

  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    this.fetchProgramByID();
    this.getCurrentuser();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    // this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.fetchUsers();
    this.fetchCarrier()
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`serviceLogs/${this.logID}`).subscribe({
      complete: () => { },
      error: () => { },
      next: async (result: any) => {
        this.logsData = result.Items[0];
        this.fetchSelectedIssues(this.logsData.selectedIssues);

        result = result.Items[0];
        this.vehicle = result.unitID;
        this.assetID = result.unitID;
        this.vendorID = result.vendorID;
        this.completionDate = result.completionDate;
        this.odometer = result.odometer;
        this.reference = result.reference;
        this.description = result.description;
        this.startDate = result.timeCreated;
        this.allServiceTasks = result.allServiceTasks.serviceTaskList;
        this.allServiceParts = result.allServiceParts.servicePartsList;

        this.taskSubTotal = result.allServiceTasks.subTotal;
        this.taskDiscountAmount = result.allServiceTasks.discountAmount;
        this.taskDiscountPercent = result.allServiceTasks.discountPercent;
        this.taskTaxAmount = result.allServiceTasks.taxAmount;
        this.taskTaxPercent = result.allServiceTasks.taxPercent;
        this.taskTotal = result.allServiceTasks.total;

        this.partsSubTotal = result.allServiceParts.subTotal;
        this.partsQuantity = result.allServiceParts.totalQuantity;
        this.partsDiscountAmount = result.allServiceParts.discountAmount;
        this.partsDiscountPercent = result.allServiceParts.discountPercent;
        this.partsTaxAmount = result.allServiceParts.taxAmount;
        this.partsTaxPercent = result.allServiceParts.taxPercent;
        this.partsTotal = result.allServiceParts.total;

        this.currency = result.allServiceParts.currency;
        // this.logImages = result.uploadedPics;
        this.logDocs = result.uploadDocument;
        this.vehiclePlateNo = result.vehPlateNo;
        this.vehicleVIN = result.vehicleVin;
        this.assetPlateNo = result.assetPlateNo;
        this.assetVin = result.assetVin;
        this.subTotal = result.total.subTotal;
        this.taxes = result.total.taxes;
        this.finalTotal = result.total.finalTotal;
        for (const image of result.uploadedPics) {
            const base64 = await this.getBase64ImageFromUrl(image.path)
            this.logImages.push(
              {
                path: base64,
                name: image.name
              }
            )
        }
        
        /*
       if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0){
          this.logImages = result.uploadedPhotos.map(x => ({
            path: `${this.logurl}/${result.carrierID}/${x}`,
            name: x,
          }));
        }

        if(result.uploadedDocs !== undefined && result.uploadedDocs.length > 0){
          this.logDocs = result.uploadedDocs.map(x => ({path: `${this.logurl}/${result.carrierID}/${x}`, name: x}));
        }
        */

        this.spinner.hide(); // loader init
      },
    });

  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('contacts/get/list/vendor')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchSelectedIssues(issueIDs) {
    if (issueIDs.length > 0) {
      issueIDs = JSON.stringify(issueIDs);
      this.apiService.getData('issues/fetch/selected?issueIds=' + issueIDs)
        .subscribe((result: any) => {
          this.issuesObject = result;
        });
    }
  }

  fetchUsers() {
    this.apiService.getData('common/users/get/list').subscribe((result: any) => {
      this.users = result;

    });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }

  // delete uploaded images and documents
  delete(type: string, name: string, index: any) {
    this.apiService.deleteData(`serviceLogs/uploadDelete/${this.logID}/${type}/${name}`).subscribe((result: any) => {
      if (type === 'image') {
        this.logImages.splice(index, 1);
      } else {
        this.logDocs.splice(index, 1);
      }
    });
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "log-order logs-model",
    };
    this.logModalRef = this.modalService.open(this.logModal, ngbModalOptions)
  }
  downloadPdf() {
    var data = document.getElementById("log_wrap");
    html2pdf(data, {
      margin: 0.5,
      pagebreak: { mode: 'avoid-all', before: "log_wrap" },
      filename: "serviceLog.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 192,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.logModalRef.close();
  }
  getCurrentuser = async () => {
    const carrierID = localStorage.getItem('xfhCarrierId');
    let result: any = await this.apiService
      .getData(`carriers/detail/${carrierID}`)
      .toPromise();
    this.companyName = result.companyName;
    this.companyLogo = result.logo;
    this.tagLine = result.tagLine;
  };

  fetchCarrier() {

    const carrierID = localStorage.getItem('xfhCarrierId');
    this.apiService
      .getData(`carriers/${carrierID}`)
      .subscribe((result: any) => {
        this.carrier = result.Items[0];
        this.fetchAddress(this.carrier[`addressDetails`]);
      });
  }
  async fetchAddress(address: any) {
    for (const adr of address) {
      if (adr.addressType === "yard" && adr.defaultYard === true) {
        if (adr.manual) {
          adr.countryName =
            await this.countryStateCity.GetSpecificCountryNameByCode(
              adr.countryCode
            );
          adr.stateName = await this.countryStateCity.GetStateNameFromCode(
            adr.stateCode,
            adr.countryCode
          );
        }
        this.carrierAddress = adr;
        this.showDetails = true;
        break;
      }
    }
  }
}