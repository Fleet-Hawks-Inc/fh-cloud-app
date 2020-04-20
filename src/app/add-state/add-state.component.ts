import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.css']
})
export class AddStateComponent implements OnInit {
  title = 'Add State';

  errors = {};
  form;
  countries = [];
  country = '';

  /********** Form Fields ***********/

  stateCode ='';
  stateName = '';


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
      "countryID": this.country,
      "stateName": this.stateName,
      "stateCode": this.stateCode
    };

    this.apiService.postData('states', data)
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
          this.stateCode = '';
          this.stateName = '';

          this.response = res;
          this.hasSuccess = true;
          this.Success = 'State Added successfully';

        }
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }


}
