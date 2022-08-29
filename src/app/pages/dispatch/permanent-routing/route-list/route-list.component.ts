import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Constants from '../../../fleet/constants';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

declare var $: any;

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})

export class RouteListComponent implements OnInit {
  @ViewChild("dt") table: Table;
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  title = "Permanent Routes";
  routes = [];
  suggestedRoutes = [];
  searchedRouteId = '';
  searchedRouteName = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  totalRecords = 10;
  pageLength = 10;
  lastEvaluatedKey = '';
  routesLength = 0;
  routeNext = false;
  routePrev = true;
  routeDraw = 0;
  routePrevEvauatedKeys = [''];
  routeStartPoint = 1;
  routeEndPoint = this.pageLength;
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  loaded = false;
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchRoutes();

    this.dataColumns = [

      { field: 'routeName', header: 'Route Name', type: "text" },
      { field: 'sourceInfo.address', header: 'Source Location', type: "text" },
      { field: 'destInfo.address', header: 'Destination Location', type: "text" },
      { field: 'miles', header: 'Miles', type: "text" },
      { field: 'recurring.type', header: 'Recurring', type: "text" },
    ];

    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }


  fetchRoutes() {
    this.apiService.getData('routes/get/count?search=' + this.searchedRouteId).subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.searchedRouteId != '') {
          this.routeEndPoint = result.Count;
        }
        this.initDataTable();
      },
    });
  }

  deleteRoute(routeID, routeNo) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService.deleteData(`routes/delete/${routeID}/${routeNo}`).subscribe({
        complete: () => { },
        error: () => { },
        next: (result: any) => {
          this.routes = [];
          this.dataMessage = Constants.FETCHING_DATA;
          this.routeDraw = 0;
          this.lastEvaluatedKey = '';
          this.fetchRoutes();
          this.hasSuccess = true;
          this.toastr.success('Route deleted successfully.');
        }
      })
    }
  }

  initDataTable() {
    if (this.lastEvaluatedKey !== 'end') {
      this.apiService.getData(`routes/fetch/records?search=${this.searchedRouteId}&lastEvaluatedKey=${this.lastEvaluatedKey}`).subscribe((result: any) => {

        this.dataMessage = Constants.FETCHING_DATA
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
          this.loaded = true;
        }
        if (result.Items.length > 0) {

          if (result.LastEvaluatedKey !== undefined) {
            this.lastEvaluatedKey = encodeURIComponent(result.Items[result.Items.length - 1].routeSK);
          }
          else {
            this.lastEvaluatedKey = 'end'
          }
          this.routes = this.routes.concat(result.Items)

          this.loaded = true;
        }

      });
    }
  }

  getSuggestions = _.debounce(function (searchvalue) {
    this.suggestedRoutes = [];
    this.searchedRouteId = '';
    if (searchvalue !== '') {
      searchvalue = searchvalue.toLowerCase();
      this.apiService.getData('routes/get/suggestions/' + searchvalue).subscribe({
        complete: () => { },
        error: () => { },
        next: (result: any) => {
          this.suggestedRoutes = result;
        }
      })
    }
  }, 800)

  searchSelectedRoute(route) {
    this.searchedRouteId = route.routeName;
    this.searchedRouteName = route.routeName;
    this.suggestedRoutes = [];
  }

  searchFilter() {
    if (this.searchedRouteName !== '') {
      this.searchedRouteName = this.searchedRouteName.toLowerCase();
      if (this.searchedRouteId == '') {
        this.searchedRouteId = this.searchedRouteName;
      }
      this.routes = [];
      this.suggestedRoutes = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchRoutes();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.searchedRouteId = '';
      this.searchedRouteName = '';
      this.routes = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.suggestedRoutes = [];
      this.fetchRoutes();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  getStartandEndVal() {
    this.routeStartPoint = this.routeDraw * this.pageLength + 1;
    this.routeEndPoint = this.routeStartPoint + this.pageLength - 1;
  }

  resetCountResult() {
    this.routeStartPoint = 1;
    this.routeEndPoint = this.pageLength;
    this.routeDraw = 0;
  }

  refreshData() {
    this.searchedRouteId = '';
    this.searchedRouteName = '';
    this.routes = [];
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.suggestedRoutes = [];
    this.fetchRoutes();
    this.resetCountResult();
  }
  clear(table: Table) {
    table.clear();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchRoutes();
    }
    this.loaded = false;
  }
}
