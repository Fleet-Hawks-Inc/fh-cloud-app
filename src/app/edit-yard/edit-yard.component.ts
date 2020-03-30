import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-yard',
  templateUrl: './edit-yard.component.html',
  styleUrls: ['./edit-yard.component.css']
})
export class EditYardComponent implements OnInit {
  title = 'Edit Yard';

  /********** Form Fields ***********/

  geoLocationLat = '';
  geoLocationLong = '';
  geofence = '';
  addressID = '';
  timeZone = '';
  /******************/

  yardID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.yardID = this.route.snapshot.params['yardID'];

    this.apiService.getData('yards/' + this.yardID)
        .subscribe((result: any) => {
          result = result.Items[0];
          this.geoLocationLat = result.geolocation.lat;
          this.geoLocationLong = result.geolocation.long;
          this.geofence = result.geofence;
          this.addressID = result.addressID;
          this.timeZone = result.timeZone;


        });

  }




  updateYard() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "yardID": this.yardID,
      "geolocation": {
        "lat": this.geoLocationLat,
        "long": this.geoLocationLong
      },
      "geofence": this.geofence,
      "addressID": this.addressID,
      "timeZone": this.timeZone

    };

    this.apiService.putData('yards', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Yard Updated successfully';

      }
    });
  }
}
