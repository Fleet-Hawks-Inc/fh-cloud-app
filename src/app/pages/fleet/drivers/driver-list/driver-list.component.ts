import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {
  title = 'Driver List';
  driverCheckCount;
  selectedDriverID;
  drivers = [];
  dtOptions: any = {};


  driverID = '';
  driverName = '';
  dutyStatus = '';
  suggestedDrivers = [];

  constructor(
            private apiService: ApiService,
            private router: Router,
            private spinner: NgxSpinnerService,
            private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchDrivers();

    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }

  getSuggestions(value) {
    this.apiService
      .getData(`drivers/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedDrivers = result.Items;
        if(this.suggestedDrivers.length == 0){
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
    this.apiService.getData(`drivers?driverID=${this.driverID}&dutyStatus=${this.dutyStatus}`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);

        this.drivers = result.Items;
        console.log('drivers', this.drivers);
        this.spinner.hide(); // loader hide

        // this.drivers = result.Items;
        for (let i = 0; i < result.Items.length; i++) {
          // console.log(result.Items[i].isDeleted);
          if (result.Items[i].isDeleted === 0) {
            this.drivers.push(result.Items[i]);
          }
        }
        console.log('drivers',this.drivers)
      //  this.spinner.hide(); // loader hide

      },
    });
  }
  checkboxCount = () => {
    this.driverCheckCount = 0;
    this.drivers.forEach(item => {
      console.log('item', item);
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
  deleteDriver() {
    //  /******** Clear DataTable ************/
    //  if ($.fn.DataTable.isDataTable('#datatable-default')) {
    //   $('#datatable-default').DataTable().clear().destroy();
    //   }
    //   /******************************/
    const selectedDrivers = this.drivers.filter(product => product.checked);
    console.log(selectedDrivers);
    if (selectedDrivers && selectedDrivers.length > 0) {
      for (const i of selectedDrivers) {
        this.apiService.deleteData('drivers/' + this.selectedDriverID).subscribe((result: any) => {
          this.fetchDrivers();
          if (selectedDrivers.length == 1) {
            this.toastr.success('Driver Deleted Successfully!');
          } else {
            this.toastr.success('Drivers Deleted Successfully!');
          }

        });
      }
    }
  }

  deactivateAsset(value, driverID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`drivers/isDeleted/${driverID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
        this.fetchDrivers();
      });
    }
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
