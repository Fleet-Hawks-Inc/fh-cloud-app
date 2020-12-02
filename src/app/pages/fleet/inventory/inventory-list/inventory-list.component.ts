import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  items = [];
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItems();
  }


  openTransferModal(){
    $('#transferModal').modal('show');
  }

  fetchItems(){
    this.apiService.getData('items').subscribe((result) => {
      this.items = result.Items;
    })
  }

}
