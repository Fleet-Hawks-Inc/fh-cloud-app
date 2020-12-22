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
  dtOptions: any = {};
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
    return this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`);
  }

  fetchAllStatesIDs() {
    return this.apiService.getData('states/get/list');
    
  }


  fetchAllCountriesIDs() {
    return this.apiService.getData('countries/get/list');
    
  }

  fetchAllCitiesIDs() {
    return this.apiService.getData('cities/get/list');
   
  }

  fetchAllVehiclesIDs() {
    return this.apiService.getData('vehicles/get/list');
    
  }

  fetchAllCyclesIDs() {
    return this.apiService.getData('cycles/get/list');
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

        }, err => {});

    }
  }

  initDataTable() {
    this.dtOptions = {
      searching: false,
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      buttons: [
        'colvis',
        'excel',
      ]
     
    };
  }

}
