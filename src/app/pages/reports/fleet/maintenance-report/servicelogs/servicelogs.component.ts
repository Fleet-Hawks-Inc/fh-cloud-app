import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import Constants from 'src/app/pages/fleet/constants';
@Component({
  selector: 'app-servicelogs',
  templateUrl: './servicelogs.component.html',
  styleUrls: ['./servicelogs.component.css']
})
export class ServicelogsComponent implements OnInit {
  allData = [];
  vendorsObject: any = {};
  tasks = [];
  vehicleID = null;
  vehiclesObject: any = {};
  dataMessage: string = Constants.FETCHING_DATA;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchServicelogs();
    this.fetchAllVendorsIDs();
    this.fetchAllVehiclesIDs();

  }
  fetchServicelogs() {
    this.apiService.getData(`serviceLogs/fetch/serviceLogReport?vehicleID${this.vehicleID}`).subscribe((result: any) => {
      this.allData = result.Items;
      console.log('this.allData', this.allData)
      result['Items'].map((v: any) => {
        v.entityStatus = 'Active';
        if (v.currentStatus === 'outOfService') {
          v.entityStatus = 'Out of service';
        } else if (v.currentStatus === 'active') {
          v.entityStatus = 'Active';
        } else if (v.currentStatus === 'inActive') {
          v.entityStatus = 'In-active';
        } else if (v.currentStatus === 'sold') {
          v.entityStatus = 'Sold';
        }
      })
    })
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('contacts/get/list/vendor')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchTasks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      this.tasks = result.Items;
    });
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
        console.log('this vehicleObject', this.vehiclesObject)
      });
  }
  searchFilter() {
    if (this.vehicleID != null) {
      this.allData = []
      this.dataMessage = Constants.FETCHING_DATA
      this.fetchServicelogs()
    }
  }

}
