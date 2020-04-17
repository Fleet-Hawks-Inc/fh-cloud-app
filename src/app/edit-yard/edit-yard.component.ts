import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-edit-yard',
  templateUrl: './edit-yard.component.html',
  styleUrls: ['./edit-yard.component.css']
})
export class EditYardComponent implements OnInit, AfterViewInit {
  title = 'Edit Yard';

  errors = {};
  form;

  /********** Form Fields ***********/

  yardName = '';
  description = '';
  latitude = '';
  longitude = '';
  geofence = '';
  state = '';
  country = '';

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
          this.yardName = result.yardName;
          this.description = result.description;
          this.latitude = result.geolocation.latitude;
          this.longitude = result.geolocation.longitude;
          this.geofence = result.geofence;
          this.state = result.state;
          this.country = result.country;


        });

  }


  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }


  updateYard() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "yardID": this.yardID,
      "yardName" : this.yardName,
      "description": this.description,
      "geolocation": {
        "latitude": this.latitude,
        "longitude": this.longitude
      },
      "geofence": this.geofence,
      "state": this.state,
      "country" : this.state
    };

    this.apiService.putData('yards', data)
      .pipe(
        catchError((err) => {
          return from(err.error)
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
          val.message = val.message.replace(/".*"/, 'This Field');
          this.errors[val.context.key] = val.message ;
        }),
      )
      .subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        if (!$.isEmptyObject(this.errors)) {
          return this.throwErrors();
        }


        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Yard Updated successfully';

      }
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
