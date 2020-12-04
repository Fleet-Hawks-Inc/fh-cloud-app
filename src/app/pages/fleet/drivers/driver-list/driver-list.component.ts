import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {
  title = 'Driver List';
  mapView: boolean = false;
  listView: boolean = true;
  visible = true;

  driverCheckCount;
  selectedDriverID;
  drivers = [];
  dtOptions: any = {};

  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  vehiclesObject: any = {};
  cyclesObject: any = {};

  driverID = '';
  driverName = '';
  dutyStatus = '';
  suggestedDrivers = [];
  homeworld: Observable<{}>;
  constructor(
            private apiService: ApiService,
            private router: Router,
            private hereMap: HereMapService,
            private spinner: NgxSpinnerService,
            private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchDrivers();
    this.fetchAddress();
    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCyclesIDs();
    this.fetchAllCitiesIDs();
    this.fetchAllCountriesIDs();

    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }




  jsTree() {
    $('.treeCheckbox').jstree({
      core : {
        themes : {
          responsive: false
        }
      },
      types : {
        default : {
          icon : 'fas fa-folder'
        },
        file : {
          icon : 'fas fa-file'
        }
      },
      plugins: ['types', 'checkbox']
    });
    
  }

  export() {
    $('.buttons-excel').trigger('click');
  }

  getSuggestions(value) {
    this.apiService
      .getData(`drivers/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedDrivers = result.Items;
        if(this.suggestedDrivers.length == 0){
          this.driverID = '';
        }
      });
  }

  setDriver(driverID, driverName) {
    this.driverName = driverName;
    this.driverID = driverID;

    this.suggestedDrivers = [];
  }

  
  fetchAddress() {
    this.apiService.getData('addresses')
      .subscribe((result: any) => {
        console.log('address', result);
      });
  }

  fetchDrivers() {
   // this.spinner.show(); // loader init
    let driversList = this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`);
    let addressList = this.apiService.getData('addresses');

    forkJoin([driversList, addressList]).subscribe(results => {
      console.log("results", results);
      let newArr = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < results[1].Items.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < results[0].Items.length; j++) {
          if (results[1].Items[i].entityID === results[0].Items[j].driverID) {
            results[0].Items[j].addressDetails = {
              address1: results[1].Items[i].address1,
              address2: results[1].Items[i].address2,
              addressID: results[1].Items[i].addressID,
              addressType: results[1].Items[i].addressType,
              cityID: results[1].Items[i].cityID,
              countryID: results[1].Items[i].countryID,
              geoCords: results[1].Items[i].geoCords,
              stateID: results[1].Items[i].stateID,
              zipCode: results[1].Items[i].zipCode,
            };
          }
        }
      }
      for (const iterator of results[0].Items) {
        if (iterator.isDeleted === 0) {
          this.drivers.push(iterator);
        }
      }
      console.log("results[0].Items", this.drivers);
    });

    
    // let driverList = this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`);
    // from(driverList).pipe(
    //   mergeMap(resp => this.apiService.getData(`addresses`))
    // ).subscribe(res => console.log('resnew', res));
    
    // this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`).subscribe({
    //   complete: () => {
    //     this.initDataTable();
    //   },
    //   error: () => {},
    //   next: (result: any) => {
    //     for (const iterator of result.Items) {
    //       if (iterator.isDeleted === 0) {
    //         this.drivers.push(iterator);
    //       }
    //     }
    //   },
    // });
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }
  
  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
  }

   fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllCyclesIDs() {
    this.apiService.getData('cycles/get/list')
      .subscribe((result: any) => {
        this.cyclesObject = result;
      });
  }

  checkboxCount = () => {
    this.driverCheckCount = 0;
    this.drivers.forEach(item => {
      console.log('item', item);
      if (item.checked) {
        this.selectedDriverID = item.driverID;
        this.driverCheckCount = this.driverCheckCount + 1;
      }
    });
  }

  editDriver = () => {
    if (this.driverCheckCount === 1) {
      this.router.navigateByUrl('/fleet/drivers/edit-driver/' + this.selectedDriverID);
    } else {
      this.toastr.error('Please select only one asset!');
    }
  }

  mapShow() {
    this.mapView = true;
    this.listView = false;
    setTimeout(() => {
      this.jsTree();
      this.hereMap.mapInit();
    }, 200);
  }

  valuechange() {
    this.visible = !this.visible;
  }

  
  deactivateDriver(value, driverID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`drivers/isDeleted/${driverID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
      }, err => {
        console.log('driver delete', err);
      });
    }
  }

  initDataTable() {
    this.dtOptions = {
      searching: false,
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          },
          {
              targets: 1,
              className: 'noVis'
          },
          {
              targets: 2,
              className: 'noVis'
          },
          {
              targets: 3,
              className: 'noVis'
          },
          {
              targets: 4,
              className: 'noVis'
          }
      ],
      buttons: [
        'colvis',
        'excel',
      ],
      "fnDrawCallback": function(oSettings) {
        if ($('.dataTables_wrapper tbody tr').length < 10) {
              $('.dataTables_paginate').hide();
          }
      }
    };
  }
}
