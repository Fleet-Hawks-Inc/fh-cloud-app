import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { MapBoxService } from '../../../map-box.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';



declare var $: any;

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],

  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('400ms', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('400ms', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
})
export class VehicleListComponent implements OnInit {

  title = 'Vehicle List';
  visible = true;
  vehicles;
  dropdownList = [];
  selectedItems = [];
  isChecked = false;
  allData = [];
  selectedVehicleID: any;
  vehicleCheckCount = null;
  dropdownSettings: IDropdownSettings;
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys' }
  ];
  constructor(private apiService: ApiService, private toastr: ToastrService, private router: Router, private mapBoxService: MapBoxService) {

  }

  ngOnInit() {

    this.mapBoxService.initMapbox(-104.618896, 50.44521);
    this.fetchVehicles();

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
   // Count Checkboxes
   checkboxCount = () => {
    this.vehicleCheckCount = 0;
    this.allData.forEach(item => {
      if (item.checked) {
        this.selectedVehicleID = item.vehicleID;
        this.vehicleCheckCount = this.vehicleCheckCount + 1;
      }
    });
  }
  editVehicle = () => {
    if (this.vehicleCheckCount === 1) {
      this.router.navigateByUrl('/fleet/vehicles/Edit-Vehicle-New/' + this.selectedVehicleID);
    } else {
      this.toastr.error('Please select only one vehicle!');
    }
  }
  deleteVehicle = () => {
    const selectedVehicles = this.allData.filter(product => product.checked).map(p => p.vehicleID);
    if (selectedVehicles && selectedVehicles.length > 0) {
      for (const i of selectedVehicles) {
        this.apiService.deleteData('vehicles/' + i).subscribe((result: any) => {
          this.fetchVehicles();
          this.toastr.success('Vehicle Deleted Successfully!');
        });
      }
    }
  }

  checkuncheckall = () => {
    if (this.isChecked === true) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  valuechange() {
    this.visible = !this.visible;
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.allData = result.Items;
        this.vehicles = result.Items;
        console.log('Final result' + this.vehicles);
      },
    });
  }



  // deleteVehicle(vehicleId) {
  //   /******** Clear DataTable ************/
  //   if ($.fn.DataTable.isDataTable('#datatable-default')) {
  //     $('#datatable-default').DataTable().clear().destroy();
  //   }
  //   /******************************/

  //   this.apiService.deleteData('vehicles/' + vehicleId)
  //     .subscribe((result: any) => {
  //       this.fetchVehicles();
  //     });
  // }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }

  showMap() {
    // $(document).ready(function(){
    $('#map_view').show();
    $('#list_view').hide();
    $('#map_view_btn').removeClass('btn-default').addClass('btn-success');
    $('#list_view_btn').removeClass('btn-success').addClass('btn-default');
    // });
  }
  showList() {
    // $(document).ready(function(){
    $('#list_view').show();
    $('#map_view').hide();
    $('#list_view_btn').removeClass('btn-default').addClass('btn-success');
    $('#map_view_btn').removeClass('btn-success').addClass('btn-default');
    //  });
  }
}
