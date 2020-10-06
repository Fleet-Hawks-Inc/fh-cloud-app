import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


declare var $: any;

@Component({
  selector: 'app-geofence-list',
  templateUrl: './geofence-list.component.html',
  styleUrls: ['./geofence-list.component.css']
})
export class GeofenceListComponent implements OnInit {

  title = 'Geofence List';
  geofences;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys'}
];
  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchGeofences();
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
  fetchGeofences() {
      this.apiService.getData('geofences').subscribe({
        complete: () => {
          this.initDataTable();
        },
        error: () => {},
        next: (result: any) => {
          console.log(result);
          this.geofences = result.Items;
        },
      });
  }

  deleteGeofence(geofenceID) {
     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('geofences/' + geofenceID)
      .subscribe((result: any) => {
        this.fetchGeofences();
      })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }


}
