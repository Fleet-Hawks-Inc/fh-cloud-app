import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})

export class RouteListComponent implements AfterViewInit, OnDestroy, OnInit {
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = "Permanent Routes";
  routes = [];
  suggestedRoutes = [];
  // dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};
  lastEvaluated = {
    key: '',
    value: ''
  };

  searchedRouteId = '';
  searchedRouteName = '';

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  totalRecords = 10;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchRoutes();
    this.initDataTable();
  }

  fetchRoutes() {
    this.apiService.getData('routes/get/active').subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;
      }
    })
  }

  deleteRoute(routeID) {
    this.spinner.show();
    this.apiService.getData('routes/delete/' + routeID + '/1').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.rerender();
        this.spinner.hide();
        this.hasSuccess = true;
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
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
        {"targets": [7],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('routes/fetch-records?lastEvaluatedKey='+this.lastEvaluated.key+'&lastEvaluatedValue='+this.lastEvaluated.value+'&search='+this.searchedRouteId, dataTablesParameters).subscribe(resp => {
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
    };
  }

  getSuggestions(searchvalue='') {
    this.suggestedRoutes = [];
    if(searchvalue !== '') {
      this.apiService.getData('routes/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestedRoutes = [];
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];
  
            let obj = {
              id: element.routeID,
              name: element.routeName
            };
            this.suggestedRoutes.push(obj)
          }
        }
      })
    }    
  }

  searchSelectedRoute(route) {
    this.searchedRouteId = route.id;
    this.searchedRouteName = route.name;
    this.suggestedRoutes = [];

    this.rerender();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  resetFilter() {
    if(this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.searchedRouteId = '';
      this.searchedRouteName = '';
      this.rerender();
    }
    return false;
  }
}
