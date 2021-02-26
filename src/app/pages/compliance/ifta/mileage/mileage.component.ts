import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { timer } from 'rxjs';
import { async } from '@angular/core/testing';
declare var $: any;
@Component({
  selector: 'app-mileage',
  templateUrl: './mileage.component.html',
  styleUrls: ['./mileage.component.css']
})
export class MileageComponent implements OnInit {

  activeTab = 'jurisdiction';
  countries = [];
  states = [];
  form;
  fuelList;
  unitType = '';
  modalStateID = '';
  baseState: string;
  baseCountry: string;
  accountNumber: string;
  EIN: string;
  signingAuthority = {
    name: '',
    phone: '',
    title: '',
  };
  totalGallons = 0;
  data = [];
  stateList = [];
  unitList = [];
  vehicleList = [];
  assetList = [];
  tripList = [];
  stateNameList = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this. fetchCountries();
    this.fuelEntries();
    this.fetchStateData();
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchTripList();
    this.fetchStateList();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates() {
    this.apiService.getData('states/country/' + this.baseCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  addIftaAccount() {
    const data = {
      baseState : this.baseState,
      baseCountry: this.baseCountry,
      accountNumber:  this.accountNumber,
      signingAuthority: {
        name: '',
        phone: '',
        title: '',
      }
    };
  }
  fuelEntries() {
    this.apiService.getData('fuelEntries/group/byunit').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        // console.log(result);
        this.fuelList = result;
      },
    });
  }
  fetchStateData() {
    this.apiService.getData('fuelEntries/group/bystate').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        // console.log(result);
        this.stateList = result;
        for(let i=0; i < this.stateList.length; i++){
           this.totalGallons = this.totalGallons + this.stateList[i].fuelGal;

        }
      },
    });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
  getFuelDetails(ID, type, state) {
    if(type === 'vehicle'){
      this. fetchFuelDetailVehicle(ID, state);
    }
    else {
      this. fetchFuelDetailReefer(ID, state);
    }
  }
  fetchFuelDetailVehicle(ID, state) {
    const vehicleID = ID;
    const stateID = state;
    this.modalStateID = state;
    this.unitType = 'Vehicle';
    this.apiService.getData('fuelEntries/vehicle/' + vehicleID)
      .subscribe((result: any) => {
        this.data = result.Items;
        this.unitList = this.data.filter(v => v.stateID === stateID);
      });
  }
  fetchFuelDetailReefer(ID, state) {
    const reeferID = ID;
    const stateID = state;
    this.unitType = 'Reefer';
    this.modalStateID = state;
    this.apiService.getData('fuelEntries/reefer/' + reeferID)
      .subscribe((result: any) => {
        this.data = result.Items;
        this.unitList =  this.data.filter(r => r.stateID === stateID);
      });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fetchStateList() {
    this.apiService.getData('states/get/list').subscribe((result: any) => {
      this.stateNameList = result;
    });
  }
}
