import { Component, OnInit } from '@angular/core';
import { MapBoxService } from "../../../map-box.service";
import { timer } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;


@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit {

  constructor(private mapBoxService: MapBoxService,private modalService: NgbModal) { }

  ngOnInit() {
    this.mapBoxService.initMapbox(-104.618896, 50.44521);

  }
  initDataTable() {
    timer(200).subscribe(() => {
      $(".simple-table").DataTable();
    });
  }
 
  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }
}
