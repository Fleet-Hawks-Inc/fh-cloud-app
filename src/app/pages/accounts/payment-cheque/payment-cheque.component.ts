import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild("content", {static: true}) modalContent: TemplateRef<any>;
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
  };
  driverData;

  cdnFund = ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'];
  sideVal = ['*','*','*','*','*','*','*','*','*','*','*'];
  cdnFundSmall = ['AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST','AST'];
  
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
        if(this.cheqdata.type == 'driver') {
          this.fetchDriver();
        } else {
          this.fetchContact();
        }
        
        this.arrangeNumbers();
        this.modalService.open(this.modalContent).result.then((result) => {
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
    $('#chequeModal').modal('show');
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
      this.carriers.unshift(result);
    })
  }

  selectedCarrier(val) {
    this.cheqdata.companyName = val.companyName;
    this.cheqdata.currency = 'CAD';
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

      val.address.map((v) => {
        if(v.manual) {
          v.fullAddr = `${v.address1}, ${v.stateName}, ${v.cityName}, ${v.countryName}, ${v.zipCode}`;
        } else {
          v.fullAddr = v.userLocation;
        }
      });
      this.addresses = val.address;
    }
  }

  generatePDF() {
    var data = document.getElementById('print_wrap');
    html2pdf(data, {
      margin:       0,
      filename:     `cheque-${this.cheqdata.chqNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },

    });
  }

  arrangeNumbers() {
    let numbers = this.cheqdata.amount.toLocaleString();
    let conv = '';
    let arrLen = 15 - numbers.length;
    let sideArrLen = 11 - numbers.length;
    for (let i = 0; i < numbers.length; i++) {
      if(i == 0) {
        this.cdnFund[arrLen-1] = '$';
      }
      const element = numbers[i];
      this.cdnFund[arrLen] = element;
      this.sideVal[sideArrLen] = element;
      conv = this.numberToString(element);
      this.cdnFundSmall[arrLen] = conv;
      arrLen++;
      sideArrLen++;
    }
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
        this.cheqdata.entityName = result.Items[0].companyName;
        this.paydata.entityName = this.cheqdata.entityName;
        this.cheqdata.carrAddress = result.Items[0].address;
        result.Items[0].address.map((v) => {
          if(v.addressType === 'Office') {
            if(v.manual) {
              this.cheqdata.carrAddress = `${v.address1}, ${v.stateName}, ${v.cityName}, ${v.countryName}, ${v.zipCode}`;
            } else {
              this.cheqdata.carrAddress = v.userLocation;
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
