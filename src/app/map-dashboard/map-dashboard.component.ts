import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as mapboxSdk from '@mapbox/mapbox-sdk';
import * as geocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';


declare var $: any;

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.css'],
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
export class MapDashboardComponent implements OnInit {

  title = 'Map Dashboard';
  visible = true;

  // Mapbox Integration
  map: mapboxgl.Map;
  style = 'mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g';
  lat = -104.618896;
  lng = 50.445210;
  isControlAdded = false;
  frontEndData = {
    drivers: {}
  };


  // @ViewChild('gmap', { static: true }) gmapElement: any;
  // map: google.maps.Map;

  /*************Static Markers ************/
  // markers = of(
  //   { lat: 30.934050, lng: 75.810590 },
  //   { lat: 30.938620, lng: 75.816780 },
  //   { lat: 30.9496591, lng: 75.8212431 }
  // );

  center = { lat: 30.900965, lng: 75.857277 };
  marker;
  constructor() { }

  ngOnInit() {
    this.mapboxInit();
  }


  valuechange() {
    this.visible = !this.visible;
  }




  /**
   * Mapbox Integration
   */
  mapboxInit = () => {

    // Initialize Map
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 3,
      center: [-104.618896, 50.445210],
      accessToken: environment.mapBox.accessToken
    });

    // Add Navigation
    this.map.addControl(new mapboxgl.NavigationControl());


    const mapboxClient = mapboxSdk({ accessToken: environment.mapBox.accessToken });
    const geocodingService = geocoding(mapboxClient);
    const mockData = this.getDriverData();
    const processData = mockData;
    console.log(mockData);
    this.frontEndData = processData;
    processData.drivers.forEach(async driver => {

      const data = await geocodingService.reverseGeocode({
        query: driver.location,
        limit: 1,
        types: ['region']
      }).send();


      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h6>${driver.driverName}</h6>
        Load: ${driver.loadCapacity}</br>
        Speed: ${driver.speed}<br>
        Location: ${data.body.features[0].place_name}
      `);
      const latLang = new mapboxgl.LngLat(driver.location[0], driver.location[1]);
      const el = document.createElement('div');
      //  el.className = 'marker';
      el.style.backgroundImage = 'url(../../assets/img/cirlce-stroke.png)';
      el.style.backgroundSize = 'cover';
      // el.style.backgroundColor = 'red';
      el.style.width = '32px';
      el.style.height = '32px';


      el.id = 'marker';

      new mapboxgl.Marker(el)
        .setLngLat(latLang)
        .setPopup(popup) // sets a popup on this marker
        .addTo(this.map);
    });


  }

  /** MOCK DATA:  This data will be from service */
  getDriverData() {
    const mockData = {
      'drivers': [
        {
          'driverName': 'Luca Steele',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [-104.618896, 50.445210]
        },
        {
          'driverName': 'Maariya Holloway',
          'loadCapacity': '10000 tonnes',
          'speed': '100 mile/hr',
          'location': [-79.383186, 43.653225]
        },
        {
          'driverName': 'Regina Cole',
          'loadCapacity': '1500 tonnes',
          'speed': '30 mile/hr',
          'location': [-110.670044, 48.133213]
        },
        {
          'driverName': 'Luisa Leech',
          'loadCapacity': '1200 tonnes',
          'speed': '110 mile/hr',
          'location': [-115.670044, 57.133213]
        },
        {
          'driverName': 'Karina Kennedy',
          'loadCapacity': '2000 tonnes',
          'speed': '80 mile/hr',
          'location': [-106.6700445, 52.133213]
        },
        {
          'driverName': 'Dru Drake',
          'loadCapacity': '2000 tonnes',
          'speed': '80 mile/hr',
          'location': [-113.490929, 53.544388]
        },
        {
          'driverName': 'Drain Drake',
          'loadCapacity': '2000 tonnes',
          'speed': '80 mile/hr',
          'location': [-135.000000, 64.282326]
        }
      ]
    };

    return mockData;
  }

  flyToDriver(currentFeature) {

    this.map.flyTo({
      center: currentFeature,
      zoom: 15
    });


  }
}
