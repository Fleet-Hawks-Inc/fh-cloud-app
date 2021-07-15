import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { isObject } from 'util';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  docs = [];
  attachments = [];
  localPhotos = [];
  uploadedDocs = [];

  selectedItem = '';
  consineeData = [];
  shipperData = [];
  Asseturl = this.apiService.AssetUrl;
  orderID: string;
  orderData;
  shipperReceiversInfos = [];
  // charges : any;
  totalFreightFee: any;
  totalFuelSurcharge: any;
  totalAccessotial: any;
  totalAccessDeductions: any;
  discountAmount: any;
  discountAmtUnit: string;

  totalTax = 0;
  totalAmount: number;
  calculateBy: string;
  totalMiles: number;
  firstPickupPoint: string;
  lastDropPoint: string;

  shippersObjects: any = {};
  receiversObjects: any = {};
  customersObjects: any = {}

  accessrialData: any;
  deductionsData: any;
  taxesData: any;

  getCurrency: string;

  totalPickups: number = 0;
  totalDrops: number = 0;
  templateList = [
    'assets/img/invoice.png',
    'assets/img/invoice.png'
  ]

  orderDocs = [];
  pdfSrc:any = this.domSanitizer.bypassSecurityTrustResourceUrl('');


  /**
   * Form props
   */
  customerID = '';
  orderNumber = '';
  orderMode = '';
  customerName = '';
  customerAddress = '';
  customerCityName = '';
  customerStateName = '';
  customerCountryName = '';
  customerPhone = '';
  customerEmail = '';
  customerfax = '';
  customerPo = '';
  reference = '';
  // creation = '';
  createdDate = '';
  createdTime = '';
  additionalContactName = '';
  additionalPhone  = '';
  additionalEmail = '';

  additionalDetails = {
    dropTrailer: false,
    loadType: {
      hazMat: false,
      oversize: false,
      reefer: false,
      tanker: false
    },
    refeerTemp: {
      maxTemprature: '',
      maxTempratureUnit: '',
      minTemprature: '',
      minTempratureUnit: ''
    },
    trailerType: '',
    uploadedDocs: [],
  }

  charges: any = {
    freightFee: {
      amount: 0,
      currency: '',
      type: ''
    },
    fuelSurcharge: {
      amount: 0,
      currency: "",
      type: ""
    },
    accessorialFeeInfo: {
      accessorialFee: [],
      total: 0
    },
    accessorialDeductionInfo: {
      accessorialDeduction: [],
      total: 0
    }
  }
  discount: any = {
    amount: 0,
    unit: ''
  }
  milesInfo = {
    calculateBy: '',
    totalMiles: ''
  }
  taxesInfo = [];
  taxesTotal: any = 0;
  totalCharges: any = 0;
  advances = 0;
  balance = 0;
  newOrderData: any;

  assetTypes = {};
  milesArr = [];
  allPhotos = [];
  carrierID = '';
  stateCode = '';
  zeroRated = false;
  taxableAmount: any;
  constructor(private apiService: ApiService, private domSanitizer: DomSanitizer, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.params['orderID'];
    this.fetchOrder();
    this.fetchShippersByIDs();
    this.fetchReceiversByIDs();
  }

  /**
   * fetch Asset data
   */
  fetchOrder() {
    this.apiService
      .getData(`orders/${this.orderID}`)
      .subscribe((result: any) => {
          this.newOrderData = result;
          result = result.Items[0];
          if(result.stateTaxID != undefined) {
            if(result.stateTaxID != '') {
              this.apiService.getData('stateTaxes/'+result.stateTaxID).subscribe((result) => {
                this.stateCode = result.Items[0].stateCode;
              });
            }
          }

          this.zeroRated = result.zeroRated;
          this.carrierID = result.carrierID;
          this.customerID = result.customerID;
          this.fetchCustomersByID();
          this.customerPo = result.customerPO;
          this.reference = result.reference;
          this.createdDate = result.createdDate;
          this.createdTime = result.timeCreated;
          this.additionalContactName = result.additionalContact;
          this.additionalPhone  = result.phone;
          this.additionalEmail = result.email;
          this.shipperReceiversInfos = result.shippersReceiversInfo;

          for (let u = 0; u < this.shipperReceiversInfos.length; u++) {
            const element = this.shipperReceiversInfos[u];
              // for (let k = 0; k < element.shippers.length; k++) {
              //   const element1 = element.shippers[k];
              //   element1.date = '';
              //   element1.time = '';

              //   let datetime = element1.dateAndTime.split(' ');
              //   if(datetime[0] != undefined) {
              //     element1.date = datetime[0];
              //   }
              //   if(datetime[1] != undefined) {
              //     element1.time = datetime[1];
              //   }

              // }

              
          this.additionalDetails.dropTrailer = result.additionalDetails.dropTrailer;
          this.additionalDetails.loadType = result.additionalDetails.loadType;
          this.additionalDetails.refeerTemp = result.additionalDetails.refeerTemp;
          this.additionalDetails.trailerType = result.additionalDetails.trailerType;
          this.additionalDetails.uploadedDocs = result.additionalDetails.uploadedDocs;
          this.charges = result.charges;
          this.discount = result.discount;
          this.milesInfo = result.milesInfo;
          this.taxesInfo = result.taxesInfo;
          this.orderNumber = result.orderNumber;
          this.orderMode = result.orderMode;
          
              

          this.milesArr = [];
          // for (let k = 0; k < element.receivers.length; k++) {
          //   const element2 = element.receivers[k];
          //   element2.date = '';
          //   element2.time = '';

          //   let datetime = element2.dateAndTime.split(' ');
          //   if(datetime[0] != undefined) {
          //     element2.date = datetime[0];
          //   }
          //   if(datetime[1] != undefined) {
          //     element2.time = datetime[1];
          //   }

          // }
      }
      for(let i = 0; i < this.taxesInfo.length; i++){
        if(this.taxesInfo[i].amount){
          this.taxesTotal = this.taxesTotal + this.taxesInfo[i].amount;
        }
      }
          // for (let p = 0; p < result.shippersReceiversInfo.length; p++) {
          //   const element = result.shippersReceiversInfo[p];

          // }

          result.shippersReceiversInfo.map((v) => {
            let newArr = [];
            newArr['receivers'] = [];
            newArr['shippers'] = [];
            v.receivers.map((rec) =>{
              newArr['receivers'].push(rec);
            })

            v.shippers.map((ship) =>{
              newArr['shippers'].push(ship);
            })

            this.milesArr.push(newArr);
            
          })

          let freightFee = isNaN(this.charges.freightFee.amount) ? 0 : this.charges.freightFee.amount;
          let fuelSurcharge = isNaN(this.charges.fuelSurcharge.amount) ? 0 : this.charges.fuelSurcharge.amount;
          let accessorialFeeInfo = isNaN(this.charges.accessorialFeeInfo.total) ? 0 : this.charges.accessorialFeeInfo.total;
          let accessorialDeductionInfo = isNaN(this.charges.accessorialDeductionInfo.total) ? 0 : this.charges.accessorialDeductionInfo.total;

          let totalAmount = parseInt(freightFee) + parseInt(fuelSurcharge) + parseInt(accessorialFeeInfo) - parseInt(accessorialDeductionInfo);
          this.taxableAmount = (totalAmount * parseInt(this.taxesTotal) ) / 100;
          if(!this.zeroRated){
            this.totalCharges = totalAmount + this.taxableAmount;
          } else {
            this.totalCharges = totalAmount;
          }

          // this.advances = result.advance;
          // this.balance = this.totalCharges - this.advances;
          this.balance = this.totalCharges;
          
          if(result.attachments != undefined && result.attachments.length > 0){
            this.attachments = result.attachments.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
          } 
          if(result.uploadedDocs != undefined && result.uploadedDocs.length > 0){
            this.docs = result.uploadedDocs.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
          } 
          
          // if (
          //   result.uploadedDocs != undefined &&
          //   result.uploadedDocs.length > 0
          // ) {
          //   // this.docs = result.uploadedDocs.map(
          //   //   (x) => `${this.Asseturl}/${result.carrierID}/${x}`
          //   // );
          //   result.uploadedDocs.map((x) => {
          //     let name = x.split('.');
          //     let ext = name[name.length-1];
          //     let obj = {
          //       imgPath: '',
          //       docPath:''
          //     }
          //     if(ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
          //       obj = {
          //         imgPath: `${this.Asseturl}/${result.carrierID}/${x}`,
          //         docPath:`${this.Asseturl}/${result.carrierID}/${x}`
          //       }
          //     } else {
          //       obj = {
          //         imgPath: 'assets/img/icon-pdf.png',
          //         docPath:`${this.Asseturl}/${result.carrierID}/${x}`
          //       }
          //     }
          //     this.docs.push(obj);
          //   });
          //   this.allPhotos = result.uploadedDocs;
          // }
          // this.orderData = result['Items'];

          // this.shipperReceiversInfo = this.orderData[0].shippersReceiversInfo;

          // this.shipperReceiversInfo.forEach(element => {
          //   element.shippers.forEach(item => {
          //     this.totalPickups++;
          //   });
          //   element.receivers.forEach(item1 => {
          //     this.totalDrops++;
          //   });
          // });

          // let originLength = this.orderData[0].shippersReceiversInfo[0].shippers.length - 1;
          // this.firstPickupPoint = this.orderData[0].shippersReceiversInfo[0].shippers[originLength].pickupLocation;

          // let lastParentLength = this.orderData[0].shippersReceiversInfo.length - 1;
          // this.lastDropPoint = this.orderData[0].shippersReceiversInfo[lastParentLength].receivers[this.orderData[0].shippersReceiversInfo[lastParentLength].receivers.length - 1].dropOffLocation;

          // this.totalMiles = this.orderData[0].milesInfo.totalMiles;
          // this.calculateBy = this.orderData[0].milesInfo.calculateBy;

          // this.charges = this.orderData[0].charges;
          // this.accessrialData = this.charges.accessorialFeeInfo.accessorialFee;
          // this.deductionsData = this.charges.accessorialDeductionInfo.accessorialDeduction;
          // this.totalFreightFee = this.orderData[0].charges.freightFee.amount;

          // this.getCurrency = this.orderData[0].charges.freightFee.currency;

          // this.totalFuelSurcharge = this.orderData[0].charges.fuelSurcharge.amount;
          // this.totalAccessotial = this.orderData[0].charges.accessorialFeeInfo.total;
          // this.totalAccessDeductions = this.orderData[0].charges.accessorialDeductionInfo.total
          // this.discountAmount = this.orderData[0].discount.amount;
          // this.discountAmtUnit = this.orderData[0].discount.unit;

          // this.orderData[0].taxesInfo.forEach(item => {
          //   this.totalTax += parseFloat(item.amount);
          // });
          // this.taxesData = this.orderData[0].taxesInfo;
          // this.totalAmount = this.orderData[0].totalAmount;


          // if(this.orderData[0].uploadedDocs != undefined && this.orderData[0].uploadedDocs.length > 0){
          //   this.orderDocs = this.orderData[0].uploadedDocs.map(x => ({path: `${this.Asseturl}/${this.orderData[0].carrierID}/${x}`, name: x}));
          // }

          


      }, (err) => {
      });
  }

   /*
   * Get all shippers's IDs of names from api
   */
  fetchShippersByIDs() {
    this.apiService.getData('contacts/get/list/consignor').subscribe((result: any) => {
      this.shippersObjects = result;
    });
  }

     /*
   * Get all receivers's IDs of names from api
   */
  fetchReceiversByIDs() {
    this.apiService.getData('contacts/get/list/consignee').subscribe((result: any) => {
      this.receiversObjects = result;
    });
  }

     /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByID() {
    this.apiService.getData(`contacts/detail/${this.customerID}`).subscribe((result: any) => {
      result = result.Items[0];
      this.customerName = `${result.companyName}`;

      if(result.address.length > 0) {
        if(result.address[0].manual) {
          this.customerAddress = result.address[0].address1;
        } else {
          this.customerAddress = result.address[0].userLocation;
        }
      }
      this.customerCityName = result.address[0].cityName;
      this.customerStateName = result.address[0].stateName;
      this.customerCountryName = result.address[0].countryName;
      this.customerPhone = result.workPhone;
      this.customerEmail = result.workEmail;
      // this.customerfax = result.additionalContact.fax;
    });
  }


  generatePDF() {
    var data = document.getElementById('print_wrap');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  previewModal() {
    $('#templateSelectionModal').modal('hide');
    setTimeout(function () {
      $('#previewInvoiceModal').modal('show');
    }, 500);
  }

  // delete uploaded images and documents
  async delete(type: string, name: string, index) {
    let record = {
      eventID: this.orderID,
      type: type,
      name: name,
      date: this.createdDate,
      time: this.createdTime
    }
    await this.apiService.postData(`orders/uploadDelete`, record).toPromise();
    if(type == 'attachment') {
      this.attachments.splice(index, 1);
    } else {
      this.docs.splice(index, 1);
    }
    this.toastr.error('Document deleted successfully');
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length-1];
    this.pdfSrc = '';
    if(ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url='+val+'&embedded=true');
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  
   /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    let files = [...event.target.files];
    let totalCount = this.docs.length+files.length;
    
    if(totalCount > 4) {
      this.uploadedDocs = [];
      $('#bolUpload').val('');
      this.toastr.error('Only 4 documents can be uploaded');
      return false;
    } else {

      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let name = element.name.split('.');
        let ext = name[name.length - 1];

        if (ext != 'jpg' && ext != 'jpeg' && ext != 'png' && ext != 'pdf') {
          $('#bolUpload').val('');
          this.toastr.error('Only image and pdf files are allowed');
          return false;
        }
      }

      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i])
      }

      // create form data instance
      const formData = new FormData();

      //append photos if any
      for (let i = 0; i < this.uploadedDocs.length; i++) {
        formData.append('uploadedDocs', this.uploadedDocs[i]);
      }

      this.apiService.postData(`orders/uploadDocs/${this.orderID}`, formData, true).subscribe((result: any) => {
        
        this.docs = [];
        if (result.length > 0) {
          for (let k = 0; k < result.length; k++) {
            const element = result[k];
            let name = element.split('.');
            let ext = name[name.length - 1];
            let obj = {
              imgPath: '',
              docPath: ''
            }
            if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
              obj = {
                imgPath: `${this.Asseturl}/${this.carrierID}/${element}`,
                docPath: `${this.Asseturl}/${this.carrierID}/${element}`
              }
            } else {
              obj = {
                imgPath: 'assets/img/icon-pdf.png',
                docPath: `${this.Asseturl}/${this.carrierID}/${element}`
              }
            }
            this.docs.push(obj);
            // this.docs.push(`${this.Asseturl}/${this.carrierID}/${element}`);
                    
            
          }
        }
        this.toastr.success('BOL/POD uploaded successfully');
        this.fetchOrder();
      })
    }
  }

  setSrcValue(){}

  caretClickShipper(i, j){
    if($('#shipperArea-' + i + '-' + j).children('i').hasClass('fa-caret-right')){
      $('#shipperArea-' + i + '-' + j).children('i').removeClass('fa-caret-right')
      $('#shipperArea-' + i + '-' + j).children('i').addClass('fa-caret-down');
    }
    else {
      $('#shipperArea-' + i + '-' + j).children('i').addClass('fa-caret-right')
      $('#shipperArea-' + i + '-' + j).children('i').removeClass('fa-caret-down');
    }
  }

  caretClickReceiver(i, j){
    if($('#receiverArea-' + i + '-' + j).children('i').hasClass('fa-caret-right')){
      $('#receiverArea-' + i + '-' + j).children('i').removeClass('fa-caret-right')
      $('#receiverArea-' + i + '-' + j).children('i').addClass('fa-caret-down');
    }
    else {
      $('#receiverArea-' + i + '-' + j).children('i').addClass('fa-caret-right')
      $('#receiverArea-' + i + '-' + j).children('i').removeClass('fa-caret-down');
    }
  }


  genInvoice() {
    
  }

  
}
