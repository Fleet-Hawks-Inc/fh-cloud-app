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

  dtTrigger: Subject<any> = new Subject();
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

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

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
    this.fetchDrivers();
    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCyclesIDs();
    this.fetchAllCountriesIDs();
    this.fetchAllCitiesIDs();
    this.initDataTable();

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

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
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
      .getData(`drivers/get/suggestions/${value}`)
      .subscribe((result) => {
        this.suggestedDrivers = result.Items;
        if (this.suggestedDrivers.length === 0) {
          this.driverID = '';
        }
      });
  }

  setDriver(driverID, firstName, lastName) {
    this.driverName = firstName+' '+lastName;
    this.driverID = driverID;

    this.suggestedDrivers = [];
  }

  fetchDrivers() {

    this.apiService.getData('drivers')
    .subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        // console.log(result);
        // console.log(result.Items);
        this.totalRecords = result.Count;
      },
    });
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
          this.rerender();
          this.toastr.success('Driver deleted successfully!');
          // this.drivers = this.drivers.filter(u => u.driverID !== item.driverID);
        }, err => {
         
        });
    }
  }

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,

      order: [],
      columnDefs: [ //sortable false
        { "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "orderable": false },
      ],
      dom: 'Bfrtip',
      buttons: [
        'colvis',
        'excel',
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('drivers/fetch-records?driverID='+this.driverID+'&dutyStatus='+this.dutyStatus+ '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.drivers = resp['Items'];
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].driverID;
          } else {
            this.lastEvaluatedKey = '';
          }
          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }

    };
  }

  searchFilter() {
    if(this.driverID !== '' || this.dutyStatus !== '') {
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.driverID !== '' || this.dutyStatus !== '') {
      // this.spinner.show();
      this.driverID = '';
      this.dutyStatus = '';
      this.driverName = '';
      this.rerender();
      // this.spinner.hide();
    } else {
      return false;
    }
  }
}
