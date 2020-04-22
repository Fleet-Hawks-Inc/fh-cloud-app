import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-add-geofence',
  templateUrl: './add-geofence.component.html',
  styleUrls: ['./add-geofence.component.css']
})
export class AddGeofenceComponent implements OnInit {
  title = 'Add Geofencing';

  errors = {};
  form;

  /********** Form Fields ***********/

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
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addGeofence() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "fenceName": this.fenceName,
      "location": this.location,
      "description": this.description
    };

    this.apiService.postData('geofences', data)
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
            .subscribe({
              complete : () => { this.throwErrors(); },
              error : () => {},
              next: () => {}
        });

        },
        next: (res) => {
          this.fenceName = '';
          this.location = '';
          this.description = '';

          this.response = res;
          this.hasSuccess = true;
          this.Success = 'Geofence Added successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
