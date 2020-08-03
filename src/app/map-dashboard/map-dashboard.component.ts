import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MapBoxService } from "../map-box.service";
import * as mapboxSdk from '@mapbox/mapbox-sdk';
import * as geocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

import { HereMapService } from '../services/here-map.service';
import { Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';



declare var $: any;
declare var H: any;

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
  visible = false;

  private platform: any;
  private readonly apiKey = environment.mapConfig.apiKey;
  public map;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  driverData : any;
  

  // Mapbox Integration
  style = 'mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g';
  lat = -104.618896;
  lng = 50.445210;
  isControlAdded = false;
  frontEndData = {
    drivers: {},
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
  constructor(private mapBoxService: MapBoxService, private HereMap: HereMapService) { 
    
  }

  ngOnInit() {
    this.platform = new H.service.Platform({
      'apikey': this.apiKey,
    });

    this.map = this.HereMap.mapInit();
    this.searchLocation();
    this.showDriverData()
    
  }

  

  userDestination = async (value: any) => {
    const service = this.platform.getSearchService();
    let result = await service.geocode({ q: value });
    let positionFound = result.items[0].position;
    this.map.setCenter({
        lat: positionFound.lat,
        lng: positionFound.lng
    });
      const currentLoc = new H.map.Marker({ lat: positionFound.lat, lng: positionFound.lng });
      this.map.addObject(currentLoc);
    
  }


  valuechange() {
    this.visible = !this.visible;
  }




  /**
   * Mapbox Integration
   */
  // mapboxInit = () => {

  //   // Initialize Map
  //   this.map = new mapboxgl.Map({
  //     container: 'map',
  //     style: this.style,
  //     zoom: 3,
  //     center: [-104.618896, 50.445210],
  //     accessToken: environment.mapBox.accessToken
  //   });

  //   // Add Navigation
  //   this.map.addControl(new mapboxgl.NavigationControl());


  //   const mapboxClient = mapboxSdk({ accessToken: environment.mapBox.accessToken });
  //   const geocodingService = geocoding(mapboxClient);
  //   const mockData = this.getDriverData();
  //   const processData = mockData;
  //   console.log(mockData);
  //   this.frontEndData = processData;
  //   processData.drivers.forEach(async driver => {

  //     const data = await geocodingService.reverseGeocode({
  //       query: driver.location,
  //       limit: 1,
  //       types: ['region']
  //     }).send();


  //     const popup = new mapboxgl.Popup({ offset: 25 })
  //       .setHTML(`<h6>${driver.driverName}</h6>
  //       Load: ${driver.loadCapacity}</br>
  //       Speed: ${driver.speed}<br>
  //       Location: ${data.body.features[0].place_name}
  //     `);
  //     const latLang = new mapboxgl.LngLat(driver.location[0], driver.location[1]);
  //     const el = document.createElement('div');
  //     //  el.className = 'marker';
  //     el.style.backgroundImage = 'url(../../assets/img/cirlce-stroke.png)';
  //     el.style.backgroundSize = 'cover';
  //     // el.style.backgroundColor = 'red';
  //     el.style.width = '32px';
  //     el.style.height = '32px';


  //     el.id = 'marker';

  //     new mapboxgl.Marker(el)
  //       .setLngLat(latLang)
  //       .setPopup(popup) // sets a popup on this marker
  //       .addTo(this.map);
  //   });


  // }
  
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
      // if (target.target.id === 'sourceLocation') {
      //   this.showSource = true;
      // } 
    });
  }


  showDriverData(){
    
    const mockData = this.getDriverData();
    const geocoder = this.platform.getGeocodingService();
    this.frontEndData = mockData;
    
    mockData.drivers.forEach(async driver => {
      const result = await geocoder.reverseGeocode(
        {
          prox: `${driver.location[0]},${driver.location[1]}`,
          mode: 'retrieveAddresses',
          maxresults: '1',
        }
      );
      //console.log(result);
      
      const origin = location.origin;
      let customMarker  =   origin+'/assets/img/cirlce-stroke.png';
      let icon = new H.map.Icon(customMarker,{size: {w: 40, h: 40}});
      
      var markers = new H.map.Marker(
        {
          lat:driver.location[0], lng:driver.location[1]
        }, {
          icon: icon,
        }
        );
      this.map.addObject(markers);
      const defaultLayers = this.platform.createDefaultLayers();
      let ui = H.ui.UI.createDefault(this.map, defaultLayers);
      markers.setData(`<h5>${driver.driverName}</h5>
      Load: ${driver.loadCapacity}</br>
      Speed: ${driver.speed}<br>
      Location: ${result.Response.View[0].Result[0].Location.Address.Label}
      `);
      markers.addEventListener('tap', function (evt) {
        var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
          // read custom data
          content: evt.target.getData()
        });
        
        // show info bubble
        ui.addBubble(bubble);
      
      },false)
      
    
    }
    );
    
        
  }

  /** MOCK DATA:  This data will be from service */
  getDriverData() {
    const mockData = {
      'drivers': [
        {
          'driverName': 'Luca Steele',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [51.055783,-114.068639],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Maariya Holloway',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [51.052058,-114.071666],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Regina Cole',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [51.042866,-114.098134],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Luisa Leech',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [51.042830,-114.143733],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Karina Kennedy',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [50.860450,-114.036036],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Dru Drake',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'on Time',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1001 tonnes',
          'speed': '50 mile/hr',
          'location': [50.751927,-111.897283],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        },
        {
          'driverName': 'Drain Drake',
          'driverStatus': 'ON',
          'drivingCycle': '10D',
          'vehicle': 'F 3650',
          'trailer: ': '2356',
          'scheduleStatus': 'Late',
          'dispatchId': 'DIS-6140',
          'loadCapacity': '1200 tonnes',
          'speed': '40 mile/hr',
          'location': [50.978391,-110.041988],
          'temprature': {
            'setTemperature': '15',
            'actualTemperature': '14',
          },
          'referTemprature': {
            'refeer1': '14',
            'refeer2': '15',
            'refeer3': '16',
          }
        }
      ]
    };

    return mockData;
  }

  flyToDriver(currentFeature) {
    this.map.setCenter({
      lat: currentFeature[0],
      lng: currentFeature[1]
    });
    this.visible = false;
    this.map.getViewModel().setLookAtData({
      zoom: 17,
    });
  }
}
