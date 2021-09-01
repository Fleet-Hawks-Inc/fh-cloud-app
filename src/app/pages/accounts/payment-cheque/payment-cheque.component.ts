import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'aws-amplify';
import { ApiService, ListService } from 'src/app/services';
import * as html2pdf from 'html2pdf.js';
declare var $: any;

@Component({
  selector: 'app-payment-cheque',
  templateUrl: './payment-cheque.component.html',
  styleUrls: ['./payment-cheque.component.css']
})
export class PaymentChequeComponent implements OnInit {
  @ViewChild("chekOptions", {static: true}) modalContent: TemplateRef<any>;
  @ViewChild("previewCheque", {static: true}) previewCheque: TemplateRef<any>;

  carriers = [];
  addresses = [];
  currCarrId = '';
  carrierID = null;
  paydata = {
    entityName: '',
    entityId: '',
    chequeDate: '',
    chequeAmount: 0,
    type: '',
    chequeNo: '',
    currency: '',
    formType: '',
  };
  cheqdata = {
    type: '',
    companyName: '',
    companyAddress: null,
    chqNo: '',
    date: '',
    amount: 0,
    currency: '',
    entityName: '',
    bankName: '',
    bankAddress: '',
    bankRouting: '',
    bankTransit: '',
    bankAccount: '',
    bankInst: '',
    carrAddress: '',
    formType: '',
  };
  driverData;

  cdnFund = ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'];
  sideVal = ['*','*','*','*','*','*','*','*','*','*','*'];
  cdnFundSmall = ['AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST'];
  totalChars = 15;
  prevClass = 'amt-words';
  
  constructor( private listService: ListService, private apiService: ApiService,
    private modalService: NgbModal) {
    this.listService.paymentModelList.subscribe((res: any) => {
      if(res.chequeDate !== '' && res.length != 0) {
        this.paydata = res;
        this.cheqdata.type = this.paydata.type;
        this.cheqdata.chqNo = this.paydata.chequeNo;
        this.cheqdata.date = this.paydata.chequeDate;
        this.cheqdata.amount = this.paydata.chequeAmount;
        this.cheqdata.currency = this.paydata.currency;
        this.cheqdata.formType = this.paydata.formType;
        if(this.cheqdata.type == 'driver') {
          this.fetchDriver();
        } else {
          this.fetchContact();
        }
        
        this.arrangeNumbers();
        let ngbModalOptions: NgbModalOptions = {
          backdrop : 'static',
          keyboard : false,
          windowClass: 'chekOptions-prog__main'
        };
        this.modalService.open(this.modalContent, ngbModalOptions).result.then((result) => {
        }, (reason) => {
        });
      }
    })
  }

  ngOnInit() {
    this.getCarriers();
    this.getCurrentuser();
    this.arrangeNumbers();
  }

  prevCheck() {
    this.modalService.dismissAll();
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'peviewCheque-prog__main'
    };
    this.modalService.open(this.previewCheque, ngbModalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  getCarriers() {
    this.apiService.getData(`contacts/get/records/carrier`).subscribe((result: any) => {
      for (let i = 0; i < result.Items.length; i++) {
        const element = result.Items[i];
        element.type = 'sub';
        this.carriers.push(element);
      }
    })
  }

  getCurrentuser = async () => {
    let data = (await Auth.currentSession()).getIdToken().payload;
    this.getCurrentCarrDetail(data.carrierID);
  }

  getCurrentCarrDetail(carrierID) {
    this.apiService.getData(`carriers/detail/${carrierID}`).subscribe((result: any) => {
      result.type = 'main';
      result.contactID = result.carrierID;
      result.cName = result.companyName;
      this.carriers.unshift(result);
    })
  }

  selectedCarrier(val) {
    console.log('val-=-=-=', val);
    this.cheqdata.companyName = val.companyName;
    this.cheqdata.currency = 'CAD';
    this.addresses = [];
    this.cheqdata.companyAddress = null;
    if(val.type === 'main') {

      this.cheqdata.bankName = val.banks[0].branchName;
      this.cheqdata.bankAccount = val.banks[0].accountNumber;
      if(val.banks[0].addressDetails) {
        if(val.banks[0].addressDetails[0].manual) {
          this.cheqdata.bankAddress = `${val.banks[0].addressDetails[0].address}, ${val.banks[0].addressDetails[0].stateName}, ${val.banks[0].addressDetails[0].cityName}, ${val.banks[0].addressDetails[0].countryName}, ${val.banks[0].addressDetails[0].zipCode}`;
        } else {
          this.cheqdata.bankAddress = val.banks[0].addressDetails[0].userLocation;
        }
      }
      this.cheqdata.bankRouting = val.banks[0].routingNumber;
      this.cheqdata.bankTransit = val.banks[0].transitNumber;
      this.cheqdata.bankInst = val.banks[0].institutionNumber;
      val.address.map((v) => {
        if(v.manual) {
          v.fullAddr = `${v.address}, ${v.stateName}, ${v.cityName}, ${v.countryName}, ${v.zipCode}`;
        } else {
          v.fullAddr = v.userLocation;
        }
      });
      this.addresses = val.address;
    } else if(val.type === 'sub') {
      this.cheqdata.bankName = 'bank first';
      this.cheqdata.bankAccount = '1247875';
      this.cheqdata.bankRouting = '12457';
      this.cheqdata.bankTransit = '78454';
      this.cheqdata.bankInst = "9635";
      this.cheqdata.bankAddress = "bank address";

      val.adrs.map((v) => {
        if(v.manual) {
          v.fullAddr = `${v.add1}, ${v.add2} ${v.sName}, ${v.ctyName}, ${v.cName}, ${v.zip}`;
        } else {
          v.fullAddr = v.userLoc;
        }
      });
      this.addresses = val.adrs;
    }
  }

  async generatePDF() {
    var data = document.getElementById('print_chk');
    html2pdf(data, {
      margin:       0,
      filename:     `cheque-${this.cheqdata.chqNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },

    });
  }

  arrangeNumbers() {
    console.log('this.cheqdata.amount', this.cheqdata.amount);
    let numbers = this.cheqdata.amount.toLocaleString();
    let conv = '';
    let arrLen = this.totalChars - numbers.length;
    let sideArrLen = 11 - numbers.length;
    for (let i = 0; i < numbers.length; i++) {
      if(i == 0) {
        this.cdnFund[arrLen-1] = '$';
        this.cdnFundSmall[arrLen-1] = this.numberToString('$');
      }
      const element = numbers[i];
      this.cdnFund[arrLen] = element;
      this.sideVal[sideArrLen] = element;
      conv = this.numberToString(element);
      this.cdnFundSmall[arrLen] = conv;
      arrLen++;
      sideArrLen++;
    }

    console.log('this.cdnFund', this.cdnFund)
    let astlen = this.cdnFund.filter(function(value){
      return value === '*';
    }).length;
    console.log('astlen-=-=-=', astlen);
    let amountLen = this.totalChars - astlen;
    console.log('amountLen-=-=-=', amountLen);
    this.prevClass = 'amt-words4';
  }

  numberToString(num) {
    let inAlphabet = '';
    switch(num) {
      case '1':
        inAlphabet = 'ONE';
        break;
      case '2':
        inAlphabet = 'TWO';
        break;
      case '3':
        inAlphabet = 'THREE';
        break;
      case '4':
        inAlphabet = 'FOUR';
        break;
      case '5':
        inAlphabet = 'FIVE';
        break;
      case '6':
        inAlphabet = 'SIX';
        break;
      case '7':
        inAlphabet = 'SEVEN';
        break;
      case '8':
        inAlphabet = 'EIGHT';
        break;
      case '9':
        inAlphabet = 'NINE';
        break;
      case '0':
        inAlphabet = 'ZERO';
        break;
      case '.':
        inAlphabet = 'PER';
        break;
      case ',':
        inAlphabet = 'COM';
        break;
      case '$':
        inAlphabet = 'DOLLAR';
        break;
    }
    return inAlphabet;
  }

  fetchDriver() {
    this.apiService.getData(`drivers/${this.paydata.entityId}`).subscribe((result: any) => {
      this.driverData = result.Items[0];
      this.cheqdata.entityName = this.driverData.firstName +' '+ this.driverData.lastName;
      this.paydata.entityName = this.cheqdata.entityName;
    });
  }

  fetchContact() {
    if(this.paydata.entityId != null) {
      this.apiService.getData(`contacts/detail/${this.paydata.entityId}`).subscribe((result: any) => {
        this.cheqdata.entityName = result.Items[0].cName;
        this.paydata.entityName = this.cheqdata.entityName;
        result.Items[0].adrs.map((v) => {
          if(v.aType === 'Office') {
            if(v.manual) {
              this.cheqdata.carrAddress = `${v.add1} ${v.add2}, ${v.sName}, ${v.ctyName}, ${v.cName}, ${v.zip}`;
            } else {
              this.cheqdata.carrAddress = v.userLoc;
            }
          }
        })
      });
    }
    
  }

  saveDownload() {
    this.generatePDF();
    $('#chequeModal').modal('hide');
    this.listService.triggerPaymentSave(this.cheqdata.type);
  }
}
