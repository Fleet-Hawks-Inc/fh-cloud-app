import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LeafletMapService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;
declare var L: any;

@Component({
  selector: 'app-geofence-list',
  templateUrl: './geofence-list.component.html',
  styleUrls: ['./geofence-list.component.css']
})
export class GeofenceListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  
  private map: any;
  selectID;
  private geofenceSelectCount;
  visibleIndex = -1;
  title = 'Geofence List';
  geofences = [];
  dropdownList = [];
  geofenceTypes: any;
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys' }
  ];


  suggestedGeofences = [];
  geofenceID = '';
  type = '';
  geofenceName = '';
  geofencesTypes: any = {};

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  constructor(
    private apiService: ApiService,
    private LeafletMap: LeafletMapService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.fetchGeofences();
    this.fetchLogsCount();
    this.initDataTable();

    this.fetchGeofenceTypes();
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.fetchTypesNameByIDs();

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

  toggleAccordian(ind, cords) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
      if (cords[0]) {
        setTimeout(() => {
          let new_cords = [];
          for (let i = 0; i < cords[0].length - 1; i++) {
  
            for (let j = 0; j < cords[0][i].length - 1; j++) {
              new_cords.push([cords[0][i][j + 1], cords[0][i][j]]);
  
            }
          }
          this.map = this.LeafletMap.initGeoFenceMap();
          const poly = L.polygon(new_cords).addTo(this.map);
          this.map.fitBounds(poly.getBounds());
        },
          100);
      } 
     
    }
  }

  searchFilter() {
    if(this.geofenceID !== '' || this.type !== '') {
      this.geofences = [];
      this.fetchLogsCount();
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.geofenceID !== '' || this.type !== '') {
      // this.spinner.show();
      this.geofenceID = '';
      this.geofenceName = '';
      this.type = '';

      this.geofences = [];
      this.fetchLogsCount();
      this.rerender();
      // this.spinner.hide();
    } else {
      return false;
    }
  }

  getSuggestions(value) {
    this.apiService
      .getData(`geofences/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedGeofences = result.Items;
        if(this.suggestedGeofences.length == 0){
          this.geofenceID = '';
        }
      });
  }
  

  fetchGeofenceTypes() {
    this.apiService.getData('geofenceTypes')
      .subscribe((result: any) => {
        this.geofenceTypes = result.Items;
      });
  }

  setGeofence(geofenceID, geofenceName) {
    this.geofenceName = geofenceName;
    this.geofenceID = geofenceID;

    this.suggestedGeofences = [];
  }

  fetchGeofences() {
    this.geofences = [];
    this.spinner.show();
    this.apiService.getData(`geofences/fetch/records?geofenceID=${this.geofenceID}&type=${this.type}`).subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        for (const iterator of result.Items) {
          if (iterator.isDeleted === 0) {
            this.geofences.push(iterator);
          }
        }
        this.spinner.hide();
        this.map = this.LeafletMap.initGeoFenceMap();
      },
    });
  }

  deactivateAsset(value, geofenceID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`geofences/isDeleted/${geofenceID}/${value}`)
      .subscribe((result: any) => {
        this.fetchGeofences();
      });
    }
  }

  fetchTypesNameByIDs() {
    this.apiService.getData('geofenceTypes/get/list').subscribe({
      error: () => {},
      next: (result: any) => {
        this.geofencesTypes = result;
      }
    });
  }

  checkboxCount = () => {
    this.geofenceSelectCount = 0;
    this.geofences.forEach(item => {
      if (item.checked) {
        this.selectID = item.geofenceID;
        this.geofenceSelectCount = this.geofenceSelectCount + 1;
      }
    });
  }

  editGeofence() {
    if (this.geofenceSelectCount === 1) {
      this.router.navigateByUrl('/fleet/geofence/edit/' + this.selectID);
    } else {
      this.toastr.error('Please select only one asset!');
    }

  }

  deleteGeofence() {
    const selectedAssets = this.geofences.filter(product => product.checked);
    console.log(selectedAssets)
    if (selectedAssets && selectedAssets.length > 0) {
      for (const i of selectedAssets) {
        this.apiService.deleteData('geofences/' + i.geofenceID)
          .subscribe((result: any) => {
            this.toastr.success('Geofence Deleted Successfully!');
            this.fetchGeofences();
          })
      }
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
        {"targets": [0,1,2,3,4],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData(`geofences/fetch/records?geofenceID=${this.geofenceID}&type=${this.type}&lastKey=${this.lastEvaluatedKey}`, dataTablesParameters).subscribe(resp => {
            current.geofences = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKey = resp['LastEvaluatedKey'].geofenceID;
              
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

  fetchLogsCount() {
    this.apiService.getData(`geofences/get/count?geofenceID=${this.geofenceID}&type=${this.type}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }


}
