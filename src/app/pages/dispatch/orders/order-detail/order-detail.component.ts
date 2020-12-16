import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderID;
  orderData;
  shipperData;
  consineeData;
  selectedItem = 0;
  templateList = [
    'assets/img/invoice.png',
    'assets/img/invoice.png'
  ]

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.params['orderID'];
    this.fetchOrder();
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
          console.log('this.orderData', this.orderData);
          this.shipperData = this.orderData[0].shipperInfo;
          this.consineeData = this.orderData[0].receiverInfo;
        }
      }, (err) => {
        console.log('order detail', err);
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

}
