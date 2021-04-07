import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import  Constants  from '../../../fleet/constants';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})

export class RouteListComponent implements OnInit {
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

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchRoutes();
    this.initDataTable();
  }

  fetchRoutes() {
    this.apiService.getData('routes/get/count?search=' + this.searchedRouteId).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  deleteRoute(routeID) {
    this.spinner.show();
    this.apiService.getData('routes/delete/' + routeID + '/'+1).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.routeDraw = 0;
        this.lastEvaluatedKey = '';
        this.fetchRoutes();
        this.initDataTable();
        this.spinner.hide();
        this.hasSuccess = true;
        this.toastr.success('Route deleted successfully.');
      }
    })
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('routes/fetch/records?search=' + this.searchedRouteId + '&lastEvaluatedKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedRoutes = [];
        this.getStartandEndVal();

        this.routes = result['Items'];
        if (this.searchedRouteId != '') {
          this.routeStartPoint = 1;
          this.routeEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.routeNext = false;
          // for prev button
          if (!this.routePrevEvauatedKeys.includes(result['LastEvaluatedKey'].routeID)) {
            this.routePrevEvauatedKeys.push(result['LastEvaluatedKey'].routeID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].routeID;
          
        } else {
          this.routeNext = true;
          this.lastEvaluatedKey = '';
          this.routeEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.routeDraw > 0) {
          this.routePrev = false;
        } else {
          this.routePrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  getSuggestions(searchvalue='') {
    this.suggestedRoutes = [];
    this.searchedRouteId = '';
    if(searchvalue !== '') {
      searchvalue = searchvalue.toLowerCase();
      this.apiService.getData('routes/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestedRoutes = result.Items;
        }
      })
    }    
  }

  searchSelectedRoute(route) {
    this.searchedRouteId = route.routeName;
    this.searchedRouteName = route.routeName;
    this.suggestedRoutes = [];
  }

  searchFilter() {
    if(this.searchedRouteName !== '') {
      if(this.searchedRouteId == '') {
        this.searchedRouteId = this.searchedRouteName;
      }
      this.routes = [];
      this.suggestedRoutes = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchRoutes();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.searchedRouteId = '';
      this.searchedRouteName = '';
      this.routes = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.suggestedRoutes = [];
      this.fetchRoutes();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  getStartandEndVal() {
    this.routeStartPoint = this.routeDraw * this.pageLength + 1;
    this.routeEndPoint = this.routeStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.routeNext = true;
    this.routePrev = true;
    this.routeDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.routeNext = true;
    this.routePrev = true;
    this.routeDraw -= 1;
    this.lastEvaluatedKey = this.routePrevEvauatedKeys[this.routeDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.routeStartPoint = 1;
    this.routeEndPoint = this.pageLength;
    this.routeDraw = 0;
  }
}
