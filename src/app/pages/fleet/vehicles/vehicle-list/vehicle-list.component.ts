import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { timer } from 'rxjs';
declare var $: any;
import { HereMapService } from '../../../../services';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {
  title = 'Vehicle List';
  vehicles;
  dtOptions: any = {};
  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = '';
  vehicleIdentification = '';
  allOptions: any = {};
  groupsList: any = {};
  vehicleModelList: any = {};
  vehicleManufacturersList: any = {};
  currentView = 'list';
  constructor(private apiService: ApiService, private hereMap: HereMapService) {}

  ngOnInit() {
    this.fetchGroups();
    this.fetchVehicles();
    this.fetchVehicleModelList();
    this.fetchVehicleManufacturerList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if(this.suggestedVehicles.length == 0){
          this.vehicleID = '';
        }
      });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groupsList = result;
    });
  }
  fetchVehicleModelList() {
    this.apiService.getData('vehicleModels/get/list').subscribe((result: any) => {
      this.vehicleModelList = result;
    });
  }
  fetchVehicleManufacturerList() {
    this.apiService.getData('manufacturers/get/list').subscribe((result: any) => {
      this.vehicleManufacturersList = result;
    });
  }
  fetchVehicles() {
    this.apiService.getData(`vehicles?vehicleID=${this.vehicleID}&status=${this.currentStatus}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        this.vehicles = result.Items;
      },
    });
  }
  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }

  deleteVehicle(vehicleId) {
    this.apiService
      .deleteData('vehicles/' + vehicleId)
      .subscribe((result: any) => {
        this.fetchVehicles();
      });
  }

  /**
   * change the view of summary
   */
  changeView(){
    if(this.currentView == 'list'){
      this.currentView = 'map'
      setTimeout(() => {
        this.hereMap.mapInit();
      }, 500);
    }else {
      this.currentView = 'list';
    }
  }

  /**
   * export excel
   */
  export() {
    $('.buttons-excel').trigger('click');
  }

  initDataTable() {
    // this.dtOptions = {
    //   dom: 'lrtip', // lrtip to hide search field
    //   processing: true,
    //   columnDefs: [
    //       {
    //           targets: 0,
    //           className: 'noVis'
    //       },
    //       {
    //           targets: 1,
    //           className: 'noVis'
    //       },
    //       {
    //           targets: 2,
    //           className: 'noVis'
    //       },
    //       {
    //           targets: 3,
    //           className: 'noVis'
    //       },
    //       {
    //           targets: 4,
    //           className: 'noVis'
    //       },
    //       {
    //         targets: 5,
    //         className: 'noVis'
    //     },
    //     {
    //         targets: 6,
    //         className: 'noVis'
    //     },
    //     {
    //         targets: 7,
    //         className: 'noVis'
    //     },
    //     {
    //         targets: 8,
    //         className: 'noVis'
    //     },
    //     {
    //         targets: 9,
    //         className: 'noVis'
    //     },
    //     {
    //       targets: 10,
    //       className: 'noVis'
    //   },
    //   {
    //       targets: 11,
    //       className: 'noVis'
    //   },
    //   {
    //       targets: 12,
    //       className: 'noVis'
    //   },
    //   {
    //       targets: 13,
    //       className: 'noVis'
    //   }
    //   ],
    //   colReorder: {
    //     fixedColumnsLeft: 1
    //   },
    //   buttons: [
    //     'colvis',
    //   ],
    // };
    this.allOptions = { 
      pageLength: 10,
      processing: true,
      // select: {
      //     style:    'multi',
      //     selector: 'td:first-child'
      // },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
         {
              extend: 'colvis',
              columns: ':not(.noVis)'
          }
      ],
      colReorder: true,
      columnDefs: [
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
        },
        {
            targets: 8,
            className: 'noVis'
        },
        
    ],
    "fnDrawCallback": function(oSettings) {
        if ($('.dataTables_wrapper tbody tr').length <= 10) {
            $('.dataTables_paginate .previous, .dataTables_paginate .next').hide();
        }
    }
    };
  }
}
