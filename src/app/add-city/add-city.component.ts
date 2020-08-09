import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {

  title = 'Add City';

  errors = {};
  form;
  stateID = '';
  states = [];


  /********** Form Fields ***********/


  cityName = '';
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

    this.fetchStates();

   // this.stateID = this.route.snapshot.params['stateID'];

    // this.apiService.getData('states/' + this.stateID)
    //   .subscribe((result: any) => {
    //     //console.log(result);
    //     result = result.Items[0];
    //     this.cityName = result.stateName;
    //     this.timeCreated = result.timeCreated;
    //
    //   });



    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }



  fetchStates(){
    this.apiService.getData('states')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  addCity() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {

      "stateID": this.stateID,
      "cityName": this.cityName,

    }
  // https://fleetservice.us-east-2.fleethawks.com/api/v1/cities
    this.apiService.postData('cities', data)
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
          this.cityName = '';
          this.response = res;
          this.hasSuccess = true;
          this.Success = 'City Added successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
