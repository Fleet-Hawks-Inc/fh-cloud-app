import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services';
declare var $: any;

@Component({
  selector: 'app-payment-cheque',
  templateUrl: './payment-cheque.component.html',
  styleUrls: ['./payment-cheque.component.css']
})
export class PaymentChequeComponent implements OnInit {
  @ViewChild("content", {static: true}) modalContent: TemplateRef<any>;
  constructor( private listService: ListService, 
    private modalService: NgbModal) {
    this.listService.paymentModelList.subscribe((res: any) => {
      console.log('modal open', res);
      if(res.chequeDate !== '' && res.length != 0) {
        this.modalService.open(this.modalContent).result.then((result) => {
        }, (reason) => {
        });
      }
    })
   }

  ngOnInit() {
  }

  prevCheck() {
    this.modalService.dismissAll();
    $('#chequeModal').modal('show');
  }

}
