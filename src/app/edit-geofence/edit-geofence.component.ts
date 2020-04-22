import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-edit-geofence',
  templateUrl: './edit-geofence.component.html',
  styleUrls: ['./edit-geofence.component.css']
})
export class EditGeofenceComponent implements OnInit {

  title = 'Edit Geofence';

  errors = {};
  form;

  /********** Form Fields ***********/

  geofenceID ='';
  fenceName = '';
  location = '';
  description = '';
  timeCreated = '';


  /******************/

  response : any = '';
  hasError =  false;
  hasSuccess =   false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {

    this.geofenceID = this.route.snapshot.params['fenceID'];

    this.apiService.getData('geofences/' + this.geofenceID)
      .subscribe((result: any) => {
        //console.log(result);
        result = result.Items[0];
        this.fenceName = result.fenceName;
        this.location = result.location;
        this.description = result.description;
        this.timeCreated = result.timeCreated

      });



    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  updateGeofence() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "geofenceID": this.geofenceID,
      "fenceName": this.fenceName,
      "location": this.location,
      "description": this.description,
      "timeCreated": this.timeCreated
    };

    this.apiService.putData('geofences', data)
      .subscribe({
        complete : () => {},
        error : (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              }),
            )
            .subscribe((val) => {
              this.throwErrors();
            });

        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Geofence Updated successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
