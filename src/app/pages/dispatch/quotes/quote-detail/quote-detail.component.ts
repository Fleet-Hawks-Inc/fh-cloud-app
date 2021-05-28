import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.css']
})
export class QuoteDetailComponent implements OnInit {
  quoteID;
  quoteData;
  orderMode;
  shipperInfo;
  receiverInfo;
  freightInfo;
  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.quoteID = this.route.snapshot.params['quoteID'];
    this.fetchQuote();
  }


  /**
   * fetch Asset data
   */
  fetchQuote() {
    this.apiService
      .getData(`quotes/${this.quoteID}`)
      .subscribe((result: any) => {
        if (result) {
          result = result.Items;
          this.quoteData = result;
          // this.quoteData = result['Items'][0];
          this.orderMode = this.quoteData[0].orderMode;
          this.shipperInfo = this.quoteData[0].shipperInfo;
          this.receiverInfo = this.quoteData[0].receiverInfo;
          this.freightInfo = this.quoteData[0].freightInfo;
          
        }
      }, (err) => {
        
      });
  }
}
