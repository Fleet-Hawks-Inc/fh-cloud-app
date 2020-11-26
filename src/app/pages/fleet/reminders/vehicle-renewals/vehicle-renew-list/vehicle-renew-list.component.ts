import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { group } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  public remindersData = [];
  dtOptions: any = {};
  vehicles = [];
  vehicleName: string;
  vehicleList: any;
  groups = [];
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  constructor(private apiService: ApiService, private router: Router,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchVehicles();
    this.fetchGroups();
    this.fetchVehicleList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
      //   console.log('Groups Data', this.groups);
    });
  }
  // fetchVehicles(ID) {
  //   this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
  //   this.vehicles = result.Items;
  //   this.vehicleIdentification = this.vehicles[0].vehicleIdentification;
  //   });
  // }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
      console.log('fetched vehcile list', this.vehicleList);
    });
  } 
  fetchRenewals = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => { this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for (let i = 0; i < this.allRemindersData.length; i++) {
          if (this.allRemindersData[i].reminderType === 'vehicle') {
            this.remindersData.push(this.allRemindersData[i]);
          }
        }
        console.log('vehicle renewal array', this.remindersData);
      },
    });
  }
  deleteRenewal(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.fetchRenewals();
        this.toastr.success('Vehicle Renewal Deleted Successfully!');
               
      });
  }
  initDataTable() {
    this.dtOptions = {
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
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }
}
