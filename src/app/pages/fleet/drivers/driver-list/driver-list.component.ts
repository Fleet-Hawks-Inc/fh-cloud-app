import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HereMapService } from '../../../../services/here-map.service';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {
  title = 'Driver List';
  mapView: boolean = false;
  listView: boolean = true;
  visible = true;

  driverCheckCount;
  selectedDriverID;
  drivers = [];
  dtOptions: any = {};

  statesObject: any;
  vehiclesObject: any;
  cyclesObject: any;

  driverID = '';
  driverName = '';
  dutyStatus = '';
  suggestedDrivers = [];
  homeworld: Observable<{}>;
  constructor(
            private apiService: ApiService,
            private router: Router,
            private hereMap: HereMapService,
            private spinner: NgxSpinnerService,
            private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchDrivers();
    this.fetchAddress();
    this.fetchAllStatesIDs();
    this.fetchAllVehiclesIDs();
    this.fetchAllCyclesIDs();

    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }


  fetchAddress() {
    this.apiService.getData('addresses')
      .subscribe((result: any) => {
        console.log('address', result);
      });
  }


  jsTree() {
    $('.treeCheckbox').jstree({
      core : {
        themes : {
          responsive: false
        }
      },
      types : {
        default : {
          icon : 'fas fa-folder'
        },
        file : {
          icon : 'fas fa-file'
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
    // let character = this.apiService.getData('drivers');
    // let characterHomeworld = this.apiService.getData('addresses');

    // forkJoin([character, characterHomeworld]).subscribe(results => {
    //   console.log("results", results);
    // });

  //  this.apiService.getData('drivers')
  //     .pipe(mergeMap(character => this.apiService.getData('addresses'))).subscribe( res => {
  //       console.log('homeworld', this.homeworld);
  //     });
  //   console.log('homeworld', this.homeworld);
    // this.apiService.getData(`drivers`).pipe(
    //   mergeMap(resp => {
    //     console.log("resp", resp);
    //     return this.apiService.getData(`addresses`).pipe(
    //       map(countResp => {
    //         console.log("countResp", countResp);
    //       })
    //     )
    //   })
    // ).subscribe(res => {
    //   console.log("drivers", res);
    // })
    this.apiService.getData(`drivers`).subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {

        for (const iterator of result.Items) {
          if (iterator.isDeleted === 0) {
            this.drivers.push(iterator);
          }
        }

        console.log(result);

        this.drivers = result.Items;

        console.log('drivers', this.drivers);


        // this.drivers = result.Items;
        for (let i = 0; i < result.Items.length; i++) {
          // console.log(result.Items[i].isDeleted);
          if (result.Items[i].isDeleted === 0) {
            this.drivers.push(result.Items[i]);
          }
        }

      //  this.spinner.hide(); // loader hide

      },
    });
  }

  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
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
        console.log('this.cyclesObject', this.cyclesObject);
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

  deactivateDriver(value, driverID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`drivers/isDeleted/${driverID}/${value}`)
      .subscribe((result: any) => {
        console.log('result', result);
      }, err => {
        console.log('driver delete', err);
      });
      
    }
  }

  initDataTable() {
    this.dtOptions = {
      searching:false,
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
        fixedColumnsLeft: 0
      },
      buttons: [
        'colvis',
        'excel',
      ],
    };
  }
}
