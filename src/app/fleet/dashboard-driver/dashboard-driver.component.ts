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
  lat = 0;
  lng = 0;
  isControlAdded = false;



  center = { lat: 30.900965, lng: 75.857277 };
  marker;

  constructor(private _mqttService: MqttService) { }


  ngOnDestroy(){
    this.subscription.unsubscribe();
    
    //this._mqttService.
  }

  ngOnInit() {
    this.mapboxInit();
   // this.subscribeNewTopic();

  
   setInterval(() => {this.animateMarker(Date.now()), 1000});


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
      zoom: 2,
      center: [0, 0],
      accessToken: environment.mapBox.accessToken,
    });


    this.marker = new mapboxgl.Marker();
    this.marker.setLngLat([
      this.lng,
      this.lat
      ]);   
  
  };



   animateMarker(timestamp) {
    var radius = 20;
     console.log(timestamp);
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    this.marker.setLngLat([
      Math.cos(timestamp / 1000) * radius,
      Math.sin(timestamp / 1000) * radius
    ]);
     
    // Ensure it's added to the map. This is safe to call if it's already added.
    this.marker.addTo(this.map);
     
    // Request the next frame of the animation.
    // requestAnimationFrame(animateMarker);
    }

 

  flyToDriver(lat, long) {console.log('hello');
    this.map.flyTo({
      center: [lat, long],
      zoom: 15,
      popup: "url(../../assets/img/map-arrow.png)"
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
    //  console.log(coordi);
    // let jsonGeo = JSON.parse(coordi);
    let arr = coordi.split(',');
    let lat = arr[0];
    let lng = arr[1];
    lat = parseFloat(lat);
    lng = parseFloat(lng);
      console.log(parseFloat(lat));
     if(lat && lng) {
      this.flyToDriver(lng, lat);
      this.lat = lat;
      this.lng = lng;
     }
      //  this.flyToDriver(parseFloat(lat), parseFloat(lng));
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
