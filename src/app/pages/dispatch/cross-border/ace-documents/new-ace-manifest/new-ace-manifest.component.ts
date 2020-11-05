import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-new-ace-manifest',
  templateUrl: './new-ace-manifest.component.html',
  styleUrls: ['./new-ace-manifest.component.css']
})
export class NewAceManifestComponent implements OnInit {
  vehicles = [];
  assets = [];
  trips = [];
  drivers = [];
  date: NgbDateStruct;
  // time: NgbTimeStruct;
  time;
  errors = {};
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  USports: any = [];
  constructor(private httpClient: HttpClient,
              private apiService: ApiService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit() {
    this.fetchVehicles();
    this.fetchAssets();
    this.fetchTrips();
    this.fetchDrivers();
    this.httpClient.get('assets/USports.json').subscribe(data => {
      console.log('Data', data);
      this.USports = data;
    });
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
         this.vehicles = result.Items; });
    }
    fetchAssets() {
      this.apiService.getData('assets').subscribe((result: any) => {
        this.assets = result.Items;
        console.log('assets', this.assets);
      });
    }
    fetchTrips() {
      this.apiService.getData('trips').subscribe((result: any) => {
        this.trips = result.Items;
        console.log('TRIPS', this.trips);
      });
    }
    fetchDrivers() {
      this.apiService.getData('drivers').subscribe((result: any) => {
        this.drivers = result.Items;
        console.log('Drivers', this.drivers);
      });
    }
    showDate() {
      console.log('Date', this.date);
    }
}
