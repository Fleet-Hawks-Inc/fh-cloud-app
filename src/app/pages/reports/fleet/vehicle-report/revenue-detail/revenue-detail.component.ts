import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
@Component({
  selector: 'app-revenue-detail',
  templateUrl: './revenue-detail.component.html',
  styleUrls: ['./revenue-detail.component.css']
})
export class RevenueDetailComponent implements OnInit {
  // vehicleId = null;
  start = null;
  end = null;
  allData = [];
  vehicleData = [];
  public vehicleId;
  constructor(private apiService: ApiService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.end = moment().format("YYYY-MM-DD");
    this.start = moment().subtract(1, 'months').format('YYYY-MM-DD');

    this.vehicleId = this.route.snapshot.params[`vehicleId`];
    this.fetchTripData()
    this.fetchVehicleName()
    console.log(' this.vehicleId', this.vehicleId)
  }
  fetchVehicleName() {
    this.apiService.getData(`vehicles/fetch/detail/${this.vehicleId}`).subscribe((result: any) => {
      this.vehicleData = result.Items;
    });
  }
  fetchTripData() {
    this.apiService.getData(`vehicles/fetch/TripData?vehicle=${this.vehicleId}&startDate=${this.start}&endDate=${this.end}`).subscribe((result: any) => {
      this.allData = result.Items
      console.log(' this.allData', this.allData)
    })
  }
}
