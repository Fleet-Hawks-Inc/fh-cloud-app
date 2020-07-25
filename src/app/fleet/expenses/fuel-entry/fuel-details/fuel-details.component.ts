import { Component, OnInit } from '@angular/core';
import { MapBoxService } from "../../../../map-box.service";


@Component({
  selector: 'app-fuel-details',
  templateUrl: './fuel-details.component.html',
  styleUrls: ['./fuel-details.component.css']
})
export class FuelDetailsComponent implements OnInit {

  constructor( private mapBoxService: MapBoxService) { }

  ngOnInit() {
    this.mapBoxService.initMapbox(-104.618896, 50.44521);

  }

}
