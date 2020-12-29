import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LeafletMapService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var L: any;

@Component({
  selector: 'app-geofence-list',
  templateUrl: './geofence-list.component.html',
  styleUrls: ['./geofence-list.component.css']
})
export class GeofenceListComponent implements OnInit {
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



  constructor(
    private apiService: ApiService,
    private LeafletMap: LeafletMapService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchGeofences();
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
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
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
          console.log('new_cords', new_cords);
          // console.log(new_cords);
          this.map = this.LeafletMap.initGeoFenceMap();
          const poly = L.polygon(new_cords).addTo(this.map);
          this.map.fitBounds(poly.getBounds());
        },
          100);
      } else {
        console.log('geofence not found!')
      }
     
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
    this.apiService.getData(`geofences?geofenceID=${this.geofenceID}&type=${this.type}`).subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        for (const iterator of result.Items) {
          if (iterator.isDeleted === 0) {
            this.geofences.push(iterator);
          }
        }
        this.spinner.hide();
      },
    });
  }

  deactivateAsset(value, geofenceID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`geofences/isDeleted/${geofenceID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
        this.fetchGeofences();
      });
    }
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
    //  /******** Clear DataTable ************/
    //  if ($.fn.DataTable.isDataTable('#datatable-default')) {
    //   $('#datatable-default').DataTable().clear().destroy();
    // }
    // /******************************/

    // this.apiService.deleteData('geofences/' + geofenceID)
    //   .subscribe((result: any) => {
    //     this.fetchGeofences();
    //   })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }


}
