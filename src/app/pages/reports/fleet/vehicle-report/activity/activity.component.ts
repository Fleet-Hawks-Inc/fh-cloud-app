import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import Constants from 'src/app/pages/fleet/constants';
import { environment } from '../../../../../../environments/environment';
import { OnboardDefaultService } from '../../../../../services/onboard-default.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  allData = [];
  vehicleData = []
  startDate = '';
  endDate = '';
  start = null;
  end = null;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  public vehicleId;
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchVehicleListing();
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');
  }



  fetchVehicleListing() {
    this.apiService.getData(`vehicles/fetch/TripData?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.allData = result.Items;
    
    });
  }

  searchFilter() {
    if (this.start != null && this.end != null) {
      if (this.start != null && this.end == null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start == null && this.end != null) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.start > this.end) {
        this.toastr.error('Start Date should be less then end date.');
        return false;
      }
      else {
  
        this.allData = []
        this.fetchVehicleListing()
      }
    }
    else {
      return false;
    }
  }

}
