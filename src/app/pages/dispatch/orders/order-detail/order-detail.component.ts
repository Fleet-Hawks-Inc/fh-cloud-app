import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  Asseturl = this.apiService.AssetUrl;
  orderID: string;
  orderData;
  shipperReceiversInfo = [];
  charges : any;
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

  constructor(private apiService: ApiService, private domSanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.params['orderID'];
    this.fetchOrder();
    this.fetchShippersByIDs();
    this.fetchReceiversByIDs();
    this.fetchCustomersByIDs();
  }

  /**
   * fetch Asset data
   */
  fetchOrder() {
    this.apiService
      .getData(`orders/${this.orderID}`)
      .subscribe((result: any) => {
        if (result) {
          this.orderData = result['Items'];
          
          this.shipperReceiversInfo = this.orderData[0].shippersReceiversInfo;

          this.shipperReceiversInfo.forEach(element => {
            element.shippers.forEach(item => {
              this.totalPickups++;
            });
            element.receivers.forEach(item1 => {
              this.totalDrops++;
            });
          });
          
          let originLength = this.orderData[0].shippersReceiversInfo[0].shippers.length - 1;
          this.firstPickupPoint = this.orderData[0].shippersReceiversInfo[0].shippers[originLength].pickupLocation;

          let lastParentLength = this.orderData[0].shippersReceiversInfo.length - 1;
          this.lastDropPoint = this.orderData[0].shippersReceiversInfo[lastParentLength].receivers[this.orderData[0].shippersReceiversInfo[lastParentLength].receivers.length - 1].dropOffLocation;
         
          this.totalMiles = this.orderData[0].milesInfo.totalMiles;
          this.calculateBy = this.orderData[0].milesInfo.calculateBy;

          this.charges = this.orderData[0].charges;
          this.accessrialData = this.charges.accessorialFeeInfo.accessorialFee;
          this.deductionsData = this.charges.accessorialDeductionInfo.accessorialDeduction;
          this.totalFreightFee = this.orderData[0].charges.freightFee.amount;

          this.getCurrency = this.orderData[0].charges.freightFee.currency;

          this.totalFuelSurcharge = this.orderData[0].charges.fuelSurcharge.amount;
          this.totalAccessotial = this.orderData[0].charges.accessorialFeeInfo.total;
          this.totalAccessDeductions = this.orderData[0].charges.accessorialDeductionInfo.total
          this.discountAmount = this.orderData[0].discount.amount;
          this.discountAmtUnit = this.orderData[0].discount.unit;
          
          this.orderData[0].taxesInfo.forEach(item => {
            this.totalTax += parseFloat(item.amount);
          });
          this.taxesData = this.orderData[0].taxesInfo;
          this.totalAmount = this.orderData[0].totalAmount;


          if(this.orderData[0].uploadedDocs != undefined && this.orderData[0].uploadedDocs.length > 0){
            this.orderDocs = this.orderData[0].uploadedDocs.map(x => ({path: `${this.Asseturl}/${this.orderData[0].carrierID}/${x}`, name: x}));
          }     

        }
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
  fetchCustomersByIDs() {
    this.apiService.getData('customers/get/list').subscribe((result: any) => {
      this.customersObjects = result;
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
}
