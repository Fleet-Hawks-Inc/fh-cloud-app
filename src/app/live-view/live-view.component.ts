import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MapBoxService } from "../map-box.service";
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css'],
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
export class LiveViewComponent implements OnInit {
   // Mapbox Integration
   map: mapboxgl.Map;
   style = 'mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g';
   lat = -104.618896;
   lng = 50.445210;
   isControlAdded = false;
   visible = true;

  constructor(private mapBoxService: MapBoxService) { }

  ngOnInit() {
    this.mapboxInit();
  }
  valuechange() {
    this.visible = !this.visible;
  }
  mapboxInit = () => {

    // Initialize Map
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 3,
      center: [-104.618896, 50.445210],
      accessToken: environment.mapBox.accessToken
    });
}
}
