import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {
  title = 'Driver List';
  users = [];
  dtOptions: any = {};

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getData('users/userType/driver').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.users = result.Items;
      },
    });
  }

  deleteUser(userName) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
      }
      /******************************/

    this.apiService.deleteData('users/' + userName).subscribe((result: any) => {
      this.fetchUsers();
    });
  }

  initDataTable() {
    this.dtOptions = {
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 4,
              className: 'noVis'
          }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }
}
