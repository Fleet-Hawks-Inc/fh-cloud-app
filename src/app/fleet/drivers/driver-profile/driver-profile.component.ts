import { Component, OnInit } from '@angular/core';
import { MapBoxService } from "../../../map-box.service";
import { timer } from "rxjs";
declare var $: any;


@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit {

  constructor(private mapBoxService: MapBoxService) { }

  ngOnInit() {
    this.mapBoxService.initMapbox(-104.618896, 50.44521);

  }
  initDataTable() {
    timer(200).subscribe(() => {
      $(".simple-table").DataTable();
    });
  }
}
