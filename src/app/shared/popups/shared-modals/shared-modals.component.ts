import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../../../services';

declare var $: any;
@Component({
  selector: 'app-shared-modals',
  templateUrl: './shared-modals.component.html',
  styleUrls: ['./shared-modals.component.css']
})
export class SharedModalsComponent implements OnInit {
  countriesList: any= [];
  countries: any  = [];
  states: any = [];
  cities: any = [];
  manufacturers: any = [];
  assetManufacturers: any = [];
  assetModels: any = [];
  form:any;
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  private destroy$ = new Subject();
  errors = {};
  constructor(private apiService: ApiService,private toastr: ToastrService, private httpClient: HttpClient, private listService: ListService) { }
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
vehicleMakeData = {
  manufacturerName: ''
}
vehicleModelData = {
  manufacturerID: '',
  modelName:''
}
assetMakeData = {
  manufacturerName: ''
}
assetModelData = {
  manufacturerID: '',
  modelName:''
}
test: any = [];
  ngOnInit() {
    this.fetchCountries();
    this.fetchManufacturers();
    this.fetchAssetManufacturers();
    this.fetchAssetModels();
    this.newManufacturers();
    $(document).ready(() => {
      this.form = $('#stateForm').validate();
      this.form = $('#cityForm').validate();
      this.form = $('#vehicleMakeForm').validate();
      this.form = $('#vehicleModelForm').validate();
      this.form = $('#assetMakeForm').validate();
      this.form = $('#assetModelForm').validate();
    });    
  }
  /**
   * fetch vehicle manufacturers
   */
  fetchManufacturers(){
    this.apiService.getData('manufacturers')
      .subscribe((result: any) => {
        this.manufacturers = result.Items;
      });
  }
  newManufacturers(){
    this.apiService.getData('manufacturers')
    .subscribe((result: any) => {
      this.test = result.Items;   
      for(let i=0; i< this.test.length; i++){
        
   }
    }); 
 
  }
   /**
   * fetch asset manufacturers
   */
  fetchAssetManufacturers(){
    this.apiService.getData('assetManufacturers')
      .subscribe((result: any) => {
        this.assetManufacturers = result.Items;
      });
  }

  fetchAssetModels() {
    this.apiService.getData('assetModels')
      .subscribe((result: any) => {
        this.assetModels = result.Items;
      })
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
          this.toastr.success('State Added Successfully.');
          this.listService.fetchStates();
        }
      });
  }
  throwErrors() {
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
          this.toastr.success('City Added Successfully.');
        }
      });
  }
  // add vehicle make
  addVehicleMake() {
    this.hideErrors();  
    this.apiService.postData('manufacturers', this.vehicleMakeData).
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
          $('#addVehicleMakeModal').modal('hide');
          this.toastr.success('Vehicle Make Added Successfully.');
          this.listService.fetchManufacturers();
        }
      });
  }

   /**
    *   add vehicle model
    * */
   addVehicleModel() {
    this.hideErrors();  
    this.apiService.postData('vehicleModels', this.vehicleModelData).
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
          $('#addVehicleModelModal').modal('hide');
          this.toastr.success('Vehicle Model Added Successfully.');
          this.listService.fetchModels();
        }
      });
  }

  /**
   * add asset make
   */
   
   addAssetMake() {
    this.hideErrors();  
    this.apiService.postData('assetManufacturers', this.assetMakeData).
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
          $('#addAssetMakeModal').modal('hide');
          this.toastr.success('Asset Make Added Successfully.');
          this.listService.fetchAssetManufacturers();
        }
      });
  }
  /**
   * add asset model
   */
   // add vehicle model
   addAssetModel() {
    this.hideErrors();  
    this.apiService.postData('assetModels', this.assetModelData).
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
          $('#addAssetModelModal').modal('hide');
          this.toastr.success('Asset Model Added Successfully.');
          this.listService.fetchAssetModels();
        }
      });
  }
}
