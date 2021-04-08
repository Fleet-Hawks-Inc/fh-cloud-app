import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  docs = [];
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
  creation = '';
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

  assetTypes = {};
  constructor(private apiService: ApiService, private domSanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.params['orderID'];
    this.fetchOrder();
    this.fetchShippersByIDs();
    this.fetchReceiversByIDs();
    this.fetchAssetTypes();
  }

  fetchAssetTypes(){
    this.apiService.getData('assetTypes/get/list').subscribe((result) => {
      this.assetTypes = result;
      console.log(this.assetTypes);

    });
  }
  

  /**
   * fetch Asset data
   */
  fetchOrder() {
    this.apiService
      .getData(`orders/${this.orderID}`)
      .subscribe((result: any) => {
          result = result.Items[0];
          this.customerID = result.customerID;
          this.customerPo = result.customerPO;
          this.reference = '';
          this.creation = `${result.creationDate } ${result.creationTime }`;
          this.additionalContactName = result.additionalContact;
          this.additionalPhone  = result.phone;
          this.additionalEmail = result.email;
          this.shipperReceiversInfos = result.shippersReceiversInfo;
          this.additionalDetails.dropTrailer = result.additionalDetails.dropTrailer;
          this.additionalDetails.loadType = result.additionalDetails.loadType;
          this.additionalDetails.refeerTemp = result.additionalDetails.refeerTemp;
          this.additionalDetails.trailerType = result.additionalDetails.trailerType;
          this.additionalDetails.uploadedDocs = result.additionalDetails.uploadedDocs;
          this.charges.freightFee = result.charges.freightFee;
          this.discount = result.discount;
          this.milesInfo = result.milesInfo;
          this.taxesInfo = result.taxesInfo;
          this.orderNumber = result.orderNumber;
          this.orderMode = result.orderMode;

          for(let i = 0; i < this.taxesInfo.length; i++){
            if(this.taxesInfo[i].amount){
              this.taxesTotal = this.taxesTotal + this.taxesInfo[i].amount;
            }
          }

          let freightFee = isNaN(this.charges.freightFee.amount) ? 0 : this.charges.freightFee.amount;
          let fuelSurcharge = isNaN(this.charges.fuelSurcharge.amount) ? 0 : this.charges.fuelSurcharge.amount;
          let accessorialFeeInfo = isNaN(this.charges.accessorialFeeInfo.amount) ? 0 : this.charges.accessorialFeeInfo.amount;
          let accessorialDeductionInfo = isNaN(this.charges.accessorialDeductionInfo.amount) ? 0 : this.charges.accessorialDeductionInfo.amount;

          console.log('freightFee', freightFee);
          console.log('fuelSurcharge',fuelSurcharge);
          console.log('accessorialFeeInfo', accessorialFeeInfo);
          console.log('accessorialDeductionInfo', accessorialDeductionInfo);
          console.log('tax', this.taxesTotal);

          this.totalCharges = parseInt(freightFee) + parseInt(fuelSurcharge) + parseInt(accessorialFeeInfo) + parseInt(accessorialDeductionInfo) + parseInt(this.taxesTotal);
          this.advances = result.advance;
          this.balance = this.totalCharges - this.advances;

          if (
            result.uploadedDocs != undefined &&
            result.uploadedDocs.length > 0
          ) {
            this.docs = result.uploadedDocs.map(
              (x) => `${this.Asseturl}/${result.carrierID}/${x}`
            );
          }
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
        
          this.fetchCustomersByID();

        
      }, (err) => {        
      });
  }

   /*
   * Get all shippers's IDs of names from api
   */
  fetchShippersByIDs() {
    this.apiService.getData('shippers/get/list').subscribe((result: any) => {
      this.shippersObjects = result;
    });
  }

     /*
   * Get all receivers's IDs of names from api
   */
  fetchReceiversByIDs() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.receiversObjects = result;
    });
  }

     /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByID() {
    this.apiService.getData(`customers/${this.customerID}`).subscribe((result: any) => {
      result = result.Items[0];

      this.customerName = `${result.firstName} ${result.lastName}`
      this.customerAddress = result.address[0].address1;
      this.customerCityName = result.address[0].cityName;
      this.customerStateName = result.address[0].stateName;
      this.customerCountryName = result.address[0].countryName;
      this.customerPhone = result.address[0].phone;
      this.customerEmail = result.address[0].email;
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
  delete(type: string,name: string){
    this.apiService.deleteData(`orders/uploadDelete/${this.orderID}/${type}/${name}`).subscribe((result: any) => {
      this.fetchOrder();
    });
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
    
    for (let i = 0; i < files.length; i++) {
      this.uploadedDocs.push(files[i])
    }
 

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.localPhotos.push(e.target.result);
        }
        reader.readAsDataURL(files[i]);
      }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedDocs.length; i++){
      formData.append('uploadedDocs', this.uploadedDocs[i]);
    }

    this.apiService.postData(`orders/uploadDocs/${this.orderID}`, formData, true).subscribe((result) => {

    })
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
}
