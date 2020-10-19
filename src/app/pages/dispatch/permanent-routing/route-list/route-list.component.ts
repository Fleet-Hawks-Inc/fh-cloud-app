import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit {
  title = "Permanent Routes";
  routes = [];
  dtOptions: any = {};

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, 
    private spinner: NgxSpinnerService,) {}

  ngOnInit() {
    this.fetchRoutes();
    this.initDataTable();
  }

  fetchRoutes(){
    this.spinner.show();
    this.apiService.getData('routes').subscribe({
      complete: () =>{
        this.initDataTable();
      },
      error: () => {},
      next: (result:any) =>{
        this.spinner.hide();
        console.log(result);
        for (let i = 0; i < result.Items.length; i++) {
          if(result.Items[i].isDeleted == '0'){
            this.routes.push(result.Items[i])
          }
          
        }
        // this.routes = result.Items;
        console.log(this.routes);
      }
    })
  }

  deleteRoute(routeID){
    this.spinner.show();
    this.apiService.getData('routes/delete/'+routeID+'/1').subscribe({
      complete: () =>{
        // this.initDataTable();
      },
      error: () => {},
      next: (result:any) =>{
        this.fetchRoutes();
        // this.initDataTable();
        this.spinner.hide();
        this.hasSuccess = true;
        // this.router.navigateByUrl('/dispatch/routes/route-list');
        this.toastr.success('Route deleted successfully');
      }
    })
  }

  initDataTable() {
    
    this.dtOptions = { // All list options
      pageLength: 10,
      processing: true,
      // select: {
      //     style:    'multi',
      //     selector: 'td:first-child'
      // },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: true,
      columnDefs: [
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
        }
    ],
    };
  }
  

}
