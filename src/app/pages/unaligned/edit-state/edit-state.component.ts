import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-edit-state',
  templateUrl: './edit-state.component.html',
  styleUrls: ['./edit-state.component.css']
})
export class EditStateComponent implements OnInit {

  title = 'Edit State';

  errors = {};
  form;
  stateID = '';
  countries = [];
  country = '';

  /********** Form Fields ***********/

  stateCode ='';
  stateName = '';
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

    this.fetchCountries();

    this.stateID = this.route.snapshot.params['stateID'];

    this.apiService.getData('states/' + this.stateID)
      .subscribe((result: any) => {
        //console.log(result);
        result = result.Items[0];
        this.stateName = result.stateName;
        this.stateCode = result.stateCode;
        this.country = result.countryID;
        this.timeCreated = result.timeCreated;

      });



    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }



  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  addCountry() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'stateID': this.stateID,
      'countryID': this.country,
      'stateName': this.stateName,
      'stateCode': this.stateCode,
      'timeCreated': this.timeCreated
    };

    this.apiService.putData('states', data)
      .subscribe({
        complete : () => {},
        error : (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/'.*'/, 'This Field');
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
          this.Success = 'State Updated successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}
