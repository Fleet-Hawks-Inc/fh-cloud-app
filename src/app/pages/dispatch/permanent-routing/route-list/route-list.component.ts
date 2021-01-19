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

  searchedRouteId = '';
  searchedRouteName = '';

  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

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
    this.apiService.getData('routes/delete/' + routeID + '/'+1).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.rerender();
        this.spinner.hide();
        this.hasSuccess = true;
        this.toastr.success('Route deleted successfully.');
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
        {"targets": [0,1,2,3,4,5,6,7],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('routes/fetch-records?lastEvaluatedKey='+this.lastEvaluatedKey+'&search='+this.searchedRouteId, dataTablesParameters).subscribe(resp => {
          
          this.routes = resp['Items'].map((i) => { 
            i.stopNames = '';
            if(i.stops) {
              let ind = 1;
              i.stops.map((j) => {
                i.stopNames += ind + '. '+j.stopName+' ';
                ind++;
              })
            }
            return i;
          });
          if(resp['LastEvaluatedKey'] !== undefined){
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].routeID
          } else {
            this.lastEvaluatedKey = ''
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
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if(this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.rerender('reset');
    }
    return false;
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
