import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-item-group-list',
  templateUrl: './item-group-list.component.html',
  styleUrls: ['./item-group-list.component.css'],
})
export class ItemGroupListComponent implements OnInit {
  title = 'Item Group List';
  itemGroups = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItemGroups();
  }

  fetchItemGroups() {
    this.apiService.getData('itemGroups').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.itemGroups = result.Items;
      },
    });
  }

  deleteItemGroup(groupId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('itemGroups/' + groupId)
      .subscribe((result: any) => {
        this.fetchItemGroups();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
