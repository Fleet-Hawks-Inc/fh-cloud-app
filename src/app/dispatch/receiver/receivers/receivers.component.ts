import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.css']
})
export class ReceiversComponent implements OnInit {

  title = 'Receiver List';
  receivers = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchReceivers();

  }

  fetchReceivers() {
    this.apiService.getData('receivers')
    .subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.receivers = result.Items;
      },
    });
  }



  deleteReceiver(receiverID) {

            /******** Clear DataTable ************/
            if ($.fn.DataTable.isDataTable('#datatable-default')) {
              $('#datatable-default').DataTable().clear().destroy();
              }
              /******************************/

    this.apiService.deleteData('receivers/' + receiverID)
        .subscribe((result: any) => {
          this.fetchReceivers();
        })
  }
  
  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}
