import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, ViewChild } from '@angular/core';
import { HereMapService } from '../../../../services/here-map.service';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap, map, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  allDocumentsTypes: any;
  documentsTypesObects: any = {};

  title = 'Driver List';
  mapView = false;
  listView = true;
  visible = true;

  driverCheckCount;
  selectedDriverID;
  drivers = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


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
  private destroy$ = new Subject();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private hereMap: HereMapService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.fetchAllDocumentsTypes();

    forkJoin([
      this.fetchDrivers(),
      this.fetchAddress(),
      this.fetchAllStatesIDs(),
      this.fetchAllVehiclesIDs(),
      this.fetchAllCyclesIDs(),
      this.fetchAllCountriesIDs(),
      this.fetchAllCitiesIDs()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.initDataTable();
        },
        error: () => { },
        next: ([
          drivers,
          addresses,
          statesIds,
          vehcilesIds,
          cycleIds,
          countryIds,
          citiesIds
        ]: any) => {
          let newArr = [];
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < addresses.Items.length; i++) {
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < drivers.Items.length; j++) {
              if (addresses.Items[i].entityID === drivers.Items[j].driverID) {
                drivers.Items[j].addressDetails = {
                  address1: addresses.Items[i].address1,
                  address2: addresses.Items[i].address2,
                  addressID: addresses.Items[i].addressID,
                  addressType: addresses.Items[i].addressType,
                  cityID: addresses.Items[i].cityID,
                  countryID: addresses.Items[i].countryID,
                  geoCords: addresses.Items[i].geoCords,
                  stateID: addresses.Items[i].stateID,
                  zipCode: addresses.Items[i].zipCode,
                };
              }
            }
          }
          for (const iterator of drivers.Items) {
            if (iterator.isDeleted === 0) {
              this.drivers.push(iterator);
            }
          }
          this.statesObject = statesIds;
          this.vehiclesObject = vehcilesIds;
          this.cyclesObject = cycleIds;
          this.countriesObject = countryIds;
          this.citiesObject = citiesIds;
        }
      });


    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  fetchAddress() {
    return this.apiService.getData('addresses');
  }

  fetchAllDocumentsTypes() {
    this.httpClient.get("assets/travelDocumentType.json").subscribe((data: any) =>{
      this.allDocumentsTypes = data;
      this.documentsTypesObects =  data.reduce( (a: any, b: any) => {
        return a[b['code']] = b['description'], a;
    }, {});
    })
  }

  jsTree() {
    $('.treeCheckbox').jstree({
      core: {
        themes: {
          responsive: false
        }
      },
      types: {
        default: {
          icon: 'fas fa-folder'
        },
        file: {
          icon: 'fas fa-file'
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
        if (this.suggestedDrivers.length === 0) {
          this.driverID = '';
        }
      });
  }

  setDriver(driverID, driverName) {
    this.driverName = driverName;
    this.driverID = driverID;

    this.suggestedDrivers = [];
  }

  fetchDrivers() {
    // this.spinner.show(); // loader init
    // let character = this.apiService.getData('drivers');
    // let characterHomeworld = this.apiService.getData('addresses');

    // forkJoin([character, characterHomeworld]).subscribe(results => {
    //   console.log("results", results);
    // });

    //  this.apiService.getData('drivers')
    //     .pipe(mergeMap(character => this.apiService.getData('addresses'))).subscribe( res => {
    //       console.log('homeworld', this.homeworld);
    //     });
    //   console.log('homeworld', this.homeworld);
    // this.apiService.getData(`drivers`).pipe(
    //   mergeMap(resp => {
    //     console.log("resp", resp);
    //     return this.apiService.getData(`addresses`).pipe(
    //       map(countResp => {
    //         console.log("countResp", countResp);
    //       })
    //     )
    //   })
    // ).subscribe(res => {
    //   console.log("drivers", res);
    // })
    return this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`);
    // .subscribe({
    //   complete: () => {
    //     this.initDataTable();
    //   },
    //   error: () => { },
    //   next: (result: any) => {
    //     // console.log(result);
    //     // console.log(result.Items);

    //     for (const iterator of result.Items) {
    //       if (iterator.isDeleted === 0) {
    //         this.drivers.push(iterator);
    //       }
    //     }

    //     // console.log(result);

    //     this.drivers = result.Items;

    //     //  console.log('drivers', this.drivers);


    //     // this.drivers = result.Items;


    //     // for (let i = 0; i < result.Items.length; i++) {
    //     //   // console.log(result.Items[i].isDeleted);
    //     //   if (result.Items[i].isDeleted === 0) {
    //     //     this.drivers.push(result.Items[i]);
    //     //   }
    //     // }

    //     //  this.spinner.hide(); // loader hide

    //   },
    // });
  }

  fetchAllStatesIDs() {
    return this.apiService.getData('states/get/list');
    // .subscribe((result: any) => {
    //   this.statesObject = result;
    // });
  }


  fetchAllCountriesIDs() {
    return this.apiService.getData('countries/get/list');
    // .subscribe((result: any) => {
    //   this.countriesObject = result;
    // });
  }

  fetchAllCitiesIDs() {
    return this.apiService.getData('cities/get/list');
    // .subscribe((result: any) => {
    //   this.citiesObject = result;
    // });
  }

  fetchAllVehiclesIDs() {
    return this.apiService.getData('vehicles/get/list');
    // .subscribe((result: any) => {
    //   this.vehiclesObject = result;
    // });
  }

  fetchAllCyclesIDs() {
    return this.apiService.getData('cycles/get/list');
    // .subscribe((result: any) => {
    //   this.cyclesObject = result;
    // });
  }

  checkboxCount = () => {
    this.driverCheckCount = 0;
    this.drivers.forEach(item => {
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


  deactivateDriver(item, driverID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
        .getData(`drivers/isDeleted/${driverID}/${item.isDeleted}`)
        .subscribe((result: any) => {
          this.toastr.success('Driver deleted successfully!');
          this.drivers = this.drivers.filter(u => u.driverID !== item.driverID);
          this.fetchDrivers();
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
      
     
    };
  }

}
