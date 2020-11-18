import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
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
  // dtOptions: any = {};
  dtOptions: DataTables.Settings = {};
  lastEvaluated = {
    key: '',
    value: ''
  };

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  totalRecords = 10;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    this.fetchRoutes();
    this.initDataTable();
  }

  fetchRoutes() {
    this.spinner.show();
    this.apiService.getData('routes').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.spinner.hide();
        console.log(result);
        // for (let i = 0; i < result.Items.length; i++) {
        //   if (result.Items[i].isDeleted == '0') {
        //     this.routes.push(result.Items[i])
        //   }

        // }
        // this.routes = result.Items;
        this.totalRecords = result.Count;
        console.log(this.routes);
      }
    })
  }

  deleteRoute(routeID) {
    this.spinner.show();
    this.apiService.getData('routes/delete/' + routeID + '/1').subscribe({
      complete: () => {
        // this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
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

    let current = this;
    
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('routes/fetch-records?lastEvaluatedKey='+this.lastEvaluated.key+'&lastEvaluatedValue='+this.lastEvaluated.value, dataTablesParameters).subscribe(resp => {
          this.routes = resp['Items'];
          if(resp['LastEvaluatedKey'] !== undefined){
            this.lastEvaluated = {
              key : 'routeID',
              value : resp['LastEvaluatedKey'].routeID
            }
          } else {
            this.lastEvaluated = {
              key : '',
              value : ''
            }
          }
          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      },
      // colReorder: true,
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
