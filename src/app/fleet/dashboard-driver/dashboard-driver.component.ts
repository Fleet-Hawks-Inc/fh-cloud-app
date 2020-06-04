import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as mapboxSdk from "@mapbox/mapbox-sdk";
import * as geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import * as mapboxgl from "mapbox-gl";
import { environment } from "src/environments/environment";
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import {Subscription} from "rxjs/index";


declare var $: any;
@Component({
  selector: "app-dashboard-driver",
  templateUrl: "./dashboard-driver.component.html",
  styleUrls: ["./dashboard-driver.component.css"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("400ms", style({ transform: "translateX(0%)" })),
      ]),
      transition(":leave", [
        animate("400ms", style({ transform: "translateX(100%)" })),
      ]),
    ]),
  ],
})
export class DashboardDriverComponent implements OnInit {
  title = "Map Dashboard";
  visible = true;


  //mqtt props
  private subscription: Subscription;
  topicname: any = 'GPS/FH101';
  msg: any;
  isConnected: boolean = false;
  @ViewChild('msglog', { static: true }) msglog: ElementRef;

  // Mapbox Integration
  map: mapboxgl.Map;
  style = "mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g";
  lat = -104.618896;
  lng = 50.44521;
  isControlAdded = false;
  frontEndData = {
    drivers: {},
  };


  center = { lat: 30.900965, lng: 75.857277 };
  marker;

  constructor(private _mqttService: MqttService) { }


  ngOnDestroy(){
    this.subscription.unsubscribe();
    
    //this._mqttService.
  }

  ngOnInit() {
    this.mapboxInit();
    this.subscribeNewTopic();

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
      container: "map",
      style: this.style,
      zoom: 10,
      center: [-104.618896, 50.44521],
      accessToken: environment.mapBox.accessToken,
    });

    // Add Navigation
    this.map.addControl(new mapboxgl.NavigationControl());

    const mapboxClient = mapboxSdk({
      accessToken: environment.mapBox.accessToken,
    });
    const geocodingService = geocoding(mapboxClient);
    const mockData = this.getDriverData();
    const processData = mockData;
    console.log(mockData);
    this.frontEndData = processData;
    processData.drivers.forEach(async (driver) => {
      const data = await geocodingService
        .reverseGeocode({
          query: driver.location,
          limit: 1,
          types: ["region"],
        })
        .send();

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h6>${driver.driverName}</h6>
        Load: ${driver.loadCapacity}</br>
        Speed: ${driver.speed}<br>
        Location: ${data.body.features[0].place_name}
      `);
      const latLang = new mapboxgl.LngLat(
        driver.location[0],
        driver.location[1]
      );
      const el = document.createElement("div");
      //  el.className = 'marker';
      el.style.backgroundImage = "url(../../assets/img/map-arrow.png)";
      el.style.backgroundSize = "cover";
      // el.style.backgroundColor = 'red';
      el.style.width = "32px";
      el.style.height = "32px";

      el.id = "marker";

      new mapboxgl.Marker(el)
        .setLngLat(latLang)
        .setPopup(popup) // sets a popup on this marker
        .addTo(this.map);
    });
  };

  /** MOCK DATA:  This data will be from service */
  getDriverData() {
    const mockData = {
      drivers: [
        {
          driverName: "Luca Steele",
          loadCapacity: "1001 tonnes",
          speed: "50 mile/hr",
          location: [-104.618896, 50.44521],  
        }
      ]
    };

    return mockData;
  }

  flyToDriver(lat, long) {
    this.map.flyTo({
      center: [lat, long],
      zoom: 15,
    });
  }

  subscribeNewTopic(): void {
    //console.log('inside subscribe new topic')
    this.subscription = this._mqttService.observe(this.topicname).subscribe((message: IMqttMessage) => {
      this.msg = message;

      
    // this.flyToDriver(30.9010, 75.8573);
     
      let coordi: any = message.payload.toString();
      // let arr = coordi.split(',');
      // let latParse = arr[0];
      // let latArr = latParse.split(':');
      //let finalLat = latArr[1];
     console.log(coordi);
     // this.logMsg('Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
    });
   // this.logMsg('subscribed to topic: ' + this.topicname)
  }

  sendmsg(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish(this.topicname, this.msg, { qos: 1, retain: true })
    this.msg = ''
  }
  
  logMsg(message): void {
    //console.log(message);
   // this.msglog.nativeElement.innerHTML += '<br><hr>' + message;
  }

  clear(): void {
    //this.msglog.nativeElement.innerHTML = '';
  }
  
}
