import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LeafletMapService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../constants';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
declare var $: any;
declare var L: any;

@Component({
  selector: 'app-geofence-list',
  templateUrl: './geofence-list.component.html',
  styleUrls: ['./geofence-list.component.css']
})
export class GeofenceListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
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
  type = null;
  geofenceName = '';
  geofencesTypes: any = {};

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  geoNext = false;
  geoPrev = true;
  geoDraw = 0;
  geoPrevEvauatedKeys = [''];
  geoStartPoint = 1;
  geoEndPoint = this.pageLength;

  constructor(
    private apiService: ApiService,
    private LeafletMap: LeafletMapService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
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
    if(this.geofenceName !== '' || this.type !== null) {
      this.geofenceName = this.geofenceName.toLowerCase();
      if(this.geofenceID == '') {
        this.geofenceID = this.geofenceName;
      }
      this.geofences = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchLogsCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.geofenceName !== '' || this.type !== null) {
      this.geofenceID = '';
      this.geofenceName = '';
      this.type = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.geofences = [];
      this.fetchLogsCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  getSuggestions = _.debounce(function (value) {
    value = value.toLowerCase();
    this.apiService
      .getData(`geofences/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedGeofences = result;
        if(this.suggestedGeofences.length == 0){
          this.suggestedGeofences = [];
          this.geofenceID = '';
        }
      });
  }, 800)
  

  fetchGeofenceTypes() {
    this.apiService.getData('geofenceTypes')
      .subscribe((result: any) => {
        this.geofenceTypes = result.Items;
      });
  }

  setGeofence(geofenceID, geofenceName) {
    this.geofenceName = geofenceName;
    // this.geofenceID = geofenceID;
    this.geofenceID = geofenceName;
    this.suggestedGeofences = [];
  }

  deactivateGeofence(value, geofenceID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`geofences/isDeleted/${geofenceID}/${value}`)
      .subscribe((result: any) => {
        this.geofences = [];
        this.geoDraw = 0;
        this.lastEvaluatedKey = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.toastr.success('Geofence deleted successfully!');
        this.fetchLogsCount();
        this.initDataTable();
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

  initDataTable() {
    this.apiService.getData(`geofences/fetch/records?geofence=${this.geofenceID}&type=${this.type}&lastKey=${this.lastEvaluatedKey}`)
     .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedGeofences = [];
        this.getStartandEndVal();

        this.geofences = result['Items'];
        if (this.geofenceID != '' || this.type != null) {
          this.geoStartPoint = 1;
          this.geoEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.geoNext = false;
          // for prev button
          if (!this.geoPrevEvauatedKeys.includes(result['LastEvaluatedKey'].geofenceID)) {
            this.geoPrevEvauatedKeys.push(result['LastEvaluatedKey'].geofenceID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].geofenceID;
          
        } else {
          this.geoNext = true;
          this.lastEvaluatedKey = '';
          this.geoEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.geoEndPoint) {
          this.geoEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.geoDraw > 0) {
          this.geoPrev = false;
        } else {
          this.geoPrev = true;
        }
        this.spinner.hide();
      }, err => {
        
      });
  }

  fetchLogsCount() {
    this.apiService.getData(`geofences/get/count?geofence=${this.geofenceID}&type=${this.type}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;

        if(this.geofenceID != '' || this.type != null) {
          this.geoEndPoint = this.totalRecords;
        }
      },
    });
  }

  getStartandEndVal() {
    this.geoStartPoint = this.geoDraw * this.pageLength + 1;
    this.geoEndPoint = this.geoStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.geoNext = true;
    this.geoPrev = true;
    this.geoDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.geoNext = true;
    this.geoPrev = true;
    this.geoDraw -= 1;
    this.lastEvaluatedKey = this.geoPrevEvauatedKeys[this.geoDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.geoStartPoint = 1;
    this.geoEndPoint = this.pageLength;
    this.geoDraw = 0;
  }

}
