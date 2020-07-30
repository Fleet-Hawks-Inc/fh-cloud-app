import { Component, OnInit } from '@angular/core';
import { HereMapService } from './../../../services/here-map.service';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {

  constructor(public hereMap: HereMapService) { }

  ngOnInit() {
    this.hereMap.mapInit()
  }
  

}
