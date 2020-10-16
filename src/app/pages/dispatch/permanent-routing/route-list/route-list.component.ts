import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit {
  title = "Permanent Routes";
  routes = [];
  dtOptions: any = {};

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchRoutes();
    this.initDataTable();
  }

  fetchRoutes(){
    this.apiService.getData('routes').subscribe({
      complete: () =>{
        // this.initDataTable();
      },
      error: () => {},
      next: (result:any) =>{
        console.log(result);
        this.routes = result.Items;
        console.log(this.routes);
      }
    })
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
          },
          {
              targets: 5,
              className: 'noVis'
          },
          {
              targets: 6,
              className: 'noVis'
          },
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
