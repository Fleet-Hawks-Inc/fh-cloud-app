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
  suggestedRoutes = [];
  searchedRouteId = '';
  searchedRouteName = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';
  totalRecords = 20;
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

  searchFilter() {
    if(this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.searchedRouteName !== '' || this.searchedRouteId !== '') {
      this.searchedRouteId = '';
      this.searchedRouteName = '';
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
    this.routeDraw += 1;
    this.initDataTable();
    this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.routeDraw -= 1;
    this.lastEvaluatedKey = this.routePrevEvauatedKeys[this.routeDraw];
    this.initDataTable();
    this.getStartandEndVal();
  }

  resetCountResult() {
    this.routeStartPoint = 1;
    this.routeEndPoint = this.pageLength;
    this.routeDraw = 0;
  }
}
