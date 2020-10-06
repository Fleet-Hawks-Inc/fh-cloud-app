import { Component, OnInit } from '@angular/core';
import { HereMapService } from '../../../../services/here-map.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {

  constructor(private hereMap: HereMapService) { }

  ngOnInit() {
    this.hereMap.mapInit()
  }

}
