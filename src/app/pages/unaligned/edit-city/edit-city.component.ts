import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {

  title = 'Edit City';

  errors = {};
  form;
  stateID = '';
  states = [];
  state = '';

  /********** Form Fields ***********/

  cityID ='';
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

    this.cityID = this.route.snapshot.params['cityID'];

    this.apiService.getData('cities/' + this.cityID)
      .subscribe((result: any) => {
        //console.log(result);
        result = result.Items[0];
        this.cityName = result.cityName;
        this.stateID = result.stateID;

        this.timeCreated = result.timeCreated;

      });



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

  updateCity() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "cityID": this.cityID,
      "stateID": this.stateID,
      "cityName": this.cityName,
      "timeCreated": this.timeCreated
    }

    this.apiService.putData('cities', data)
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
          this.Success = 'City Updated successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}
