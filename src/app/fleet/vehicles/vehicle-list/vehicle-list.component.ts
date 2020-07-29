import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
import { MapBoxService } from "../../../map-box.service";
import { animate, style, transition, trigger } from '@angular/animations';

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
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys'}
];
  constructor(private apiService: ApiService,
              private router: Router,private mapBoxService: MapBoxService) { }

  ngOnInit() {
    this.mapBoxService.initMapbox(-104.618896, 50.44521);
      this.fetchVehicles();

  }
  valuechange() {
    this.visible = !this.visible;
  }
  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.vehicles = result.Items;
      },
    });
  }



  deleteVehicle(vehicleId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
    $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('vehicles/' + vehicleId)
        .subscribe((result: any) => {
            this.fetchVehicles();
        })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

  showMap(){
    // $(document).ready(function(){
      $("#map_view").show();
   $("#list_view").hide();
   $("#map_view_btn").removeClass("btn-default").addClass("btn-success");
   $("#list_view_btn").removeClass("btn-success").addClass("btn-default");   
    // });
  }
  showList(){ 
    // $(document).ready(function(){
      $("#list_view").show();
      $("#map_view").hide();
      $("#list_view_btn").removeClass("btn-default").addClass("btn-success");
      $("#map_view_btn").removeClass("btn-success").addClass("btn-default");
  //  });
  }
}
