import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-shared-modals',
  templateUrl: './shared-modals.component.html',
  styleUrls: ['./shared-modals.component.css']
})
export class SharedModalsComponent implements OnInit {
  countries: any  = [];
  states: any = [];
  cities: any = [];
  form:any;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  private destroy$ = new Subject();
  errors = {};
  constructor(private apiService: ApiService,private toastr: ToastrService) { }
stateData = {
  countryID : '',
  stateName: '',
  stateCode: ''
};
cityData = {
  countryID : '',
  stateID: '',
  cityName: '', 
};
  ngOnInit() {
    this.fetchCountries();
    $(document).ready(() => {
      this.form = $('#stateForm').validate();
    });
  }
 /*
   * Get all countries from api
   */
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  getStates(id) {
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(id) {
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  // Add state
  addState() {
    this.hideErrors();  
    this.apiService.postData('states', this.stateData).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addStateModal').modal('hide');
          this.toastr.success('State Added Successfully');
        }
      });
  }
  throwErrors() {
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }
  // add city
  addCity() {
    this.hideErrors();  
    this.apiService.postData('cities', this.cityData).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addCityModal').modal('hide');
          this.toastr.success('City Added Successfully');
        }
      });
  }
}
