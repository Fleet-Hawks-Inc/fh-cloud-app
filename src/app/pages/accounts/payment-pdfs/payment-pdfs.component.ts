import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-payment-pdfs',
  templateUrl: './payment-pdfs.component.html',
  styleUrls: ['./payment-pdfs.component.css']
})
export class PaymentPdfsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  async generatePaymentPDF() {
    var data = document.getElementById('driver_pay_pdf');
    html2pdf(data, {
      margin:       0,
      filename:     `driver-pay.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  }

}
