import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
  }


  openTransferModal(){
    $('#transferModal').show();
  }

}
