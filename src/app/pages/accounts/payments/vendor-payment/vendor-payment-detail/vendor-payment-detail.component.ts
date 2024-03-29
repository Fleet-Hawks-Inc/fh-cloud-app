import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService} from 'src/app/services';
@Component({
  selector: 'app-vendor-payment-detail',
  templateUrl: './vendor-payment-detail.component.html',
  styleUrls: ['./vendor-payment-detail.component.css']
})
export class VendorPaymentDetailComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  paymentData = {
    entityId: null,
    txnDate: '',
    payCur: null,
    paymentNo: '',
    accountID: null,
    payMode: null,
    payModeNo: '',
    payModeDate: null,
    paymentTotal: 0,
    attachments: [],
    transactionLog: [],
    invoices: [],
    remarks: null
  };
  paymentID;
  accountsObjects = {};
  accountsIntObjects = {};
  vendors = [];
  Asseturl = this.apiService.AssetUrl;
  carrierID = '';
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  documentSlides = [];
  showModal = false;

  constructor(private route: ActivatedRoute,
              private toaster: ToastrService,
              private accountService: AccountService,
              private domSanitizer: DomSanitizer,
              private apiService: ApiService,
              private listService: ListService,) { }

  ngOnInit(): void {
    this.paymentID = this.route.snapshot.params[`paymentID`];
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
    this.fetchPaymentDetail();
    this.fetchVendors();
  }
  fetchVendors() {
    this.apiService.getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.vendors = result;
      });
  }
  fetchPaymentDetail() {
    this.accountService.getData(`vendor-payments/detail/${this.paymentID}`).subscribe((result: any) => {
      this.paymentData = result[0];
      if (result[0].attachments !== undefined && result[0].attachments.length > 0) {
        result[0].attachments.map((x) => {
          const obj = {
            name: x,
            path: `${this.Asseturl}/${result[0].carrierID}/${x}`
          };
          this.documentSlides.push(obj);
        });
      }
      if (this.paymentData.payMode) {
        this.paymentData.payMode = this.paymentData.payMode.replace('_', '');
      }
      this.paymentData.transactionLog.map((v: any) => {
        v.type = v.type.replace('_', ' ');
      });
    });
  }
  fetchAccountsByIDs() {
    this.accountService.getData('chartAc/get/list/all').subscribe((result: any) => {
      this.accountsObjects = result;
    });
  }
  fetchAccountsByInternalIDs() {
    this.accountService.getData('chartAc/get/internalID/list/all').subscribe((result: any) => {
      this.accountsIntObjects = result;
    });
  }
  deleteDocument(name: string, index: number) {
    this.accountService.deleteData(`vendor-payments/uploadDelete/${this.paymentID}/${name}`).subscribe((result: any) => {
      this.documentSlides.splice(index, 1);
      this.toaster.success('Attachment deleted successfully.');
    });
  }
  setPDFSrc(val) {
    const pieces = val.split(/[\s.]+/);
    const ext = pieces[pieces.length - 1];
    this.pdfSrc = '';
    if (ext === 'doc' || ext === 'docx' || ext === 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.paymentTotal,
      type: 'vendor',
      chequeNo: this.paymentData.payModeNo,
      currency: 'CAD',
      formType: (this.paymentID) ? 'edit' : 'add',
      showModal: this.showModal,
      vacPayPer: 0,
      vacPayAmount: 0,
      finalAmount: this.paymentData.paymentTotal,
      txnDate: this.paymentData.txnDate,
      page: 'addForm',
      invoices: this.paymentData.invoices
    };
    this.listService.openPaymentChequeModal(obj);
  }
}
